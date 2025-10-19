import type { Attempt } from '../Attempt.aggregate';

export interface IAttemptRepository {
	save(attempt: Attempt): Promise<void>;
	findById(id: string): Promise<Attempt | null>;
}
