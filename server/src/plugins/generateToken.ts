import fp from 'fastify-plugin';
import { createHash, randomBytes, randomFillSync } from 'crypto';

export default fp(async (fastify) => {
  const UINT32_MAX = 0xffffffff;
  const BUF_LEN = 1024;
  const BUF_SIZE = BUF_LEN * Uint32Array.BYTES_PER_ELEMENT;

  const randomPrefetcher = {
    buf: randomBytes(BUF_SIZE),
    pos: 0,
  };

  const cryptoRandom = () => {
    if (randomPrefetcher.pos === randomPrefetcher.buf.length) {
      randomPrefetcher.pos = 0;
      randomFillSync(randomPrefetcher.buf);
    }
    const val = randomPrefetcher.buf.readUInt32LE(randomPrefetcher.pos);
    randomPrefetcher.pos += Uint32Array.BYTES_PER_ELEMENT;
    return val / (UINT32_MAX + 1);
  };

  const generateKey = (length: number, possible: string) => {
    const base = possible.length;
    let key = '';
    for (let i = 0; i < length; i++) {
      const index = Math.floor(cryptoRandom() * base);
      key += possible[index];
    }
    return key;
  };

  const crcToken = (secret: string, key: string) => {
    const md5 = createHash('md5').update(key + secret);
    return md5.digest('hex').substring(0, 4);
  };

  const generateToken = (secret: string, characters: string, length = 64) => {
    const key = generateKey(length - 4, characters);
    return key + crcToken(secret, key);
  };

  fastify.decorate('generateToken', generateToken);
});

declare module 'fastify' {
  interface FastifyInstance {
    generateToken: (secret: string, characters: string, length?: number) => string;
  }
}
