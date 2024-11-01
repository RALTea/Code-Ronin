import type { Validation } from '$learning/domain/Validation';

export type TaskDetails = {
	id: string;
	instructions: string;
	validation: Validation;
	nextTasksIds: string[] | undefined;
}