import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['Listing'],
  body: {
    type: 'object',
    required: ['recipientId'],
    properties: {
      recipientId: { type: 'number' },
    },
  } as const,
};

type Schema = { Body: FromSchema<typeof schema.body> };

const createChat: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/create', { schema }, async (req, reply) => {
    const { recipientId } = req.body;
    const userId = Number(req.cookies.userId);
    if (userId === recipientId) throw fastify.httpErrors.notFound();
    const chat = await fastify.prisma.chat.findFirst({
      where: { Users: { every: { id: { in: [recipientId, userId] } } } },
    });

    if (chat) return reply.send({ chatId: chat.id });
    const recipient = await fastify.prisma.user.findUnique({
      where: { id: recipientId },
    });
    if (!recipient) throw fastify.httpErrors.notFound();
    const newChat = await fastify.prisma.chat.create({
      data: { Users: { connect: [{ id: recipientId }, { id: userId }] } },
    });

    return reply.send({ chatId: newChat.id });
  });
};

export default createChat;
