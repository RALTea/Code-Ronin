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

	it('Err: should extract assertions from the output', () => {
		const output = OutputExamples.assert;
		const assertions = OutputParser(output)._extractAssertions();

		expect(assertions).toEqual([
			{
				expected: 'The Excalibur is a Sword that deals 100 damage',
				received: 'The Excalibur is aSwordthat deals100 damage'
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