import type { StatusCode } from '$lib/utils/http.utils';

export type UseCaseResponseSuccess<T> = {
	isSuccess: true;
	status: StatusCode;
	data: T;
};
export type UseCaseResponseError = {
	isSuccess: false;
	status: StatusCode;
	message: string;
};

export type UseCaseResponse<T> =
	| UseCaseResponseSuccess<T>
	| UseCaseResponseError;
	

export const UseCaseResponseBuilder = {
	success: <T>(status: StatusCode, data: T): UseCaseResponse<T> => ({
		isSuccess: true,
		status,
		data
	}),
	error: <T>(status: StatusCode, message: string): UseCaseResponse<T> => ({
		isSuccess: false,
		status,
		message
	})
};

export type InputFactory<TData, TDeps> = {
	data: TData;
	dependencies: TDeps;
};

export type OutputFactory<T> = UseCaseResponse<T>;

export type UseCase<Input extends { data: unknown; dependencies: unknown }, Output> = (
	dependencies: Input['dependencies']
) => {
	execute(data: Input['data']): Promise<Output>;
};

export type UseCaseSync<Input, Output> = (input: Input) => {
	execute(): Output;
};
