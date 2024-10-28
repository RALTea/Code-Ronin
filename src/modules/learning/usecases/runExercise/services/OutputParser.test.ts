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
		const output = OutputParser('script.test.ts  (1 test | 1 failed) 8ms\nExited with error status 1').removeExitMessage().get();
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
		const output = OutputParser(typicalSuccess)
		.formatSuccess()
		.get();

		expect(output).toBe(`❯ 2 tests passed\n\nExercise completed ✓`);
	});
});
