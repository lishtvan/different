import { FastifyPluginAsync } from 'fastify';

const schema = {
  tags: ['Bill'],
};

const getBill: FastifyPluginAsync = async (fastify) => {
  fastify.post('/getPaymentLink', { schema }, async (req, reply) => {
    const { userId } = req.cookies;
    const { MNBNK_WEBHOOK_KEY, WEB_DOMAIN, API_DOMAIN, MNBNK_TOKEN } = process.env;

    const soldItems = await fastify.prisma.listing.findMany({
      where: { userId: Number(userId), Order: { status: 'COMMISSION' } },
      select: { price: true, Order: { select: { id: true } } },
    });

    if (soldItems.length === 0) throw fastify.httpErrors.badRequest();

    let totalCommission = 0;
    const orderIds: string[] = [];

    soldItems.forEach((item) => {
      const commission = Math.ceil((item.price / 100) * 5);
      totalCommission += commission;
      orderIds.push(item.Order!.id);
    });

    const reference = orderIds.join('+');

    const { pageUrl } = await fetch(
      'https://api.monobank.ua/api/merchant/invoice/create',
      {
        headers: { 'content-type': 'application/json', 'X-Token': MNBNK_TOKEN },
        body: JSON.stringify({
          amount: totalCommission * 100,
          redirectUrl: `${WEB_DOMAIN}`,
          merchantPaymInfo: { reference, destination: 'Оплата послуг Different' },
          webHookUrl: `${API_DOMAIN}/bill/webhook/${MNBNK_WEBHOOK_KEY}`,
        }),
        method: 'POST',
      }
    ).then((res) => res.json());

    return reply.send({ paymentLink: pageUrl });
  });
};

export default getBill;
