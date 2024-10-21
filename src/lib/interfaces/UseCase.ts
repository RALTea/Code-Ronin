import type { StatusCode } from '$lib/utils/http.utils';

export type UseCaseResponse<T> = {
	isSuccess: true;
	status: StatusCode;
	data: T;
} | {
	isSuccess: false;
	status: StatusCode;
	message: string;
}