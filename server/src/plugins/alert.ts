import fp from 'fastify-plugin';

export default fp(async (fastify) => {
  const url = `https://api.telegram.org/bot${process.env.NOTIFICATION_TG_BOT_TOKEN}/sendMessage`;

  const sendAlert = (text: string) => {
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: '820787098', parse_mode: 'HTML', text }),
    });
  };

  fastify.decorate('alert', sendAlert);
});

declare module 'fastify' {
  interface FastifyInstance {
    alert: (text: string) => void;
  }
}
