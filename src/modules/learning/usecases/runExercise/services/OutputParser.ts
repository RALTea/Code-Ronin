export const OutputParser = (output: string) => {
	let result = output;
	const messageTitleFail = () => "Exercise Failed ×"
	const messageTitleSuccess = () => "Exercise completed ✓"
	const messageTestNameFail = (testName: string) => `❯ Test named '${testName}' - Failed ×`
	const messageTestNameSuccess = (testName: string) => `❯ Test named '${testName}' - Passed ✓`
	const messageTestFail = (actualOutput: string, expectedOutput: string) => {
		const actualOutputMessage = actualOutput ? `\n\t→ Your code outputs: '${actualOutput}'` : '';
		const expectedOutputMessage = expectedOutput
			? `\n\t→ Expected output: '${expectedOutput}'`
			: '';

		return `${actualOutputMessage}${expectedOutputMessage}`;
	}
	const messageTestSuccess = (numberOfPassedTests: number) => {
		return `❯ ${numberOfPassedTests} tests passed\n\nExercise completed ✓`;
	}


	return {
		messageTitleFail,
		messageTitleSuccess,
		messageTestNameFail,
		messageTestNameSuccess,
		messageTestFail,
		messageTestSuccess,
		trim: function () {
			result = result.trim();
			return this;
		},
		removeRunHeader: function () {
			result = result.replace(/ RUN.*\n/, '');
			return this;
		},
		removeExitMessage: function () {
			result = result.replace(/\nExited with error status \d+/, '');
			return this;
		},
		applyAll: function () {
			result = this.trim().get();
			return this;
		},
		formatError: function () {
			// Regular expressions to extract relevant information
			// const testNameRegex = /StudentSolution:(\w+)/;
			const descriptionRegex = /> (.+)/;
			const actualOutputRegex = /expected '(.+)' to be/;
			const expectedOutputRegex = /to be '(.+)'/;

			// Extract information using regex
			const description = descriptionRegex.exec(result)?.[1] ?? '';
			const actualOutput = actualOutputRegex.exec(result)?.[1] ?? '';
			const expectedOutput = expectedOutputRegex.exec(result)?.[1] ?? '';

			// Format the extracted information into the desired string
			result = `${messageTitleFail()}\n\n${messageTestNameFail(description)}${messageTestFail(actualOutput, expectedOutput)}`;

			return this;
		},
		formatSuccess: function () {
			const numberOfPassedTestsRegex = /Tests {2}(\d+) passed/;
			const numberOfPassedTests = numberOfPassedTestsRegex.exec(result)?.[1] ?? '0';

			result = `${messageTitleSuccess()}\n\n${messageTestSuccess(Number(numberOfPassedTests))}`;

			return this;
		},
		get: function () {
			return result;
		}
	};
};
