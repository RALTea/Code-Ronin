import type { RequestEvent } from '@sveltejs/kit';
import prisma from '$lib/server/db';

export async function createContext(event: RequestEvent) {
  return { // 👈 now available in your context
    event,
    prisma
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
