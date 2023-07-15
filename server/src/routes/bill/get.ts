import { FastifyPluginAsync } from 'fastify';

const schema = {
  tags: ['Bill'],
};

const getBill: FastifyPluginAsync = async (fastify) => {
  fastify.post('/get', { schema }, async (req, reply) => {
    const { userId } = req.cookies;

    const bills = await fastify.prisma.listing.findMany({
      where: { userId: Number(userId), Order: { status: 'COMMISSION' } },
      select: { id: true, price: true, title: true },
    });

    if (bills.length === 0) return reply.send({ isBill: false });

    let totalCommission = 0;

    const calculatedBills = bills.map((bill) => {
      const commission = Math.ceil((bill.price / 100) * 5);
      totalCommission += commission;
      return { ...bill, commission };
    });

    return reply.send({ bills: calculatedBills, totalCommission });
  });
};

export default getBill;
