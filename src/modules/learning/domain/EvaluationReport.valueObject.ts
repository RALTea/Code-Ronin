import type { FailedTest } from './FailedTest.valueObject';
import type { AttemptStatusType } from './AttemptStatus.valueObject';

export type EvaluationStatusType = Exclude<AttemptStatusType, 'PENDING'>;

export class EvaluationReport {
	public readonly status: EvaluationStatusType;
	public readonly failedTests: readonly FailedTest[];
	public readonly rawOutput?: string;

	constructor(params: {
		status: EvaluationStatusType;
		failedTests: readonly FailedTest[];
		rawOutput?: string;
	}) {
		this.status = params.status;
		this.failedTests = params.failedTests;
		this.rawOutput = params.rawOutput;

		if (this.status === 'SUCCESS' && this.failedTests.length > 0) {
			throw new Error('A successful evaluation report cannot contain failed tests.');
		}
		if (this.status === 'TEST_FAILED' && this.failedTests.length === 0) {
			throw new Error('A failed evaluation report must contain at least one failed test.');
		}
	}

	get allTestsPassed(): boolean {
		return this.status === 'SUCCESS';
	}
}
