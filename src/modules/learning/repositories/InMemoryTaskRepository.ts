import type { ITaskRepository } from './ITaskRepository';

export const InMemoryTaskRepository = (): ITaskRepository => {
	return {
		getTaskById: async (taskId: string) => {
			const instructions = fetch(`/Exo1.md`).then((res) => res.text());
			return {
				id: taskId,
				instructions: await instructions,
				exp: 100,
			};
		},
	}
}