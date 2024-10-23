import type { Apprentice } from '$auth/entities/Apprentice';
import type { IUserRepository } from '$auth/interfaces/IUserRepository';
import * as crypto from 'node:crypto';

type _InMemoryUserRepository = Omit<IUserRepository, 'getGiteaUserWithAccessToken'>;

const apprentices: Apprentice[] = [];

export const InMemoryUserRepository = (): _InMemoryUserRepository => {
	return {
		getApprenticeByGiteaEmail(email: string): Promise<Apprentice | null> {
			const apprentice = apprentices.find((apprentice) => apprentice.email === email) ?? null;
			return Promise.resolve(apprentice);
		},
		getApprenticeByGiteaId(id: number): Promise<Apprentice | null> {
			const apprentice = apprentices.find((apprentice) => apprentice.giteaUserId === id) ?? null;
			return Promise.resolve(apprentice);
		},
		async createUser(user) {
			const newApprentice = { id: crypto.randomUUID(), ...user };
			apprentices.push(newApprentice);
			return newApprentice;
		}
	};
};
