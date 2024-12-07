import { describe, expect, it } from 'vitest';
import { OutputParser } from './OutputParser';

const typicalError = `
 RUN  v2.1.3 /box

 ❯ script.test.ts  (1 test | 1 failed) 8ms
   × StudentSolution:printalphabet > should print the alphabet
     → expected 'a' to be 'abcdefghijklmnopqrstuvwxyz' // Object.is equality

 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  10:12:55
   Duration  301ms (transform 35ms, setup 0ms, collect 26ms, tests 8ms, environment 0ms, prepare 83ms)

Exited with error status 1`;

const typicalSuccess = `
 RUN  v2.1.3 /box

 ✓ script.test.ts  (2 tests) 2ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  11:43:25
   Duration  263ms (transform 40ms, setup 0ms, collect 27ms, tests 2ms, environment 0ms, prepare 78ms)
`;

describe('OutputParser:Unit', () => {
	it('Should remove trailing newlines', () => {
		const output = OutputParser('\nabc\n').trim().get();
		expect(output).toBe('abc');
	});
	it('Should remove the RUN header', () => {
		const output = OutputParser(' RUN  v2.1.3 /box\nscript.test.ts  (1 test | 1 failed) 8ms')
			.removeRunHeader()
			.get();
		expect(output).toBe('script.test.ts  (1 test | 1 failed) 8ms');
	});
	it('Should remove Exit message', () => {
		const output = OutputParser(
			'script.test.ts  (1 test | 1 failed) 8ms\nExited with error status 1'
		)
			.removeExitMessage()
			.get();
		expect(output).toBe('script.test.ts  (1 test | 1 failed) 8ms');
	});
	it('Should format error', () => {
		const output = OutputParser(typicalError)
			.trim()
			.removeExitMessage()
			.removeRunHeader()
			.formatError()
			.get();

		expect(output).toBe(`Exercise Failed ×\n
❯ Test named 'should print the alphabet' - Failed ×
\t→ Your code outputs: 'a'
\t→ Expected output: 'abcdefghijklmnopqrstuvwxyz'`);
	});

	it('Should format success', () => {
		const parser = OutputParser(typicalSuccess);
		const output = parser.formatSuccess().get();

		expect(output).toBe(`${parser.messageTitleSuccess()}\n\n❯ 2 tests passed\n\nExercise completed ✓`);
	});

	it('Should omit outputs if they are empty', () => {
		const errMsg = `
RUN  v2.1.3 /box

 ❯ script.test.ts  (3 tests | 1 failed) 9ms
   × StudentSolution:ANewDevIsBorn > The variable "username" should be a constant
     → expected [Function] to throw an error

 Test Files  1 failed (1)
      Tests  1 failed | 2 passed (3)
   Start at  11:15:11
   Duration  292ms (transform 37ms, setup 0ms, collect 26ms, tests 9ms, environment 0ms, prepare 66ms)

Exited with error status 1`;

		const parser = OutputParser(errMsg);
		const output = parser.trim().removeExitMessage().removeRunHeader().formatError().get();

		expect(output).toBe(
			`${parser.messageTitleFail()}\n\n${parser.messageTestNameFail('The variable "username" should be a constant')}`
		);
	});
});
