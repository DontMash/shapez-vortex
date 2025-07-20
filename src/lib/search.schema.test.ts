import { describe, expect, it } from 'vitest';
import { PAGINATION_SCHEMA, SEARCH_SCHEMA } from './search.schema';

describe('search', () => {
  it('success - default', () => {
    const data = {};
    const result = SEARCH_SCHEMA.safeParse(data);
    expect(result.success).toBe(true);
    expect(result.error).toBe(undefined);
    expect(result.data?.sort).toBe('created');
    expect(result.data?.order).toBe('desc');
  });

  it('success - options', () => {
    const data = { sort: 'updated', order: 'asc' };
    const result = SEARCH_SCHEMA.safeParse(data);
    expect(result.success).toBe(true);
    expect(result.error).toBe(undefined);
    expect(result.data?.sort).toBe('updated');
    expect(result.data?.order).toBe('asc');
  });

  it('failure', () => {
    const data = { sort: null };
    const result = SEARCH_SCHEMA.safeParse(data);
    expect(result.success).toBe(false);
    expect(result.data).toBe(undefined);
    expect(result.error).toBeDefined();
  });
});

describe('pagination', () => {
  it('success - default', () => {
    const data = {};
    const result = PAGINATION_SCHEMA.safeParse(data);
    expect(result.success).toBe(true);
    expect(result.error).toBe(undefined);
    expect(result.data?.page).toBe(1);
    expect(result.data?.perPage).toBe(10);
  });

  it('success - default', () => {
    const data = { page: 2, perPage: 100 };
    const result = PAGINATION_SCHEMA.safeParse(data);
    expect(result.success).toBe(true);
    expect(result.error).toBe(undefined);
    expect(result.data?.page).toBe(2);
    expect(result.data?.perPage).toBe(100);
  });

  it('failure', () => {
    const data = { page: '1' };
    const result = PAGINATION_SCHEMA.safeParse(data);
    expect(result.success).toBe(false);
    expect(result.data).toBe(undefined);
    expect(result.error).toBeDefined();
  });
});
