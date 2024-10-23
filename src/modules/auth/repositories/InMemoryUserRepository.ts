import type { Apprentice } from '$auth/entities/Apprentice';
import type { IUserRepositoryCreateUser } from '$auth/interfaces/IUserRepository';

type _InMemoryUserRepository = IUserRepositoryCreateUser;

const users: Apprentice[] = [];

export const InMemoryUserRepository = (): _InMemoryUserRepository => {
	return {
		async createUser(user) {
			const newUser = { id: crypto.randomUUID(), ...user };
			users.push(newUser);
			return newUser
		}
	};
};
