import { buildRoute } from '../../helper';
import { prismaMock } from '../../prismaMock';
import healthCheck from '../../../src/routes/healthCheck/index';
import { FastifyInstance } from 'fastify';
import { DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

type App = FastifyInstance & { prisma: DeepMockProxy<PrismaClient> };

describe('healthCheck', () => {
  const app = buildRoute(healthCheck) as unknown as App;

  app.prisma = prismaMock;

  it('returns user with email', async () => {
    // @ts-expect-error
    app.prisma.account.findUnique.mockResolvedValue({
      id: 1,
      email: 'somemail@gmail.com',
      name: 'cudi',
    });

    const res = await app.inject({
      url: '/',
      method: 'POST',
      payload: {
        email: 'somemail@gmail.com',
      },
    });

    expect(JSON.parse(res.payload)).toEqual({
      id: 1,
      email: 'somemail@gmail.com',
      name: 'cudi',
    });
  });
});
