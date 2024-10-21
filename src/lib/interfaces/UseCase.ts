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

export type InputFactory<TData, TDeps> = {
	data: TData;
	dependencies: TDeps;
}

export type OutputFactory<T> = T;

export type UseCase<Input, Output> = (input: Input) => {
	execute(): Promise<Output>;
}

export type UseCaseSync<Input, Output> = (input: Input) => {
	execute(): Output;
}