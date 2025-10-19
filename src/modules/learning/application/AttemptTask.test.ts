import { ApprenticeId } from '$learning/ApprenticeId.valueObject';
import { describe, test, expect, beforeEach } from 'vitest';
import { AttemptTaskUsecase } from './AttemptTask.usecase';
import type { IAttemptRepository } from '$learning/domain/interfaces/IAttemptRepository';
import type { Attempt } from '$learning/domain/Attempt.aggregate';

describe('Unit:AttemptTask', async () => {
	const createAttemptRepository = (): IAttemptRepository => {
		const attempts = new Map<string, Attempt>();
		return {
			save: async (attempt) => {
				attempts.set(attempt.id.id(), attempt);
			},
			findById: async (id) => {
				return attempts.get(id) || null;
			}
		};
	};
	let mockAttemptRepository: IAttemptRepository;

	beforeEach(() => {
		mockAttemptRepository = createAttemptRepository();
	});

	test('Given valid solutions, should mark attempt as success', async () => {
		// Given
		const apprenticeId = new ApprenticeId();
		const apprenticeSolution = `function sum(a, b) { return a + b; }`;

		// When
		const result = await new AttemptTaskUsecase(mockAttemptRepository).execute(
			apprenticeId,
			apprenticeSolution
		);

		// Then
		expect(result.isSuccess).toBe(true);
	});
});
