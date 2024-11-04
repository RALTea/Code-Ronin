export class FetchTestCasesError extends Error {
		constructor(message: string = 'Unknown error') {
				super(message);
				this.name = 'FetchTestCasesError: ' + message;
		}
}