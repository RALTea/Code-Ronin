export class ApprenticeNotFoundError extends Error {
	constructor(apprenticeId: string) {
		super(`Apprentice with id ${apprenticeId} not found`);
		this.name = 'ApprenticeNotFoundError';
	}
}
