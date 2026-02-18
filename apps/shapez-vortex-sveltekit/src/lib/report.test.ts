import { describe, expect, it } from 'vitest';
import { REPORT_CREATE_SCHEMA, type Report } from './report';

const mockReport: Report = {
  blueprint: 'abcdefghijklmno',
  user: 'tester',
  reason: 'other',
  message: 'Report blueprint',
};
const createMockReport = (report?: Partial<Report>): Report => {
  return { ...mockReport, ...report };
};

describe('create', () => {
  it('success', () => {
    const data = createMockReport();
    expect(() => REPORT_CREATE_SCHEMA.parse(data)).not.toThrow();
  });

  it('success - default reason to "other"', () => {
    const data = createMockReport();
    const result = REPORT_CREATE_SCHEMA.safeParse(data);
    expect(result.success).toBe(true);
    expect(result.data?.reason).toBe('other');
  });

  it('success - default resolved to "undefined"', () => {
    const data = createMockReport();
    const result = REPORT_CREATE_SCHEMA.safeParse(data);
    expect(result.success).toBe(true);
    expect(result.data?.resolved).toBe(undefined);
  });

  it('failure - blueprint id invalid', () => {
    const data = createMockReport({
      message:
        'Very long message to have many many many many many many many many many many many many many many many many many many many many many many many many many many many many many many many many many many many many many many many many many many many many many characters.',
    });
    expect(() => REPORT_CREATE_SCHEMA.parse(data)).toThrow();
  });
});
