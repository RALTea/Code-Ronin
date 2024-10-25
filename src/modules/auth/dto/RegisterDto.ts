import z from 'zod';

export const registerDto = z
	.object({
		username: z
			.string()
			.min(1, { message: "Le nom d'utilisateur doit faire minimum 1 caractère." }),
		email: z.string().email(),
		password: z.string().min(1, { message: 'Le mot de passe doit faire minimum 1 caractère.' }),
		verifyPassword: z.string()
	})
	.refine((data) => data.password === data.verifyPassword, { message: 'Les mots de passes sont différents' });

export type RegisterDto = z.infer<typeof registerDto>;
