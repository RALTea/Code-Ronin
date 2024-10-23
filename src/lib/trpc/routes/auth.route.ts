import { authProcedure } from '$lib/trpc/middlewares/auth.middleware';
import { createTRPCRouter, publicProcedure } from '$lib/trpc/t';
import { RegisterUseCase } from '$auth/usecases/RegisterUser';
import { giteaOauthClient } from '$lib/clients/gitea';
import { registerDto } from '$auth/dto/RegisterDto';
import { TRPCError } from '@trpc/server';

export const authRouter = createTRPCRouter({
	me: authProcedure.query(async ({ ctx }) => ctx.user),
	register: publicProcedure
		.input(registerDto)
		.query(async ({ input }) => {
		const registerUseCase = await RegisterUseCase({
			data: input,
			dependencies: {
				authProvider: giteaOauthClient
			}
		}).execute();

		if (!registerUseCase.isSuccess) {
			throw new TRPCError({ message: registerUseCase.message, code: 'BAD_REQUEST' });
		}

		return registerUseCase.data;
	})
});
