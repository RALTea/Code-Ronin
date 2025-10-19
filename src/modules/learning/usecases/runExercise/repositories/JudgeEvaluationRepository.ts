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

const VitestAssertionResultSchema = z.object({
	ancestorTitles: z.array(z.string()),
	status: z.string(),
	title: z.string(),
	duration: z.number().optional(),
	failureMessages: z.array(z.string())
});

const VitestTestResultSchema = z.object({
	assertionResults: z.array(VitestAssertionResultSchema),
	startTime: z.number(),
	endTime: z.number(),
	status: z.string(), // 'passed' | 'failed'
	message: z.string(),
	name: z.string()
});

const VitestOutputSchema = z.object({
	success: z.boolean(),
	numTotalTestSuites: z.number(),
	numPassedTestSuites: z.number(),
	numFailedTestSuites: z.number(),
	numTotalTests: z.number(),
	numPassedTests: z.number(),
	numFailedTests: z.number(),
	startTime: z.number(),
	testResults: z.array(VitestTestResultSchema)
});

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

	const buildFullOutput = (
		vitestResult: z.infer<typeof VitestOutputSchema>,
		decoded: JudgeResult
	): string => {
		const suiteOutputs = vitestResult.testResults
			.map((suite) => {
				const suiteName = suite.name.split('/').pop() ?? suite.name;
				const suiteDuration = suite.endTime - suite.startTime;
				const failedTestsInSuite = suite.assertionResults.filter(
					(a) => a.status === 'failed'
				).length;
				const header = `❯ ${suiteName} (${suite.assertionResults.length} tests | ${failedTestsInSuite} failed) ${Math.round(suiteDuration)}ms`;

				const testLines = suite.assertionResults
					.map((assertion) => {
						const statusIcon = assertion.status === 'passed' ? '✓' : '×';
						const duration = Math.round(assertion.duration ?? 0);
						const title = [...assertion.ancestorTitles, assertion.title].join(' > ');
						let line = `   ${statusIcon} ${title} ${duration}ms`;
						if (assertion.status === 'failed') {
							const failureMessage = assertion.failureMessages[0]?.split('\n')[0] ?? '';
							line += `\n     → ${failureMessage}`;
						}
						return line;
					})
					.join('\n');

				return `${header}\n${testLines}`;
			})
			.join('\n\n');

		const footer = [
			``,
			` Test Files  ${vitestResult.numFailedTestSuites} failed (${vitestResult.numTotalTestSuites})`,
			`      Tests  ${vitestResult.numFailedTests} failed | ${vitestResult.numPassedTests} passed (${vitestResult.numTotalTests})`,
			`   Start at  ${new Date(vitestResult.startTime).toLocaleTimeString('en-US', { hour12: false })}`,
			`   Duration  ${Math.round(parseFloat(decoded.time) * 1000)}ms`
		].join('\n');

		return `${suiteOutputs}${footer}`;
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

			if (language === 'typescript5-vitest') {
				try {
					// The output from vitest might have some extra characters at the end.
					const cleanStdout = decoded.stdout?.substring(0, decoded.stdout.lastIndexOf('}') + 1);
					if (cleanStdout) {
						const vitestResult = VitestOutputSchema.parse(JSON.parse(cleanStdout));

						const status: ExerciseAttemptResultStatus = vitestResult.success
							? 'SUCCESS'
							: 'TEST_CASES_FAILED';

						const simplifiedOutput = vitestResult.testResults
							.flatMap((res) =>
								res.assertionResults.map((assertion) => {
									let output = `[${assertion.status.toUpperCase()}] ${assertion.title}`;
									if (assertion.status === 'failed') {
										const errorMessages = assertion.failureMessages
											.map((fm) => fm.split('\n')[0])
											.join('\n  - ');
										output += `\n  - ${errorMessages}`;
									}
									return output;
								})
							)
							.join('\n\n');

						const fullOutput = buildFullOutput(vitestResult, decoded);

						return {
							id: decoded.token,
							time: parseFloat(decoded.time),
							status,
							output: simplifiedOutput,
							fullOutput: fullOutput
						};
					}
				} catch (error) {
					// Fallback to default behavior if parsing fails
				}
			}

			const output = `${decoded.stderr}\n${decoded.stdout}`;
			return {
				id: decoded.token,
				time: parseFloat(decoded.time),
				status: getJudgeSuccess(decoded),
				output: output,
				simplifiedOutput: output
			};
		}
	};
};
