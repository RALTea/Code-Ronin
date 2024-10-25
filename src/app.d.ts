// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { AuthTokenPayload } from '$auth/entities/JwtPayload';
import type { UseCaseResponse } from '$lib/interfaces/UseCase';

declare global {
	namespace App {
		interface Error<T> extends UseCaseResponse<T> {}
		interface Locals {
			user: AuthTokenPayload | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
