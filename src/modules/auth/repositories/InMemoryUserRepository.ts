import type { User } from '$auth/entities/User';
import type { IUserRepository } from '$auth/interfaces/IUserRepository';

type _InMemoryUserRepository = IUserRepository;

const users: User[] = [];

export const InMemoryUserRepository = (): _InMemoryUserRepository => {
	return {
		async addUser(user) {
			users.push({ id: crypto.randomUUID(), username: user.username });
		}
	};
};
