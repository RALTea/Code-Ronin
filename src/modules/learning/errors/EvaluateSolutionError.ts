export class EvaluateSolutionError extends Error {
	constructor(message: string = 'EvaluateSolutionError: Unknown error') {
		super(message);
		this.name = 'EvaluateSolutionError: ' + message;
	}
}
