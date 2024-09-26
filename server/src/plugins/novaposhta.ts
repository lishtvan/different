import fp from 'fastify-plugin';
import { initNovaPoshta } from 'novaposhtajs/build/NovaPoshta';
import SchemaCallable from 'novaposhtajs/build/SchemaCallable';

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
}) => Promise<{
  trackingNumber: string;
  intDocRef: string;
  success: boolean;
  translatedErrors?: string[];
}>;

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
    success,
    translatedErrors,
    data: [internetDocument],
  } = await fetch('https://api.novaposhta.ua/v2.0/json/', {
    headers: { 'content-type': 'application/json', tokenoauth2: process.env.NP_TOKEN },
    body: JSON.stringify({
      modelName: 'InternetDocument',
      calledMethod: 'save',
      system: 'PA 3.0',
      methodProperties: {
        RecipientType: 'PrivatePerson',
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

  return {
    trackingNumber: internetDocument?.IntDocNumber,
    intDocRef: internetDocument?.Ref,
    success,
    translatedErrors,
  };
};

export default fp(async (fastify) => {
  const client = initNovaPoshta(process.env.NP_API_KEY);
  const formatTrackingNumber = (trackingNumber: string) => {
    return trackingNumber.replace(/(\d{2})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
  };

  fastify.decorate('np', { createSafeDelivery, client, formatTrackingNumber });
});

declare module 'fastify' {
  interface FastifyInstance {
    np: {
      createSafeDelivery: CreateSafeDelivery;
      client: SchemaCallable;
      formatTrackingNumber: (n: string) => string;
    };
  }
}
