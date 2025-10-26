export interface ICodeBuilder {
	buildCode: (apprenticeSolution: string, testFileContent: string) => Promise<string>;
}
