import fp from 'fastify-plugin';

export default fp(async (fastify) => {
  fastify.setErrorHandler((error, request, reply) => {
    if (!error.statusCode || error.statusCode >= 500) {
      const statusCode = error.statusCode || 500;
      fastify.log.error(error);
      return reply.status(statusCode).send({
        statusCode,
        error: 'Internal Server Error',
        message: 'Something went wrong',
      });
    } else reply.send(error);
  });
});
