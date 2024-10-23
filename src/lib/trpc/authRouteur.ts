import { z } from 'zod';
//import { publicProcedure } from '$lib/trpc/procedure';
import { adminGiteaApi } from '$lib/common/adminGiteaApi';
import OAuth2CreateAuthorizationURLService from '$auth/services/OAuth2CreateAuthorizationURL';
import { t } from '$lib/trpc/router';

export const authRouter = t.router({
	register: t.procedure
		.input(
			z.object({
				username: z
					.string()
					.min(1, { message: "Le nom d'utilisateur doit faire minimum 1 caractère." }),
				email: z.string().email(),
				password: z.string().min(1, { message: 'Le mot de passe doit faire minimum 1 caractère.' })
			})
		)
		.query(async ({ input }) => {
			await adminGiteaApi.post('/users', {
				...input,
				must_change_password: false,
				send_notify: false
			});

			return OAuth2CreateAuthorizationURLService.createGiteaAuthorizationURL();
		})
});
