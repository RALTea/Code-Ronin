import type { CreateTaskDto } from '$learning/usecases/createTask/aggregates/CreateTaskDto';

export const TaskBuilder = () => {
	const createTaskDto: CreateTaskDto = {
		id: crypto.randomUUID(),
		exp: 0,
		instructions: 'Instructions...',
		isMiniboss: false,
		name: 'Task name',
		previousTaskId: undefined,
		nextTaskId: undefined,
		validation: {
			expectedStderr: undefined,
			expectedStdout: undefined,
			forbiddenSnippets: [],
			mandatorySnippets: [],
			testFileNames: []
		}
	};

	return {
		build: function () {
			return createTaskDto;
		},
		getId: function () {
			return [createTaskDto.id, this];
		},
		setExp: function (exp: number) {
			createTaskDto.exp = exp;
			return this;
		},
		setInstructions: function (instructions: string) {
			createTaskDto.instructions = instructions;
			return this;
		},
		setIsMiniboss: function (isMiniboss: boolean) {
			createTaskDto.isMiniboss = isMiniboss;
			return this;
		},
		setName: function (name: string) {
			createTaskDto.name = name;
			return this;
		},
		setNextTaskId: function (nextTaskId: string) {
			createTaskDto.nextTaskId = nextTaskId;
			return this;
		},
		setPreviousTaskId: function (previousTaskId: string) {
			createTaskDto.previousTaskId = previousTaskId;
			return this;
		},
		setExpectedStderr: function (expectedStderr: string) {
			createTaskDto.validation.expectedStderr = expectedStderr;
			return this;
		},
		setExpectedStdout: function (expectedStdout: string) {
			createTaskDto.validation.expectedStdout = expectedStdout;
			return this;
		},
		addForbiddenSnippet: function (forbiddenSnippet: string) {
			createTaskDto.validation.forbiddenSnippets ??= [];
			createTaskDto.validation.forbiddenSnippets.push(forbiddenSnippet);
			return this;
		},
		addMandatorySnippet: function (mandatorySnippet: string) {
			createTaskDto.validation.mandatorySnippets ??= [];
			createTaskDto.validation.mandatorySnippets.push(mandatorySnippet);
			return this;
		},
		addTestFile: function (testFileName: string) {
			createTaskDto.validation.testFileNames ??= [];
			createTaskDto.validation.testFileNames.push(testFileName);
			return this;
		},
		removeForbiddenSnippet: function (forbiddenSnippet: string) {
			createTaskDto.validation.forbiddenSnippets =
				createTaskDto.validation.forbiddenSnippets?.filter(
					(snippet) => snippet !== forbiddenSnippet
				);
			return this;
		},
		removeMandatorySnippet: function (mandatorySnippet: string) {
			createTaskDto.validation.mandatorySnippets =
				createTaskDto.validation.mandatorySnippets?.filter(
					(snippet) => snippet !== mandatorySnippet
				);
			return this;
		},
		removeTestFile: function (testFileName: string) {
			createTaskDto.validation.testFileNames = createTaskDto.validation.testFileNames?.filter(
				(fileName) => fileName !== testFileName
			);
			return this;
		}
	};
};
