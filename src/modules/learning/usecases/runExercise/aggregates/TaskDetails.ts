import { z } from 'zod';

export type TaskDetails = {
	answerType: AnswerType;
};

export const AnswerTypeSchema = z
	.enum(['tests', 'stdout', 'stderr'])
	.default('tests')
	.catch('tests');

export type AnswerType = z.infer<typeof AnswerTypeSchema>;
