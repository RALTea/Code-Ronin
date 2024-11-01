export class TestCasesNotFoundError extends Error {
	constructor(message = 'Test cases not found') {
		super(message);
		this.name = 'TestCasesNotFoundError';
	}
}
