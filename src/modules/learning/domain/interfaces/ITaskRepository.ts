import type { Task } from '../Task.aggregate';
import type { TaskId } from '../TaskId.valueObject';

export interface ITaskRepository {
	save(task: Task): Promise<void>;
	findById(id: TaskId): Promise<Task | null>;
}
