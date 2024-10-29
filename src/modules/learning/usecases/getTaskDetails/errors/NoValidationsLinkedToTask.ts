export class NoValidationsLinkedToTaskError extends Error {
	constructor(message: string = 'No validations linked to task') {
		super(message);
		this.name = 'NoValidationsLinkedToTask: ' + message;
	}
}