import type { LayoutServerLoad } from './$types';
import UAParser from 'ua-parser-js';

export const load = (async ({ locals, request }) => {
  let agent;
  const userAgent = request.headers.get('user-agent');
  if (userAgent) {
    const parser = new UAParser(userAgent);
    agent = parser.getResult();
  }

  return {
    user: locals.user,
    agent,
  };
}) satisfies LayoutServerLoad;
