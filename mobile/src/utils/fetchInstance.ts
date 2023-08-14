import Config from 'react-native-config';

interface Fetcher {
  (input: {
    route: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: {
      [key: string]: unknown;
    };
    domain?: string;
  }): Promise<Response>;
}

export const fetcher: Fetcher = async ({
  route,
  body,
  method = 'POST',
  domain = Config.API_DOMAIN,
}) => {
  const headers = new Headers();

  let response;
  if (body) {
    headers.append('Content-type', 'application/json');
    response = await fetch(`${domain}${route}`, {
      method,
      headers,
      body: JSON.stringify(body),
    });
  } else {
    response = await fetch(`${domain}${route}`, {method, headers});
  }

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
