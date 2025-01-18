import { describe, test, expect } from 'vitest';
import { OutputParser } from './OutputParser';


const exampleSuccessResult = `RUN  v2.1.3 /box
stdout | script.test.ts
My username: { username: 'Hello' }
✓ script.test.ts  (3 tests) 4ms
Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  14:43:57
   Duration  318ms (transform 47ms, setup 0ms, collect 42ms, tests 4ms, environment 0ms, prepare 80ms)`;


const exampleFailureResult = `
 RUN  v2.1.3 /box

stdout | script.test.ts
My username: { username: 'Hello' }

 ❯ script.test.ts  (3 tests | 1 failed) 9ms
   × StudentSolution:ANewDevIsBorn > The variable "username" should be a constant
     → expected [Function] to throw an error

 Test Files  1 failed (1)
      Tests  1 failed | 2 passed (3)
   Start at  15:10:40
   Duration  337ms (transform 56ms, setup 0ms, collect 53ms, tests 9ms, environment 0ms, prepare 98ms)

`
describe("OutputParser:Debug", () => {
	test('Should extract the test output from a successful test', () => {
		const testResult = exampleSuccessResult;

		const outputParser = OutputParser(testResult);
		expect(outputParser.formatDebug()).toContain("My username: { username: 'Hello' }");
	});
	test('Should extract the test output from a failed test', () => {
		const testResult = exampleFailureResult;

		const outputParser = OutputParser(testResult);
		expect(outputParser.formatDebug()).toContain("My username: { username: 'Hello' }");
	})
});