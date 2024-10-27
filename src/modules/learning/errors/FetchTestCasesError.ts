export class FetchTestCasesError extends Error {
		constructor(message: string = 'FetchTestCasesError: Unknown error') {
				super(message);
				this.name = 'FetchTestCasesError';
		}
}