import { CreateUserDtoSchema, type CreateUserDto } from '$auth/dtos/CreateUserDto';
import { PrismaSignInUserRepository } from '$auth/usecases/SignInUser/repositories/PrismaSignInUserRepository';
import { SignInUserUseCase } from '$auth/usecases/SignInUser/SignInUser';
import prisma from '$lib/server/db';
import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/sveltekit/providers/github';

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [GitHub],
	callbacks: {
    // return true if successful, false otherwise
		signIn: async (data) => {
			try {
				const createUserDto: CreateUserDto = CreateUserDtoSchema.parse({
					email: data.user.email,
					profilePicture: data.user.image,
					username: data.user.name
				});
				const ucResult = await SignInUserUseCase({
          createUserIfNotExists: PrismaSignInUserRepository(prisma).createUserIfNotExists
				}).execute({ dto: createUserDto });
        
        console.log({createUserDto, ucResult});
				if (!ucResult.isSuccess) {
					console.error(ucResult.message);
					return false;
				}
				console.log(
					`A new user has been created : [${createUserDto.username} | ${createUserDto.email}]`
				);
        return true;
			} catch (error) {
				console.error(error);
        return false;
			}
		}
	}
});
