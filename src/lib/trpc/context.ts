import type { RequestEvent } from '@sveltejs/kit';
import prisma from '$lib/server/db';
import { COOKEYS } from '$lib/utils/cookies.utils';
import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';
import type { AuthTokenPayload } from '$auth/entities/JwtPayload';

export async function createContext(event: RequestEvent) {
	try {
		const userToken = event.cookies.get(COOKEYS.JWT_TOKEN) ?? '';
		const user = jwt.verify(userToken, env.JWT_SECRET ?? '') as AuthTokenPayload;
		return {
			// 👈 now available in your context
			event,
			prisma,
			user
		};
	} catch {
		return { event, prisma, user: null };
	}
}

export type Context = Awaited<ReturnType<typeof createContext>>;
