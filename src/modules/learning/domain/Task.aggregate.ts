import { AggregateRoot } from '$ddd/interfaces/AggregateRoot';
import type { Language } from './Language.valueObject';
import { TaskId } from './TaskId.valueObject';

type TaskFacoryProps = {
	name: string;
	instructions: string;
	exp: number;
	isMiniboss?: boolean;
	nextTaskId?: TaskId;
	previousTaskId?: TaskId;
	language: Language;
};

export class Task extends AggregateRoot<TaskId> {
	private constructor(
		public id: TaskId,
		public name: string,
		public isMiniboss: boolean,
		public instructions: string,
		public exp: number,
		public language: Language,
		public nextTaskId?: TaskId,
		public previousTaskId?: TaskId
	) {
		super(id);
	}

	static create({
		name,
		isMiniboss,
		instructions,
		exp,
		nextTaskId,
		previousTaskId,
		language
	}: TaskFacoryProps): Task {
		return new Task(
			new TaskId(),
			name,
			isMiniboss ?? false,
			instructions,
			exp,
			language,
			nextTaskId,
			previousTaskId
		);
	}
}
