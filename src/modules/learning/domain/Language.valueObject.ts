export class Language {
	name: 'bash' | 'javascript' | 'python' | 'typescript';
	version: `${number}.${number}.${number}` | `${number}.${number}` | `${number}`;
	tag?: string;
}
