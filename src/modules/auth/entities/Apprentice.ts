export type Apprentice = {
	id: string;
	username: string;
	createdAt?: Date;
	updatedAt?: Date;
	role: string;
	email: string;
	giteaUserId: number;
	profilePicture: string;
};

export type ApprenticeWhitoutId = Omit<Apprentice, 'id'>;
