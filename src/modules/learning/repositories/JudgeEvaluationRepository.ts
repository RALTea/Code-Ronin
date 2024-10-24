import type { IEvaluationRepository } from './IEvaluationReposiotry';
import { env } from '$env/dynamic/public';
import type { Language } from '$learning/domain/Language';
import { z } from 'zod';

type JudgeSubmissionPayload = {
		source_code: string,
		language_id: number,
		expected_output?: string,
}

const JudgeResultSchema = z.object({
	stdout: z.nullable(z.string()),
	time: z.string(),
	memory: z.number(),
	stderr: z.nullable(z.string()),
	token: z.string(),
	compile_output: z.nullable(z.string()),
	message: z.nullable(z.string()),
	status: z.object({
		id: z.number(),
		description: z.string(),
	}),
});
type JudgeResult = z.infer<typeof JudgeResultSchema>;

const mapLanguageToJudgeLanguageId = (language: Language): number => {
	switch (language) {
		case 'bash':
			return 46;
		case 'javascript':
			return 63;
		case 'typescript3':
			return 74;
		case 'typescript5':
			return 90;
		case 'python':
			return 71;
		default:
			throw new Error(`Unsupported language: ${language}`);
	}
}

export const JudgeEvaluationRepository = (): IEvaluationRepository => {
	return {
		evaluateSolution: async (solution: string, language: Language) => {
			const url = `${env.PUBLIC_JUDGE_API}/submissions?wait=true`;
			const payload: JudgeSubmissionPayload = {
				source_code: solution,
				language_id: mapLanguageToJudgeLanguageId(language),
			}
			const result = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});
			const decoded: JudgeResult = await result.json();
			console.debug('JudgeEvaluationRepository', decoded);
			return {
				id: decoded.token,
				time: parseFloat(decoded.time),
				success: decoded.status.id === 3,
				message: decoded.stdout ?? decoded.stderr ?? decoded.compile_output ?? decoded.message ?? 'Unknown error', 
			};
		}
	};
};
