import type { Task } from '$learning/domain/Task';
import type { ApprenticeAttempt } from '../aggregates/ApprenticeAttempt';

export type GetApprenticeAttemptsOnQuest = (apprenticeId: string, questId: string) => Promise<ApprenticeAttempt[]>;
export type GetTasksFromQuest = (questId: string) => Promise<Task[]>;
