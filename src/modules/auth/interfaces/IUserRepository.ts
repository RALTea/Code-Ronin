import type { User } from '$auth/entities/User';

export interface IUserRepositoryCreateUser {
	createUser(user: Omit<User, 'id'>): Promise<void>;
}

export type IUserRepositoryGetById = {
	getUserById(id: string): Promise<User | undefined>;
}

export type IUserRepository = IUserRepositoryCreateUser & IUserRepositoryGetById;

