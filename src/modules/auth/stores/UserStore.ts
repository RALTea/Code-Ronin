import { writable } from 'svelte/store';
import type { AuthTokenPayload } from '$auth/entities/JwtPayload';

export const user = writable<AuthTokenPayload | null>(null)