import { z } from 'zod';

export const TestTypeSchema = z.enum(['tests', 'stdout', 'stderr']);

export type TestType = z.infer<typeof TestTypeSchema>;