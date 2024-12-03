import { z } from 'zod';

export const ValidationDataSchema = z.object({
	expectedStdout: z.string().optional(),
	expectedStderr: z.string().optional(),
	testFileName: z.string().optional(),
	forbiddenSnippets: z.array(z.string()).optional(),
	mandatorySnippets: z.array(z.string()).optional()
});

export type ValidationData = z.infer<typeof ValidationDataSchema>;
