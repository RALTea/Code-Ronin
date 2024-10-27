export class FetchApprenticeSolutionError extends Error {
	constructor(message: string = 'FetchApprenticeSolutionError: Unknown error') {
		super(message);
		this.name = 'FetchApprenticeSolutionError: ' + message;
	}
}
