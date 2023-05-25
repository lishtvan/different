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

export default fp(async (fastify) => {
  fastify.decorate('np', {
    initNovaPoshta,
    checkNpApiKeyValidity,
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    np: {
      initNovaPoshta: typeof initNovaPoshta;
      checkNpApiKeyValidity: typeof checkNpApiKeyValidity;
    };
  }
}
