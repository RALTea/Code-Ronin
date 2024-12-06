export const OutputExamples = {
	err1: `"⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  script.test.ts > StudentSolution:ANewDevIsBorn > A variable named "username" should exist (be declared)
ReferenceError: username is not defined
 ❯ script.test.ts:7:10
      5| describe('StudentSolution:ANewDevIsBorn', () => {
      6|  it('A variable named "username" should exist (be declared)', () => {
      7|   expect(username).toBeDefined();
       |          ^
      8|  });
      9|  it('The variable "username" should be a string', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  script.test.ts > StudentSolution:ANewDevIsBorn > The variable "username" should be a string
AssertionError: expected 'undefined' to be 'string' // Object.is equality

Expected: "string"
Received: "undefined"

 ❯ script.test.ts:10:27
      8|  });
      9|  it('The variable "username" should be a string', () => {
     10|   expect(typeof username).toBe('string');
       |                           ^
     11|  });
     12|  it('The variable "username" should be a constant', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯

"`,
	stdout1: `STDOUT:

 RUN  v2.1.3 /box

stdout | script.test.ts
Hello world

 ❯ script.test.ts  (3 tests | 2 failed) 11ms
   × StudentSolution:ANewDevIsBorn > A variable named "username" should exist (be declared)
     → username is not defined
   × StudentSolution:ANewDevIsBorn > The variable "username" should be a string
     → expected 'undefined' to be 'string' // Object.is equality

 Test Files  1 failed (1)
      Tests  2 failed | 1 passed (3)
   Start at  12:17:10
   Duration  335ms (transform 64ms, setup 0ms, collect 34ms, tests 11ms, environment 0ms, prepare 99ms)`,

	 errPlusStd: `⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  script.test.ts > StudentSolution:ANewDevIsBorn > A variable named "username" should exist (be declared)
ReferenceError: username is not defined
 ❯ script.test.ts:7:10
      5| describe('StudentSolution:ANewDevIsBorn', () => {
      6|  it('A variable named "username" should exist (be declared)', () => {
      7|   expect(username).toBeDefined();
       |          ^
      8|  });
      9|  it('The variable "username" should be a string', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  script.test.ts > StudentSolution:ANewDevIsBorn > The variable "username" should be a string
AssertionError: expected 'undefined' to be 'string' // Object.is equality

Expected: "string"
Received: "undefined"

 ❯ script.test.ts:10:27
      8|  });
      9|  it('The variable "username" should be a string', () => {
     10|   expect(typeof username).toBe('string');
       |                           ^
     11|  });
     12|  it('The variable "username" should be a constant', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯



 RUN  v2.1.3 /box

stdout | script.test.ts
Hello world

 ❯ script.test.ts  (3 tests | 2 failed) 8ms
   × StudentSolution:ANewDevIsBorn > A variable named "username" should exist (be declared)
     → username is not defined
   × StudentSolution:ANewDevIsBorn > The variable "username" should be a string
     → expected 'undefined' to be 'string' // Object.is equality

 Test Files  1 failed (1)
      Tests  2 failed | 1 passed (3)
   Start at  12:44:03
   Duration  296ms (transform 38ms, setup 0ms, collect 26ms, tests 8ms, environment 0ms, prepare 63ms)

`,
  assert: `"⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  script.test.ts > StudentSolution:StringsMaster > The weaponDescription should have the correct format and content
AssertionError: expected 'The Excalibur is aSwordthat deals100 …' to be 'The Excalibur is a Sword that deals 1…' // Object.is equality

Expected: "The Excalibur is a Sword that deals 100 damage"
Received: "The Excalibur is aSwordthat deals100 damage"

 ❯ script.test.ts:37:35
     35| 
     36|     test('The weaponDescription should have the correct format and con…
     37|         expect(weaponDescription).toBe('The Excalibur is a Sword that …
       |                                   ^
     38|     });
     39| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯



 RUN  v2.1.3 /box

 ❯ script.test.ts  (5 tests | 1 failed) 10ms
   × StudentSolution:StringsMaster > The weaponDescription should have the correct format and content
     → expected 'The Excalibur is aSwordthat deals100 …' to be 'The Excalibur is a Sword that deals 1…' // Object.is equality

 Test Files  1 failed (1)
      Tests  1 failed | 4 passed (5)
   Start at  13:24:06
   Duration  302ms (transform 48ms, setup 0ms, collect 34ms, tests 10ms, environment 0ms, prepare 99ms)

"`,
  assertMultiple: `⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯
FAIL script.test.ts > Test1 > First test
AssertionError: expected 'abc' to be 'def' // Object.is equality
Expected: "def"
Received: "abc"
❯ script.test.ts:10:35

FAIL script.test.ts > Test2 > Second test
AssertionError: expected '123' to be '456' // Object.is equality
Expected: "456"
Received: "123"
❯ script.test.ts:20:35

RUN v2.1.3 /box
❯ script.test.ts (3 tests | 2 failed) 10ms
× Test1 > First test
× Test2 > Second test
Test Files 1 failed (1)
Tests 2 failed | 1 passed (3)
Start at 13:24:06
Duration 302ms`
};
