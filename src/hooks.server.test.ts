import type { RequestEvent } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import { describe, expect, it, vi } from 'vitest';
import { handle } from './hooks.server';

const mockUrl = new URL('http://localhost:5173');
const mockRequestEvent: () => RequestEvent = () => ({
  cookies: {
    get: () => undefined,
    getAll: () => [{ name: 'cookie', value: 'session' }],
    set: () => {},
    delete: () => {},
    serialize: () => 'cookie=session',
  },
  fetch,
  getClientAddress: () => 'client-address',
  locals: {
    pb: new PocketBase(),
    user: undefined,
  },
  params: {},
  platform: undefined,
  request: new Request(mockUrl),
  route: { id: null },
  setHeaders: () => {},
  url: mockUrl,
  isDataRequest: false,
  isSubRequest: false,
});
const mockRequestResolve = vi.fn().mockResolvedValue(new Response());

describe('handle', async () => {
  await vi.importMock('pocketbase');

  it('basic request', async () => {
    const event = mockRequestEvent();
    const pb = event.locals.pb;

    const response = await handle({
      event,
      resolve: mockRequestResolve,
    });

    expect(event.locals.pb).not.toBe(pb);
    expect(event.locals.user).toBeUndefined();
    expect(mockRequestResolve).toBeCalled();
    expect(response.headers.get('set-cookie')).not.toBeNull();
  });
});
