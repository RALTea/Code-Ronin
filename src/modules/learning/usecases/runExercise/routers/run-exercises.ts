import { env } from '$env/dynamic/private';
import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { TestCasesNotFoundError } from '../errors/TestCasesNotFoundError';
import { authProcedure } from '$lib/trpc/middlewares/auth.middleware';
import { PrismaAttemptRepository } from '../repositories/PrismaAttemptRepository';
import { ExerciseAttemptSchema } from '../aggregates/ExerciseAttempt';
import { PrismaTaskRepository } from '../repositories/PrismaTaskRepository';

const router = t.router({
	getTestFileFromGithub: authProcedure
		.input(
			z.object({
				fileName: z.string(),
				campaignName: z.string()
			})
		)
		.query(async ({ input }) => {
			const { EXERCICES_REPO_URL, GITHUB_PAT_EXERCISES_REPO } = env;
			const { fileName, campaignName } = input;

			const url = `${EXERCICES_REPO_URL}/${campaignName}/${fileName}`;
			try {
				const response = await fetch(url, {
					method: 'GET',
					cache: 'no-store',
					headers: {
						Authorization: `token ${GITHUB_PAT_EXERCISES_REPO}`,
						Accept: 'application/vnd.github.v3.raw' // Use this to get the raw file content
					}
				});

				if (!response.ok) {
					throw new Error(
						`GitHub API returned an error: ${response.status} ${response.statusText}`
					);
				}

				const fileContent = await response.text(); // Read the content as text
				console.debug('Fetched the file content:', fileContent);
				return fileContent;
			} catch (error) {
				console.error('Failed to fetch the file content:', error);
				throw new TestCasesNotFoundError(`/${campaignName}/${fileName}`);
			}
		}),
	handleSuccess: authProcedure.input(ExerciseAttemptSchema).mutation(async ({ input, ctx }) => {
		const attemptRepository = PrismaAttemptRepository(ctx.prisma);
		await attemptRepository.handleSuccess(input);
	}),
	handleFail: authProcedure.input(ExerciseAttemptSchema.optional()).mutation(async ({ input, ctx }) => {
		const attemptRepository = PrismaAttemptRepository(ctx.prisma);
		await attemptRepository.handleFail(input);
	}),
	getTaskDetails: authProcedure.input(z.object({ taskId: z.string() })).query(async ({ input, ctx }) => {
		const taskRepository = PrismaTaskRepository(ctx.prisma);
		return taskRepository.getTaskDetails(input.taskId);
	})
});

export default router;
