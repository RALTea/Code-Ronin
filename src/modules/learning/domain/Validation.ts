export type Validation = {
	expectedStdout?: string,
	expectedStderr?: string,
	testFileIds?: string[],
	forbiddenSnippets?: string[],
	mandatorySnippets?: string[],
	taskId: string,
}