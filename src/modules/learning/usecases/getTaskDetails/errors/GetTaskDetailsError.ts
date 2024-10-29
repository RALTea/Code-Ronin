export class GetTaskDetailsError extends Error {
	constructor(message: string = 'Unknown error') {
		super(message);
		this.name = 'GetTaskDetailsError: ' + message;
	}
}