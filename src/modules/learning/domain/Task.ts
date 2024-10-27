export type Task = {
	id: string;
	name: string;
	nextTaskId?: string;
	previousTaskId?: string;
	isMiniboss: boolean;
	instructions: string;
	exp: number;
};
