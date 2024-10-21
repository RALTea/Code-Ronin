import { COOKEYS } from '$lib/utils/cookies.utils';
import jwt from 'jsonwebtoken';
import type { User } from '$auth/entities/User';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = ({ event, resolve }) => {
	const jwtToken = event.cookies.get(COOKEYS.JWT_TOKEN);

	const payload = jwt.decode(jwtToken ?? '') as User | null;
	if (!payload) return resolve(event);

	event.locals.user = payload;

	return resolve(event);
};
