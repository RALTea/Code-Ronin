import type { Apprentice } from '$auth/entities/Apprentice';
import type {
	IUserRepositoryCreateUser,
	IUserRepositoryGetById
} from '$auth/interfaces/IUserRepository';
import prisma from '$lib/server/db';

type _SQLiteUserRepository = IUserRepositoryCreateUser & IUserRepositoryGetById;

export const SQLiteUserRepository = (): _SQLiteUserRepository => {
	return {
		getApprenticeByGiteaId(id): Promise<Apprentice | null> {
			return prisma.apprentice.findFirst({ where: { giteaUserId: id } });
		},
		async createUser(user): Promise<Apprentice> {
			return prisma.apprentice.create({ data: user });
		}
	};
};
