import type { CreateUserDto } from '$auth/dtos/CreateUserDto';
import type { PrismaClient } from '@prisma/client';
import * as ISignInUserRepository from './ISignInUserRepository';

type _PrismaSignInUserRepository = {
	createUserIfNotExists: ISignInUserRepository.CreateUserIfNotExists;
}

export const PrismaSignInUserRepository = (prisma: PrismaClient): _PrismaSignInUserRepository => {
	return {
		createUserIfNotExists: async (dto: CreateUserDto) => {
			const user = await prisma.apprentice.findFirst({
				where: {
					email: dto.email
				}
			});
			if (user) return false;
			const id = crypto.randomUUID();
			await prisma.apprentice.create({
				data: {
					id,
					email: dto.email,
					profilePicture: dto.profilePicture,
					username: dto.username
				}
			})
			return true;
		}
	}
}