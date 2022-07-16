import { buildRoute } from '../helper';
import root from '../../src/routes/root';

describe('root', () => {
  const app = buildRoute(root);

  it('returns hello world', async () => {
    const res = await app.inject({
      url: '/',
    });

    expect(JSON.parse(res.payload)).toEqual({ hello: 'world' });
  });
});
