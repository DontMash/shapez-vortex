import type { RecordModel } from 'pocketbase';
import { z } from 'zod';

const ID_LENGTH = 15;

export const REPORT_REASONS = ['Illegal', 'Discriminatory', 'Disrespectful', 'Other'] as const;
type ReportReason = typeof REPORT_REASONS[number];
export type ReportRecord = RecordModel & {
    blueprint: string;
    reason: ReportReason;
    message: string;
    user: string;
    resolved: boolean | undefined;
};
export const REPORT_CREATE_SCHEMA = z.object({
    blueprint: z.string().length(ID_LENGTH),
    reason: z.string().refine(value => REPORT_REASONS.includes(value as ReportReason)),
    message: z.string().max(256),
});
