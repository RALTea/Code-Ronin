import type { Apprentice } from '$auth/entities/Apprentice';
import type { GiteaUser } from '$auth/entities/GiteaUser';

export interface IUserRepositoryCreateUser {
	createUser(user: Omit<Apprentice, 'id'>): Promise<Apprentice>;
}

export type IUserRepositoryGetByAccessToken = {
	getGiteaUserWithAccessToken(accessToken: string): Promise<GiteaUser>;
};

export type IUserRepositoryGetById = {
	getApprenticeByGiteaId(id: number): Promise<Apprentice | null>;
};

export type IUserRepositoryGetByEmail = {
	getApprenticeByGiteaEmail(email: string): Promise<Apprentice | null>;
};

export type IUserRepository = IUserRepositoryCreateUser &
	IUserRepositoryGetByAccessToken &
	IUserRepositoryGetById &
	IUserRepositoryGetByEmail;
