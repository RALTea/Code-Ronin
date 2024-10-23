import type { Apprentice } from '$auth/entities/Apprentice';
import { COOKEYS } from '$lib/utils/cookies.utils';
import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import { sequence } from '@sveltejs/kit/hooks';
import { createTRPCHandle } from 'trpc-sveltekit';

export const handleCookies: Handle = ({ event, resolve }) => {
	const jwtToken = event.cookies.get(COOKEYS.JWT_TOKEN);
	
	const payload = jwt.decode(jwtToken ?? '') as Apprentice | null;
	if (!payload) return resolve(event);
	
	event.locals.user = payload;
	
	return resolve(event);
};

export const handle: Handle = sequence(
	handleCookies,
	createTRPCHandle({ router, createContext }),
) 