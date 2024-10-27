import type { UseCaseResponse } from '$lib/interfaces/UseCase';
import { error, json } from '@sveltejs/kit';

export type AddCss = {
	class?: string;
};

export const ApiResponse = {
	send: <T>(useCaseResponse: UseCaseResponse<T>) => {
		if (!useCaseResponse.isSuccess) {
			return error(useCaseResponse.status, useCaseResponse);
		}
		return json(useCaseResponse, { status: useCaseResponse.status });
	}
};
