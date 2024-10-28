export const CodeBuilder = (start: string) => {
	let result = start;
	return {
		build: function() {
			return result;
		},
		replace: function(pattern: string, value: string) {
			result = result.replace(pattern, value);
			return this;
		},
		removeComments: function() {
			// Double slash comments
			result = result.replace(/\/\/.*\n/g, '');
			// Slash-star comments
			result = result.replace(/\/\*[\s\S]*?\*\//g, '');
			// Hash comments
			result = result.replace(/#.*\n/g, '');
			// HTML comments
			result = result.replace(/<!--.*-->/g, '');
			return this;
		}
	}
}