import type { User } from '$auth/entities/User';
import { UserRoleSchema } from '$auth/entities/UserRole';
import type { PrismaClient } from '@prisma/client';
import { UserNotFoundError } from '../errors/UserNotFoundError';
import * as IGetSelfDataRepository from '../repositories/IGetSelfDataRepository';

type _PrismaGetSelfDataRepository = {
	getSelfData: IGetSelfDataRepository.GetSelfData;
}

export const PrismaGetSelfDataRepository = (prisma: PrismaClient): _PrismaGetSelfDataRepository => {
	return {
		getSelfData: async (userIdentifier) => {
			const prismaUser = await prisma.apprentice.findUnique({
				where: {
					email: userIdentifier
				}
			});
			if (!prismaUser) {
				throw new UserNotFoundError(userIdentifier)
			}
			const role = UserRoleSchema.parse(prismaUser.role);
			const user: User = {
				id: prismaUser.id,
				profilePicture: prismaUser.profilePicture,
				username: prismaUser.username,
				role: role,
			};
			return user;
		}
	}
};