export type Validation = {
	expectedStdout?: string;
	expectedStderr?: string;
	testFileNames?: string[];
	forbiddenSnippets?: string[];
	mandatorySnippets?: string[];
	taskId: string;
};
