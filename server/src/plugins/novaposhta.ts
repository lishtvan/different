import fp from 'fastify-plugin';
import { initNovaPoshta } from 'novaposhtajs/build/NovaPoshta';
import { LISTINGS_COLLECTION_NAME } from '../constants/typesense';

type CreateSafeDelivery = (props: {
  CityRecipient: string;
  RecipientAddress: string;
  Description: string;
  RecipientsPhone: string;
  Cost: number;
  firstName: string;
  lastName: string;
  cardNumber: string;
  SendersPhone: string;
}) => Promise<{ trackingNumber?: string }>;

const createSafeDelivery: CreateSafeDelivery = async ({
  CityRecipient,
  Description,
  RecipientAddress,
  RecipientsPhone,
  SendersPhone,
  Cost,
  firstName,
  lastName,
  cardNumber,
}) => {
  const np = initNovaPoshta(process.env.NP_API_KEY);
  const [counterpartySender] = await np.counterparty.getCounterparties({
    counterpartyProperty: 'Sender',
  });
  const [counterpartyRecipient] = await np.counterparty.getCounterparties({
    counterpartyProperty: 'Recipient',
  }); // Parallel

  const [counterpartyContact] = await fetch('https://api.novaposhta.ua/v2.0/json/', {
    body: JSON.stringify({
      modelName: 'ContactPersonGeneral',
      apiKey: process.env.NP_API_KEY,
      calledMethod: 'getContactPersonsList',
      methodProperties: {
        CounterpartyRef: counterpartySender.ref,
        ContactProperty: 'Sender',
        Limit: 200,
        Page: 1,
        getContactPersonAddress: 1,
        FindByString: '',
      },
    }),
    method: 'POST',
  })
    .then((res) => res.json())
    .then((res) => res.data);

  const [contactRecipient] = await np.contactPerson.save({
    counterpartyRef: counterpartyRecipient.ref,
    firstName,
    lastName,
    middleName: '',
    phone: RecipientsPhone,
  });

  const payout = await fetch('https://api.novaposhta.ua/v2.0/json/', {
    body: JSON.stringify({
      modelName: 'Payment',
      apiKey: process.env.NP_API_KEY,
      calledMethod: 'initPayout',
      methodProperties: { Phone: RecipientsPhone },
    }),
    method: 'POST',
  })
    .then((res) => res.json())
    .then((res) => res.data[0]);

  const { pan } = await fetch(
    `https://e-com.novapay.ua/api/payout?sid=${payout.Id}&lang=ua&theme=`,
    {
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ pan: cardNumber, expire: '' }),
      method: 'POST',
    }
  ).then((res) => res.json());

  const date = new Date();
  const {
    data: [internetDocument],
  } = await fetch('https://api.novaposhta.ua/v2.0/json/', {
    headers: { 'content-type': 'application/json', tokenoauth2: process.env.NP_TOKEN },
    body: JSON.stringify({
      modelName: 'InternetDocument',
      calledMethod: 'save',
      system: 'PA 3.0',
      methodProperties: {
        ContactRecipient: contactRecipient.ref,
        CitySender: counterpartyContact.Addresses.WarehouseAddresses[0].CityRef,
        SenderAddress: counterpartyContact.Addresses.WarehouseAddresses[0].Ref,
        Sender: counterpartySender.ref,
        ContactSender: counterpartyContact.Ref,
        SendersPhone,
        Recipient: counterpartyRecipient.ref,
        CityRecipient,
        RecipientAddress,
        RecipientsPhone,
        Description,
        Cost,
        BackwardDeliveryData: [
          {
            PayerType: 'Recipient',
            CargoType: 'Money',
            RedeliveryString: Cost,
            Cash2CardPayout_Id: payout.Id,
            Cash2CardAlias: '',
            Cash2CardPAN: pan,
          },
        ],
        SecurePayment: true,
        Number: payout.IntDocNumber,
        ServiceType: 'WarehouseWarehouse',
        CargoType: 'Cargo',
        ParamsOptionsSeats: true,
        PayerType: 'Recipient',
        PaymentMethod: 'Cash',
        InfoRegClientBarcodes: '',
        PackingNumber: '',
        Promocode: '',
        MarketplacePartnerToken: '005056887b8d-b5da-11e6-9f54-cea38574',
        AdditionalInformation: '',
        AccompanyingDocuments: '',
        DateTime: `${date.getDate()}.0${date.getMonth() + 1}.${date.getFullYear()}`,
        SeatsAmount: '1',
        Weight: '2',
        VolumeGeneral: '',
      },
    }),
    method: 'POST',
  }).then((res) => res.json());

  return { trackingNumber: internetDocument?.IntDocNumber };
};

export default fp(async (fastify) => {
  const trackInternetDocuments = async (userId: number) => {
    const orders = await fastify.prisma.order.findMany({
      where: {
        OR: [{ listing: { userId } }, { buyerId: userId }],
        NOT: { status: 'COMMISSION' },
        AND: { NOT: { status: 'FINISHED' } },
      },
      select: {
        trackingNumber: true,
        status: true,
      },
    });

    const documents = orders.map((order) => order.trackingNumber);

    const np = initNovaPoshta(process.env.NP_API_KEY);
    const internetDocuments = await np.trackingDocument.getStatusDocuments({
      documents,
    });
    const trackings = internetDocuments.map((i) => ({
      status: i.status,
      statusCode: i.statusCode,
      trackingNumber: i.number,
    }));
    console.log(trackings);

    const refusalStatusCodes = ['2', '3', '102', '103', '105', '111'];
    const shippingStatusesCodes = ['4', '5', '6', '7', '101'];
    const receivalStatusCodes = ['9', '10', '11'];

    const statusUpdatePromises = trackings.map((i) => {
      if (refusalStatusCodes.includes(i.statusCode)) {
        return fastify.prisma.order
          .delete({
            where: { trackingNumber: i.trackingNumber },
            select: { listing: { select: { id: true } } },
          })
          .then(async (res) => {
            await fastify.prisma.listing.update({
              where: { id: res.listing.id },
              data: { status: 'AVAILABLE' },
            });
            await fastify.typesense
              .collections(LISTINGS_COLLECTION_NAME)
              .documents()
              .update({ status: 'AVAILABLE', id: res.listing.id.toString() });
          });
      }
      if (i.statusCode === '1' && !i.status.includes('оплату')) {
        const order = orders.find((order) => order.trackingNumber === i.trackingNumber);
        if (order?.status === 'HANDLING') return;
        return fastify.prisma.order.update({
          where: { trackingNumber: i.trackingNumber },
          data: { status: 'HANDLING' },
        });
      }
      if (shippingStatusesCodes.includes(i.statusCode)) {
        const order = orders.find((order) => order.trackingNumber === i.trackingNumber);
        if (order?.status === 'SHIPPING') return;
        return fastify.prisma.order.update({
          where: { trackingNumber: i.trackingNumber },
          data: { status: 'SHIPPING' },
        });
      }
      if (receivalStatusCodes.includes(i.statusCode)) {
        return fastify.prisma.order.update({
          where: { trackingNumber: i.trackingNumber },
          data: { status: 'COMMISSION' },
        });
      }
    });
    await Promise.all(statusUpdatePromises);
  };

  fastify.decorate('np', {
    createSafeDelivery,
    trackInternetDocuments,
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    np: {
      createSafeDelivery: CreateSafeDelivery;
      trackInternetDocuments: (userId: number) => Promise<void>;
    };
  }
}

// { status: 'Відмова від отримання', statusCode: '102' } // Bodya refuse
// { status: 'Покупка не підтверджена Покупцем', statusCode: '2' }, // EN Deleted
// {
//   status: 'Очікуємо на посилку від Відправника, щоб доставити її Одержувачу',
//   statusCode: '1'
// } // Payed
// {
//   status: 'Відправлення у м. Апостолове',
//   statusCode: '4',
//   trackingNumber: '20450739397986'
// },
// {
//   status: 'Очікує на оплату доставки та сейф-сервісу',
//   statusCode: '1'
// }
