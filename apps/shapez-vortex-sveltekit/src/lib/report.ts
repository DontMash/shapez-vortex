import type { RecordModel } from 'pocketbase';
import { z } from 'zod';

export const REPORT_REASONS = {
  illegal: 'Illegal',
  discriminatory: 'Discriminatory',
  disrespectful: 'Disrespectful',
  other: 'Other',
} as const;
type ReportReason = keyof typeof REPORT_REASONS;
export const REPORT_CREATE_SCHEMA = z.object({
  blueprint: z.string().length(15),
  user: z.string(),
  reason: z
    .enum(Object.keys(REPORT_REASONS) as [ReportReason, ...ReportReason[]])
    .default('other'),
  message: z.string().max(256),
  resolved: z.boolean().optional(),
});
export type Report = z.infer<typeof REPORT_CREATE_SCHEMA>;
export type ReportRecord = RecordModel & Report;
