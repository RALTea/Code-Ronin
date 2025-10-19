export class FailedTest {
	testFileName: string;
	reason: string;
	expected?: string;
	actual?: string;

	constructor(params: {
		testFileName: string;
		reason: string;
		expected?: string;
		actual?: string;
	}) {
		this.testFileName = params.testFileName;
		this.reason = params.reason;
		this.expected = params.expected;
		this.actual = params.actual;
	}
}
