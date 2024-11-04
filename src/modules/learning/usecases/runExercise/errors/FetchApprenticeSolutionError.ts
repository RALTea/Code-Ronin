export class FetchApprenticeSolutionError extends Error {
	constructor(message: string = 'Unknown error') {
		super(message);
		this.name = 'FetchApprenticeSolutionError: ' + message;
	}
}
