export class TaskNotFound extends Error {
	constructor(message: string = 'Task not found') {
		super(message);
		this.name = 'TaskNotFound: ' + message;
	}
}