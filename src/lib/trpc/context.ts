import { GetSelfDataUseCase } from '$auth/usecases/GetSelfData/GetSelfData';
import { PrismaGetSelfDataRepository } from '$auth/usecases/GetSelfData/repositories/PrismaGetSelfDataRepository';
import prisma from '$lib/server/db';
import type { RequestEvent } from '@sveltejs/kit';

export async function createContext(event: RequestEvent) {
	try {
		const session = await event.locals.auth();
		const user = await GetSelfDataUseCase({
			getSelfData: PrismaGetSelfDataRepository(prisma).getSelfData
		}).execute({ userIdentifier: session?.user?.email ?? '-1' }).then((res) => {
			if (res.isSuccess) return res.data;
			return null;
		}).catch(() => null);
		return {
			// 👈 now available in your context
			event,
			prisma,
			user
		};
	} catch {
		return { event, prisma, user: null };
	}
}

export type Context = Awaited<ReturnType<typeof createContext>>;
