import { AggregateRoot } from '$ddd/interfaces/AggregateRoot';
import type { ApprenticeId } from '$learning/domain/ApprenticeId.valueObject';

export class Apprentice extends AggregateRoot<ApprenticeId> {
	private _firstName?: string;
	private _lastName?: string;
	private _exp?: number;
	private _title?: string;
	private _medals?: number;

	constructor(id: ApprenticeId) {
		super(id);
	}
}
