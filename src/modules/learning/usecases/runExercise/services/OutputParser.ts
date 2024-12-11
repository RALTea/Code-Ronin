type AssertionInfoType = 'cause' | 'expected' | 'received';
const PATTERNS: {
	ERROR_SECTION: RegExp;
	ASSERTIONS: { regex: RegExp; order: AssertionInfoType[] }[];
} = {
	ERROR_SECTION: /^[\s\S]*?(?=RUN)/,
	ASSERTIONS: [
		// Pattern 1: Simple assertion with just a message
		// /AssertionError:\s*([^\n]+)/g,

		// Pattern 2: Assertion with Object.is equality
		{
			regex:
				/FAIL\s+script\.test\.ts\s+>\s+[^>]+>\s+([^\n]+)\n+AssertionError:[^\n]*expected\s+'([^']+)'\s+to\s+be\s+'([^']+)'\s+\/\/\s+Object\.is equality/g,
			order: ['cause', 'received', 'expected']
		},

		// Pattern 3: Assertion with contains/matches
		{
			regex:
				/FAIL\s+script\.test\.ts\s+>\s+[^>]+>\s+([^\n]+)\n+AssertionError:[^\n]*expected\s+'([^']+)'\s+to\s+contain\s+'([^']+)'/g,
			order: ['cause', 'received', 'expected']
		},

		// Pattern 4: RegExp matching
		{
			regex:
				/FAIL\s+script\.test\.ts\s+>\s+[^>]+>\s+([^\n]+)\n+AssertionError:[^\n]*expected\s+'([^']+)'\s+to\s+match\s+\/([^/]+)\//g,
			order: ['cause', 'received', 'expected']
		},

		// Pattern 5: Standard assertion with Expected/Received
		{
			regex:
				/FAIL\s+script\.test\.ts\s+>\s+[^>]+>\s+([^\n]+)\n+AssertionError:([^-]+)[-\n]\s*Expected:?\s*([^\n]+)\n?\s*\+\s*Received:?\s*([^\n]+)/gm,
			order: ['cause', 'expected', 'received']
		}
	]
};

export const OutputParser = (output: string) => {
	return {
		_listCauses: () => {
			const matches = Array.from(output.matchAll(/FAIL [^>]+> [^>]+> (.+?)(?=\n)/g));
			return matches.map((match) => match[1]); // Extract the captured group
		},
		_extractStdout: () => {
			const stdoutMatch = output.match(/stdout \| script\.test\.ts\n([\s\S]*?)\n\s*❯/);
			if (!stdoutMatch || !stdoutMatch[1]) return '';
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
		_extractFailures: () => {
			// Match each FAIL block including its assertion
			const getPosition = (order: string[], element: AssertionInfoType) => {
				const index = order.indexOf(element);
				if (index === -1) return -1;
				return order.indexOf(element) + 1;
			};
			const failures = PATTERNS.ASSERTIONS.map(({ regex, order }) => {
				const matches = Array.from(output.matchAll(regex));
				console.debug({ regex, matches });
				return matches.map((match) => ({
					cause: (match[getPosition(order, 'cause')] || 'Unknown cause'),
					expected: (match[getPosition(order, 'expected')] || ''),
					received: (match[getPosition(order, 'received')] || ''),
				}));
			}).flat();

			return failures.filter(
				(failure, index, self) => index === self.findIndex((f) => f.cause === failure.cause)
			);
		},
		formatErrors: function () {
			const title = 'Exercise Failed ×\n\n';
			output = output.match(PATTERNS.ERROR_SECTION)?.[0] ?? output;
			console.debug({ formattingFrom: output });
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
