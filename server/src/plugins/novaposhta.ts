import fp from 'fastify-plugin';
import { initNovaPoshta } from 'novaposhtajs/build/NovaPoshta';

const checkNpApiKeyValidity = async (npApiKey: string): Promise<boolean> => {
  const { success } = await fetch('https://api.novaposhta.ua/v2.0/json/', {
    body: JSON.stringify({
      apiKey: npApiKey,
      modelName: 'Counterparty',
      calledMethod: 'getCounterparties',
      methodProperties: { CounterpartyProperty: 'Sender' },
    }),
    method: 'POST',
  }).then((res) => res.json());
  return success;
};

// BackwardDeliveryData: [
//   {
//     PayerType: 'Recipient',
//     CargoType: 'Money',
//     RedeliveryString: 200,
//     Cash2CardPayout_Id: '767d8375-26ff-4c46-84aa-5ee098779aed',
//     Cash2CardAlias: '',
//     Cash2CardPAN: '537541xxxxxx7863',
//   },
// ],
// SecurePayment: true, prefilled
// Number: '20450716963972',

type CreateSafeDelivery = (props: {
  npApiKey: string;
  CityRecipient: string;
  RecipientAddress: string;
  Description: string;
  RecipientsPhone: string;
  Cost: number;
  DateTime: string;
  firstName: string;
  lastName: string;
}) => Promise<unknown>;

const createSafeDelivery: CreateSafeDelivery = async ({
  npApiKey,
  CityRecipient,
  Description,
  RecipientAddress,
  RecipientsPhone,
  Cost,
  DateTime,
  firstName,
  lastName,
}) => {
  const np = initNovaPoshta(npApiKey);
  const [counterpartySender] = await np.counterparty.getCounterparties({
    counterpartyProperty: 'Sender',
  });
  const [counterpartyRecipient] = await np.counterparty.getCounterparties({
    counterpartyProperty: 'Recipient',
  });
  const [counterpartyContact] = await fetch('https://api.novaposhta.ua/v2.0/json/', {
    body: JSON.stringify({
      modelName: 'ContactPersonGeneral',
      apiKey: npApiKey,
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

  const internetDocument = await fetch('https://api.novaposhta.ua/v2.0/json/', {
    body: JSON.stringify({
      apiKey: npApiKey,
      modelName: 'InternetDocument',
      calledMethod: 'save',
      methodProperties: {
        ContactRecipient: contactRecipient.ref, // backend
        CitySender: counterpartyContact.Addresses.WarehouseAddresses[0].CityRef,
        SenderAddress: counterpartyContact.Addresses.WarehouseAddresses[0].Ref,
        Sender: counterpartySender.ref,
        ContactSender: counterpartyContact.Ref,
        SendersPhone: counterpartyContact.Phones,
        Recipient: counterpartyRecipient.ref,
        CityRecipient,
        RecipientAddress,
        RecipientsPhone,
        Description,
        Cost,
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
  return internetDocument;
};

export default fp(async (fastify) => {
  fastify.decorate('np', {
    checkNpApiKeyValidity,
    createSafeDelivery,
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    np: {
      checkNpApiKeyValidity: typeof checkNpApiKeyValidity;
      createSafeDelivery: CreateSafeDelivery;
    };
  }
}
