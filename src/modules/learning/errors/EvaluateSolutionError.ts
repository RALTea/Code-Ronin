export class EvaluateSolutionError extends Error {
	constructor(message: string = 'Unknown error') {
		super(message);
		this.name = 'EvaluateSolutionError: ' + message;
	}
}
