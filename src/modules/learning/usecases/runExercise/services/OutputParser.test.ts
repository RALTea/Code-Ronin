import { describe, expect, it } from 'vitest';
import { OutputParser } from './OutputParser';
import { OutputExamples } from './OutputExamples.fake';

describe('OutputParser', () => {
	it('Err: should extract the causes of the error', () => {
		const output = OutputExamples.err1;
		const causes = OutputParser(output)._listCauses();

		expect(causes).toEqual([
			'A variable named "username" should exist (be declared)',
			'The variable "username" should be a string'
		]);
	});
	it('All: should extract the stdout from the output', () => {
		const output = OutputExamples.stdout1;
		const stdout = OutputParser(output)._extractStdout();

		expect(stdout).toEqual(`⚙ STDOUT:\n  Hello world\n`);
	});
	it('All: cleanup should extract the test results', () => {
		const output = OutputExamples.errPlusStd;
		const testResults = OutputParser(output).cleanUp();
		const expectedResult = `❯ script.test.ts  (3 tests | 2 failed) 8ms
   × StudentSolution:ANewDevIsBorn > A variable named "username" should exist (be declared)
     → username is not defined
   × StudentSolution:ANewDevIsBorn > The variable "username" should be a string
     → expected 'undefined' to be 'string' // Object.is equality

 Test Files  1 failed (1)
      Tests  2 failed | 1 passed (3)
   Start at  12:44:03
   Duration  296ms (transform 38ms, setup 0ms, collect 26ms, tests 8ms, environment 0ms, prepare 63ms)`

		expect(testResults).toEqual(expectedResult);
	});

	it('Should handle object equality assertions', () => {
		const output = `FAIL script.test.ts > Test1 > First test
AssertionError: expected 'abc' to be 'def' // Object.is equality
Expected: "def"
Received: "abc"
❯ script.test.ts:10:35`
		const failures = OutputParser(output)._extractFailures();

		expect(failures).toEqual([
			{
				cause: 'First test',
				expected: 'def',
				received: 'abc'
			}
		]);
	});

	it('Should handle contains assertions', () => {
		const output = `"⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  script.test.ts > BasicPotion > contains required starter code
AssertionError: Solution should include starter code: expected '\nconst herbs = 6;\nconst requiredHer…' to contain 'const herbs = 3'

- Expected
+ Received`
		const failures = OutputParser(output)._extractFailures();

		expect(failures).toEqual([
			{
				cause: 'contains required starter code',
				expected: 'const herbs = 3',
				received: '\nconst herbs = 6;\nconst requiredHer…'
			}
		]);
	});

	it('Should handle matches assertions (Regex)', () => {
		const matchTest = `FAIL script.test.ts > BasicPotion > uses greater than or equal to operator
AssertionError: expected '\nconst herbs = 6;\nconst requiredHer…' to match />=/`;
		const failures = OutputParser(matchTest)._extractFailures();

		expect(failures).toEqual([
			{
				cause: 'uses greater than or equal to operator',
				expected: '>=',
				received: '\nconst herbs = 6;\nconst requiredHer…'
			}
		]);
	});

	it('Err: should extract assertions for each failed test', () => {
		const output = OutputExamples.assertMultiple;
		const failures = OutputParser(output)._extractFailures();

		expect(failures).toEqual([
			{
				cause: 'First test',
				expected: 'def',
				received: 'abc'
			},
			{
				cause: 'Second test',
				expected: '456',
				received: '123'
			}
		]);
	})
})