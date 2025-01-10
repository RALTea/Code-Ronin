export const CodeBuilder = (start: string) => {
	let result = start;
	return {
		build: function () {
			return result;
		},
		replaceAll: function (pattern: string, value: string) {
			result = result.replace(new RegExp(pattern, 'g'), value);
			return this;
		},
		replace: function (pattern: string, value: string) {
			result = result.replace(pattern, value);
			return this;
		},
		removeComments: function(commentsToKeep?: string[]) {
			if (!commentsToKeep) {
					// If no comments to keep, remove all comments
					result = result.replace(/\/\/.*\n/g, '');
					result = result.replace(/\/\*[\s\S]*?\*\//g, '');
					result = result.replace(/#.*\n/g, '');
					result = result.replace(/<!--.*-->/g, '');
			} else {
					// Split the code into lines
					let lines = result.split('\n');
					
					// Process each line
					lines = lines.filter(line => {
							// Keep the line if it contains a comment we want to keep
							if (commentsToKeep.some(comment => line.includes(comment))) {
									return true;
							}
							// Remove the line if it's only a comment
							if (line.trim().startsWith('//') || 
									line.trim().startsWith('#') || 
									line.trim().startsWith('/*') || 
									line.trim().startsWith('<!--')) {
									return false;
							}
							return true;
					});
	
					result = lines.join('\n');
			}
			return this;
	}
	};
};
