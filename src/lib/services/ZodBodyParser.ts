import { ZodError, ZodSchema } from 'zod';
import type { UseCaseResponse } from '$lib/interfaces/UseCase';

type MiddlewareFunction = {
	(body: unknown, schema: ZodSchema): void;
};

export const DefaultMiddleware: MiddlewareFunction = (body, schema) => {
	return schema.parse(body);
};

export const CheckBodyMiddleware = async <TReturn>(
	body: unknown,
	schema: ZodSchema,
	middleware = DefaultMiddleware
): Promise<UseCaseResponse<TReturn>> => {
	try {
		middleware(body, schema);
		return { isSuccess: true, status: 400, data: body as TReturn };
	} catch (error) {
		if (error instanceof ZodError) {
			const formattedErrors: { [key: string]: string } = {};

			error.errors.forEach((err) => {
				const path = err.path.join('.') || 'error';
				formattedErrors[path] = err.message;
			});

			return { message: 'Not well formated body', isSuccess: false, status: 400 };
		}
		return { message: 'Internal Server Error', isSuccess: false, status: 500 };
	}
};
