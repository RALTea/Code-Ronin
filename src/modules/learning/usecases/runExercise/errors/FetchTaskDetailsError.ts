export class FetchTaskDetailsError extends Error {
	constructor(message: string = 'Error fetching task details') {
		super(message);
	}
}
