import type { PrismaClient } from '@prisma/client';
import type { UpdateValidationDto } from '../aggregates/UpdateValidationDto';
import * as IEditTaskRepository from './IEditTaskRepository';

type _PrismaEditTaskRepository = {
	saveTaskData: IEditTaskRepository.SaveTaskData;
	saveValidation: IEditTaskRepository.SaveValidation;
};

export const PrismaEditTaskRepository = (prisma: PrismaClient): _PrismaEditTaskRepository => {
	return {
		saveTaskData: async (dto) => {
			await prisma.task.update({
				where: { id: dto.id },
				data: {
					name: dto.name,
					instructions: dto.instructions,
					exp: dto.exp,
					isMiniboss: dto.isMiniboss,
					answerType: dto.testType,
					previousTasks: {
						set: (dto.previousTaskIds ?? []).map((id) => ({ id }))
					},
					nextTasks: {
						set: (dto.nextTaskIds ?? []).map((id) => ({ id }))
					}
				}
			});
		},
		saveValidation: async (dto: UpdateValidationDto) => {
			// For now we act as if there's only one validation per task
			const existingValidation = await prisma.validation.findFirst({
				where: { taskId: dto.taskId }
			});
			if (!existingValidation) {
				await prisma.validation.create({
					data: {
						expectedStderr: dto.expectedStderr,
						expectedStdout: dto.expectedStdout,
						testFileUrl: dto.testFileName,
						task: {
							connect: { id: dto.taskId }
						},
						snippets: {
							create: [
								...(dto.forbiddenSnippets ?? []).map((snippet) => ({
									type: 'FORBIDDEN',
									content: snippet
								})),
								...(dto.mandatorySnippets ?? []).map((snippet) => ({
									type: 'REQUIRED',
									content: snippet
								}))
							]
						}
					}
				});
				return;
			}
			await prisma.$transaction(async (prisma) => {
				await prisma.validation.upsert({
					where: { id: existingValidation.id },
					update: {
						expectedStderr: dto.expectedStderr,
						expectedStdout: dto.expectedStdout,
						testFileUrl: dto.testFileName
					},
					create: {
						expectedStderr: dto.expectedStderr,
						expectedStdout: dto.expectedStdout,
						testFileUrl: dto.testFileName,
						task: {
							connect: { id: dto.taskId }
						}
					}
				});
				await prisma.snippet.deleteMany({
					where: { validationId: existingValidation.id }
				});
				await prisma.snippet.createMany({
					data: [
						...(dto.forbiddenSnippets ?? []).map((snippet) => ({
							validationId: existingValidation.id,
							type: 'FORBIDDEN',
							content: snippet
						})),
						...(dto.mandatorySnippets ?? []).map((snippet) => ({
							validationId: existingValidation.id,
							type: 'REQUIRED',
							content: snippet
						}))
					]
				});
			});
		}
	};
};
