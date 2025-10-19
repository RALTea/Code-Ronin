export type AttemptStatusType = 'SUCCESS' | 'COMPILE_ERROR' | 'TEST_FAILED' | 'PENDING';

export class AttemptStatus {
	current: AttemptStatusType;

	constructor(status: StatusType = 'PENDING') {
		this.current = status;
	}

	isSuccess(): boolean {
		return this.current === 'SUCCESS';
	}
}
