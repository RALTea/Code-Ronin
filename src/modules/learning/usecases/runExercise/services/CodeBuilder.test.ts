import { describe, expect, it } from 'vitest';
import { CodeBuilder } from './CodeBuilder';

describe('CodeBuilder:Unit', () => {
	it('should return code provided in the constructor', () => {
		const code = 'const a = 1;';
		const builder = CodeBuilder(code).build();
		expect(builder).toBe(code);
	});

	it('should replace the provided pattern with the provided value', () => {
		const code = `const a = "hello;\n// (@@@*@@@)\nconst b = "world";`;
		const builder = CodeBuilder(code).replace('// (@@@*@@@)', 'console.log(a);').build();
		expect(builder).toBe(`const a = "hello;\nconsole.log(a);\nconst b = "world";`);
	});

	it('should remove double slash comments from the code', () => {
		const code = `const a = "hello;\n// comment\nconst b = "world";`;
		const builder = CodeBuilder(code).removeComments().build();
		expect(builder).toBe(`const a = "hello;\nconst b = "world";`);
	});

	it('should remove slash-star comments from the code', () => {
		const code = `const a = "hello;\n/* comment\npart2\n */\nconst b = "world";`;
		const builder = CodeBuilder(code).removeComments().build();
		expect(builder).toBe(`const a = "hello;\n\nconst b = "world";`);
	});

	it('should remove hash comments from the code', () => {
		const code = `const a = "hello;\n# comment\nconst b = "world";`;
		const builder = CodeBuilder(code).removeComments().build();
		expect(builder).toBe(`const a = "hello;\nconst b = "world";`);
	});

	it('should remove HTML comments from the code', () => {
		const code = `const a = "hello;\n<!-- comment -->\nconst b = "world";`;
		const builder = CodeBuilder(code).removeComments().build();
		expect(builder).toBe(`const a = "hello;\n\nconst b = "world";`);
	});

	it('should remove only the comments that are not in the commentsToKeep array', () => {
		const code = `const a = "hello;\n// shouldstay\nconst b = "world";\n// should be removed`;
		const builder = CodeBuilder(code).removeComments(['// shouldstay']).build();
		expect(builder).toBe(`const a = "hello;\n// shouldstay\nconst b = "world";`);
	});
});