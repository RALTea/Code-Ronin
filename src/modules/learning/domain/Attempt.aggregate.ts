import { AggregateRoot } from '$ddd/interfaces/AggregateRoot';
import type { ApprenticeId } from '$learning/ApprenticeId.valueObject';
import { AttemptId } from './AttemptId.valueObject';
import { AttemptStatus } from './AttemptStatus.valueObject';
import type { EvaluationReport } from './EvaluationReport.valueObject';
import type { Language } from './Language.valueObject';
import type { TaskId } from './TaskId.valueObject';

export class Attempt extends AggregateRoot<AttemptId> {
	apprenticeId: ApprenticeId;
	taskId: TaskId;
	language: Language;
	apprenticeSolution: string;
	status: AttemptStatus;
	evaluationReport?: EvaluationReport;

	private constructor(
		id: AttemptId,
		apprenticeId: ApprenticeId,
		taskId: TaskId,
		language: Language,
		apprenticeSolution: string,
		status: AttemptStatus,
		evaluationReport?: EvaluationReport
	) {
		super(id);
		this.apprenticeId = apprenticeId;
		this.taskId = taskId;
		this.language = language;
		this.apprenticeSolution = apprenticeSolution;
		this.status = status;
		this.evaluationReport = evaluationReport;
	}

	static create(
		apprenticeId: ApprenticeId,
		taskId: TaskId,
		language: Language,
		apprenticeSolution: string
	): Attempt {
		return new Attempt(
			new AttemptId(),
			apprenticeId,
			taskId,
			language,
			apprenticeSolution,
			new AttemptStatus('PENDING')
		);
	}
}
