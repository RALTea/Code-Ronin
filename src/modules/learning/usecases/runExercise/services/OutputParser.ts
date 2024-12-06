export const OutputParser = (output: string) => {
	return {
		_listCauses: () => {
			const matches = Array.from(output.matchAll(/FAIL [^>]+> [^>]+> (.+?)(?=\n)/g));
			return matches.map((match) => match[1]); // Extract the captured group
		},
		_extractStdout: () => {
			const stdoutMatch = output.match(/stdout \| script\.test\.ts\n([\s\S]*?)\n\s*❯/);
			if (!stdoutMatch || !stdoutMatch[1]) return 'STDOUT: <empty>';
			return `⚙ STDOUT:\n  ${stdoutMatch[1]?.trim()?.replaceAll('\n', '\n  ')}\n`;
		},
		formatSuccess: function () {
			const title = `Exercise Completed ✓\n\n`;
			return `${title}${this._extractStdout()}`;
		},
		_formatCauses: function () {
			const prettify = (cause: string) => `  × ${cause}`;
			const causes = this._listCauses();
			const title = causes.length > 1 ? 'Failed Tests:' : 'Failed Test:';
			return `× ${title}\n${causes.map(prettify).join('\n')}`;
		},
		_extractTestResults: () => {
			const testMatch = output.match(/❯ script\.test\.ts\s+\(\d+ tests[^]*?Duration.*?ms\)/);
			if (!testMatch) return '<no test results>';
			return testMatch[0];
		},
		_extractAssertions: () => {
			const assertionPattern = /AssertionError:.*?\nExpected: "(.*?)"\nReceived: "(.*?)"/gs;
			const matches = Array.from(output.matchAll(assertionPattern));

			return matches.map((match) => ({
				expected: match[1],
				received: match[2]
			}));
		},
		_extractFailures: () => {
			// Match each FAIL block including its assertion
			const failurePattern =
				/FAIL [^>]+> [^>]+> (.+?)\nAssertionError:.*?\nExpected: "(.*?)"\nReceived: "(.*?)"/gs;
			const matches = Array.from(output.matchAll(failurePattern));

			return matches.map((match) => ({
				cause: match[1],
				expected: match[2],
				received: match[3]
			}));
		},
		formatErrors: function () {
			const title = 'Exercise Failed ×\n\n';
			const failures = this._extractFailures().map(
				({ cause, expected, received }) =>
					`  × ${cause}\n    - Expected: "${expected}"\n    + Received: "${received}"`
			);

			return title + failures.join('\n\n');
		},
		cleanUp() {
			return this._extractTestResults();
		}
	};
};
