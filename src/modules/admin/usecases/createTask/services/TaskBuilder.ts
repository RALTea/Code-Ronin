import type { CreateTaskDto } from '../aggregates/CreateTaskDto';

export const TaskBuilder = () => {
	const createTaskDto: CreateTaskDto = {
		id: crypto.randomUUID(),
		exp: 0,
		instructions: 'Instructions...',
		isMiniboss: false,
		name: 'Task name',
		previousTaskIds: undefined,
		nextTaskIds: undefined,
		validation: {
			expectedStderr: undefined,
			expectedStdout: undefined,
			forbiddenSnippets: [],
			mandatorySnippets: [],
			testFileName: undefined
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
		addNextTaskId: function (nextTaskId: string) {
			createTaskDto.nextTaskIds ??= [];
			createTaskDto.nextTaskIds.push(nextTaskId);
			return this;
		},
		addPreviousTaskId: function (previousTaskId: string) {
			createTaskDto.previousTaskIds ??= [];
			createTaskDto.previousTaskIds.push(previousTaskId);
			return this;
		},
		removeNextTaskId: function (nextTaskId: string) {
			createTaskDto.nextTaskIds = createTaskDto.nextTaskIds?.filter(
				(taskId) => taskId !== nextTaskId
			);
			return this;
		},
		removePreviousTaskId: function (previousTaskId: string) {
			createTaskDto.previousTaskIds = createTaskDto.previousTaskIds?.filter(
				(taskId) => taskId !== previousTaskId
			);
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
		setTestFile: function (testFileName: string) {
			createTaskDto.validation.testFileName = testFileName;
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
		}
	};
};
