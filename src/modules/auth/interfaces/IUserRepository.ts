import type { Apprentice, ApprenticeWhitoutId } from '$auth/entities/Apprentice';

export interface IUserRepositoryCreateUser {
	createUser(user: ApprenticeWhitoutId): Promise<Apprentice>;
}

export type IUserRepositoryGetByAccessToken = {
	getGiteaUserWithAccessToken(accessToken: string): Promise<ApprenticeWhitoutId>;
};

export type IUserRepositoryGetUser = {
	getUser(identifier?: string): Promise<ApprenticeWhitoutId>;
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
	IUserRepositoryGetByEmail &
	IUserRepositoryGetUser;
