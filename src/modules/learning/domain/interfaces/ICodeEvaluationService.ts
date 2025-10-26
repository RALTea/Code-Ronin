type CodeEvaluationResult = {
	tests: {
		name: string;
	} & (
		| {
				status: 'passed';
		  }
		| {
				status: 'failed';
				failureMessages: string[];
		  }
	);
}[];

export interface ICodeEvaluationService {
	evaluateCode: (code: string, language: string) => Promise<CodeEvaluationResult>;
}
