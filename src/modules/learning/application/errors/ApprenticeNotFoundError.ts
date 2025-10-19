import { ApplicationError } from '$lib/ddd-common/errors/ApplicationError';
import type { ApprenticeId } from '$learning/domain/ApprenticeId.valueObject';

export class ApprenticeNotFoundError extends ApplicationError {
	constructor(ApprenticeId: ApprenticeId) {
		super(`Apprentice with ID "${ApprenticeId.toString()}" was not found.`);
		this.name = 'ApprenticeNotFoundError';
	}
}
