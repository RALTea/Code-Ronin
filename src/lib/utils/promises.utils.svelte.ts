export type PromiseState = 'pending' | 'fulfilled' | 'rejected';

export class TrackedPromise<T> {
	private state: PromiseState = $state('pending');
	private value: T | Error | undefined = $state(undefined);
	public promise: Promise<T>;

	private constructor(promise: Promise<T>) {
		this.promise = promise;
		promise.then(
			(result: T) => {
				this.state = 'fulfilled';
				this.value = result;
			},
			(error: Error) => {
				this.state = 'rejected';
				this.value = error;
			}
		);
	}

	public static from<T>(fn: () => Promise<T>): TrackedPromise<T> {
		return new TrackedPromise(fn());
	}

	public getValue(): T | Error | undefined {
		return this.value;
	}

	public isPending(): boolean {
		return this.state === 'pending';
	}

	public isFulfilled(): boolean {
		return this.state === 'fulfilled';
	}

	public isRejected(): boolean {
		return this.state === 'rejected';
	}
}
