import type { Apprentice } from '$auth/entities/Apprentice';
import type {
	IUserRepository,
} from '$auth/interfaces/IUserRepository';
import prisma from '$lib/server/db';

type _SQLiteUserRepository = Omit<IUserRepository, "getGiteaUserWithAccessToken">;

export const SQLiteUserRepository = (): _SQLiteUserRepository => {
	return {
		getApprenticeByGiteaEmail(email: string): Promise<Apprentice | null> {
			return prisma.apprentice.findFirst({ where: { email } });
		},
		getApprenticeByGiteaId(id): Promise<Apprentice | null> {
			return prisma.apprentice.findFirst({ where: { giteaUserId: id } });
		},
		async createUser(user): Promise<Apprentice> {
			return prisma.apprentice.create({ data: user });
		}
	};
};
