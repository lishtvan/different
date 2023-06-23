import fp from 'fastify-plugin';
import { initNovaPoshta } from 'novaposhtajs/build/NovaPoshta';

type CreateSafeDelivery = (props: {
  CityRecipient: string;
  RecipientAddress: string;
  Description: string;
  RecipientsPhone: string;
  Cost: number;
  DateTime: string;
  firstName: string;
  lastName: string;
  cardNumber: string;
  SendersPhone: string;
}) => Promise<unknown>;

const createSafeDelivery: CreateSafeDelivery = async ({
  CityRecipient,
  Description,
  RecipientAddress,
  RecipientsPhone,
  SendersPhone,
  Cost,
  DateTime,
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
  });
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

  const InternetDocument = await fetch('https://api.novaposhta.ua/v2.0/json/', {
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
        DateTime,
        SeatsAmount: '1',
        Weight: '2',
        VolumeGeneral: '',
      },
    }),
    method: 'POST',
  }).then((res) => res.json());

  return InternetDocument;
};

export default fp(async (fastify) => {
  await createSafeDelivery({
    CityRecipient: 'f7062316-4078-11de-b509-001d92f78698',
    RecipientAddress: '169227e2-e1c2-11e3-8c4a-0050568002cf',
    RecipientsPhone: '380980015719',
    SendersPhone: '380950820647',
    Description: 'Кроссівки Nike Different',
    Cost: 100,
    DateTime: '22.06.2023',
    firstName: 'Юрій',
    lastName: 'Яблоновський',
    cardNumber: '5375411422818984',
  });

  fastify.decorate('np', {
    createSafeDelivery,
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    np: {
      createSafeDelivery: CreateSafeDelivery;
    };
  }
}
