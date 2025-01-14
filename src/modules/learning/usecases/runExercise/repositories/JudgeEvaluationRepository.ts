import { env } from '$env/dynamic/public';
import type { Language } from '$learning/domain/Language';
import { base64ToUnicode, unicodeToBase64 } from '$lib/utils/b64.utils';
import { z } from 'zod';
import type { ExerciseAttemptResultStatus } from '../aggregates/ExerciseAttemptResult';
import type { EvaluateSolution } from './IRunExerciseRepository';

type JudgeSubmissionPayload = {
	source_code: string;
	language_id: number;
	expected_output?: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
		description: z.string()
	})
});
type JudgeResult = z.infer<typeof JudgeResultSchema>;

const mapLanguageToJudgeLanguageId = (language: Language): number => {
	switch (language) {
		case 'bash':
			return 46;
		case 'javascript':
			return 63;
		case 'python':
			return 71;
		case 'typescript3':
			return 74;
		case 'typescript5':
			return 90;
		case 'typescript5-vitest':
			return 91;
		default:
			throw new Error(`Unsupported language: ${language}`);
	}
};

type JudgeEvaluationRepository = {
	evaluateSolution: EvaluateSolution;
};
export const JudgeEvaluationRepository = (): JudgeEvaluationRepository => {
	const getJudgeSuccess = (result: JudgeResult): ExerciseAttemptResultStatus => {
		if (result.status.id === 3) return 'SUCCESS';
		if (result.stderr?.match(/Transform failed/)) return 'COMPILE_ERROR';
		return 'TEST_CASES_FAILED';
	};
	return {
		evaluateSolution: async (solution: string, language: Language) => {
			const url = `${env.PUBLIC_JUDGE_API}/submissions?wait=true&base64_encoded=true`;
			const payload: JudgeSubmissionPayload = {
				source_code: unicodeToBase64(solution),
				language_id: mapLanguageToJudgeLanguageId(language)
			};
			const result = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});
			const decoded: JudgeResult = await result.json();
			decoded.stdout = base64ToUnicode(decoded.stdout ?? '');
			decoded.stderr = base64ToUnicode(decoded.stderr ?? '');
			decoded.message = base64ToUnicode(decoded.message ?? '');
			console.log({
				err: decoded.stderr ?? '',
				out: decoded.stdout ?? '',
				msg: decoded.message ?? '',
				status: getJudgeSuccess(decoded),
				decoded
			});

			// const message = decoded.stdout + decoded.message;
			const output = `${decoded.stderr}\n${decoded.stdout}`;
			console.log({output})
			return {
				id: decoded.token,
				time: parseFloat(decoded.time),
				status: getJudgeSuccess(decoded),
				output: output,
				// message: base64ToUnicode(decoded.stdout ?? '') + base64ToUnicode(decoded.stderr ?? '')
				// decoded.compile_output +
				// decoded.message +
				// 'Your code returned no output'
			};
		}
	};
};
