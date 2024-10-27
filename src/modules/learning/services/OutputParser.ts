export const OutputParser = (output: string) => {
	let result = output;
	return {
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
			// const testName = testNameRegex.exec(result)?.[1] ?? '';
			const description = descriptionRegex.exec(result)?.[1] ?? '';
			const actualOutput = actualOutputRegex.exec(result)?.[1] ?? '';
			const expectedOutput = expectedOutputRegex.exec(result)?.[1] ?? '';

			// Format the extracted information into the desired string
			result = `Exercise Failed ×\n
❯ Test named '${description}' - Failed ×
\t→ Your code outputs: '${actualOutput}'
\t→ Expected output: '${expectedOutput}'`;
			return this;
		},
		formatSuccess: function () {
			const numberOfPassedTestsRegex = /Tests {2}(\d+) passed/;
			const numberOfPassedTests = numberOfPassedTestsRegex.exec(result)?.[1] ?? '0';
			
			result = `❯ ${numberOfPassedTests} tests passed\n\nExercise completed ✓`;

			return this;
		},
		get: function () {
			return result;
		}
	};
};