// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { User } from '$auth/entities/User';
import type { UseCaseResponse } from '$lib/interfaces/UseCase';

declare global {
	namespace App {
		interface Error<T> extends UseCaseResponse<T> {}
		interface Locals {
			user: User | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	// Add this into app.d.ts inside the global namespace declaration
	declare namespace svelteHTML {
		interface HTMLAttributes<T> {
			'onclickOutside'?: (event: CustomEvent) => void;
		}
	}
}

export {};
