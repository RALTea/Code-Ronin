import type { Router } from '$lib/trpc/router';
import { error } from '@sveltejs/kit';
import type { TRPCClientError } from '@trpc/client';
import type { TRPCError } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';

export const ServerCatcher = (e: unknown, customMessage?: string) => {
	if ((e as TRPCClientError<Router>)?.data) {
		const trpcError = (e as TRPCClientError<Router>).data as unknown as TRPCError;
		const message = (e as TRPCClientError<Router>).shape as unknown as TRPCError;
		const httpStatus = getHTTPStatusCodeFromError(trpcError);
		throw error(httpStatus, { message: customMessage || message.message });
	}
	throw e;
};
