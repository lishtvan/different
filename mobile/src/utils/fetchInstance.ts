import Config from 'react-native-config';
import { getSession } from './secureStorage';

interface Fetcher {
  (input: {
    route: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: { [key: string]: unknown };
    domain?: string;
    navigation: any;
  }): Promise<any>;
}

export const fetcher: Fetcher = async ({
  route,
  body,
  method = 'POST',
  domain = Config.API_DOMAIN,
  navigation,
}) => {
  console.log('fetch is happening');
  const headers = new Headers();
  headers.append('Content-type', 'application/json');

  const session = await getSession();
  if (session) {
    const { token, userId } = JSON.parse(session);
    headers.append('Cookie', `token=${token}; userId=${userId}`);
  }

  let response;
  if (body) {
    response = await fetch(`${domain}${route}`, {
      method,
      headers,
      body: JSON.stringify(body),
    });
  } else {
    response = await fetch(`${domain}${route}`, { method, headers });
  }

  if (response.status === 401) navigation.navigate('Auth');

  const json = await response.json();
  return json;
};

// if (response.headers.get('bill') && !request.url.includes('/bill')) {
//   throw redirect('/bill');
// }
// if (response.status < 400) return response;

// if (response.status === 401 && route !== '/auth/check') {
//   throw redirect(`/?login=true`);
// }

// if (response.status === 404) throw new Response('', {status: 404});
// if (response.status === 500) throw new Response('', {status: 500});
