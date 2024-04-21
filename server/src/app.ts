import { join } from 'path';
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload';
import { FastifyPluginAsync, FastifyServerOptions } from 'fastify';
import { schemaErrorFormatter } from './utils/schemaErrorFormatter';
import ajvErrors from 'ajv-errors';

export interface AppOptions
  extends FastifyServerOptions,
    Partial<AutoloadPluginOptions> {}

const options: AppOptions = {
  logger: { level: 'error' },
  schemaErrorFormatter,
  ajv: { customOptions: { allErrors: true }, plugins: [ajvErrors] },
};

const app: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
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
export { app, options };
