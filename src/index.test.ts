import { describe, it, expect } from 'vitest';

describe('sum test', () => {
  it('adds 1 + 2 to equal 3', () => {
    expect(1 + 2).toBe(3);
  });
  it('adds 2 + 3 to equal 3', () => {
    expect(2 + 3).toBe(5);
  });
});
