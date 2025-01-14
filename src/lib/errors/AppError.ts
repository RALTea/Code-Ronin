export class AppError extends Error {
	code: number = 500;
	constructor(message?: string, code?: number) {
		super(message);
		this.code = code || this.code;
	}
}
