import type { User } from '$auth/entities/User';
import type { IUserRepositoryCreateUser } from '$auth/interfaces/IUserRepository';

type _InMemoryUserRepository = IUserRepositoryCreateUser;

const users: User[] = [];

export const InMemoryUserRepository = (): _InMemoryUserRepository => {
	return {
		async createUser(user) {
			users.push({ id: crypto.randomUUID(), username: user.username });
		}
	};
};
