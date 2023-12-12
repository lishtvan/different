import { join } from 'path';
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload';
import { FastifyPluginAsync } from 'fastify';
import ajvErrors from 'ajv-errors';
import { schemaErrorFormatter } from './utils/schemaErrorFormatter';

export type AppOptions = Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (fastify, opts) => {
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts,
  });

  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts,
  });
};

export default app;
export { app };

exports.options = {
  // logger: { level: 'error' },
  schemaErrorFormatter,
  ajv: { customOptions: { allErrors: true }, plugins: [ajvErrors] },
};
