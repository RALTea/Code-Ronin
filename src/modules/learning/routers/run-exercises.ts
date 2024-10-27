import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { env } from '$env/dynamic/private';

const router = t.router({
	getTestFileFromGithub: t.procedure
		.input(
			z.object({
				fileName: z.string(),
				campaignName: z.string()
			})
		)
		.query(async ({ input }) => {
			const { EXERCICES_REPO_URL, GITHUB_PAT_EXERCISES_REPO } = env;
			const { fileName, campaignName } = input;

			const url = `${EXERCICES_REPO_URL}/${campaignName}/${fileName}`
			try {
				const response = await fetch(url, {
					method: 'GET',
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
				
				return fileContent;
			} catch (error) {
				console.error('Failed to fetch the file content:', error);
			}
		})
});

export default router;