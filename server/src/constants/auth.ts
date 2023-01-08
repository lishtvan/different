export const COOKIE_OPTIONS = {
  path: '/',
  secure: true,
  httpOnly: true,
  maxAge: 86400 * 500, // last number is days
  domain: process.env.NODE_ENV === 'local' ? 'localhost' : '.different-marketplace.com',
};
