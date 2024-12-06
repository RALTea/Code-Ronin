import { env } from '$env/dynamic/public';
import type { Attempt } from '$learning/domain/Attempt';
import type { ExerciseAttempt } from '../aggregates/ExerciseAttempt';
import * as IRunExerciseRepository from './IRunExerciseRepository';

type _LocalStorageAttemptRepository = {
	handleSuccess: IRunExerciseRepository.HandleSuccess;
	handleFail: IRunExerciseRepository.HandleFail;
};

/**
 * 
 * This repository is used to store the attempt data in the local storage,
 * in the case where the user is running the exercise in the public demo campaign.
 * 
 */
export const LocalStorageAttemptRepository = (): _LocalStorageAttemptRepository => {
	const storeInLocalStorage = (data: ExerciseAttempt) => {
		const attemptsOnDemoStr: string | null = localStorage.getItem(env.PUBLIC_DEMO_CAMPAIGN_NAME);
		let attemptsOnDemo: Attempt[] = [];
		if (attemptsOnDemoStr) {
			attemptsOnDemo = JSON.parse(attemptsOnDemoStr);
		}
		const attempt = {
			date: new Date().toISOString(),
			success: data.status === "SUCCESS",
			taskId: data.taskId,
		}
		attemptsOnDemo.push(attempt);
		localStorage.setItem(env.PUBLIC_DEMO_CAMPAIGN_NAME, JSON.stringify(attemptsOnDemo));
	}
	return {
		handleSuccess: async (data) => {
			storeInLocalStorage(data);
		},
		handleFail: async (data) => {
			if (!data) return;
			storeInLocalStorage(data);
		}
	};
}