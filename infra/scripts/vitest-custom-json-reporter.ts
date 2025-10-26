import { JsonReporter } from 'vitest/reporters';
import type { Reporter, TestModule, Task, UserConsoleLog } from 'vitest';

// Define the shape of our custom log object
interface CustomLog {
	type: string;
	message: string;
}

export default class CustomJsonReporter extends JsonReporter implements Reporter {
	// Stores logs captured from `onUserConsoleLog`, keyed by taskId
	private logsByTaskId = new Map<string, CustomLog[]>();

	// Stores logs mapped by the test's `fullName` for easy lookup in the report
	private logsByFullName = new Map<string, CustomLog[]>();

	// Stores logs that are not associated with any task OR logs from a suite
	private globalLogs: CustomLog[] = [];

	constructor(options: any) {
		// Pass options to the base JsonReporter constructor
		super(options);
	}

	/**
	 * Called by Vitest for each console log (log, warn, error) from tests.
	 */
	onUserConsoleLog(log: UserConsoleLog) {
		const { content, type, taskId } = log;
		const customLog = { type, message: content };

		if (taskId) {
			// Log is associated with a specific task (test or suite)
			if (!this.logsByTaskId.has(taskId)) {
				this.logsByTaskId.set(taskId, []);
			}
			this.logsByTaskId.get(taskId)!.push(customLog);
		} else {
			// Log is not associated with any task (should be rare, but captured)
			this.globalLogs.push(customLog);
		}
	}

	/**
	 * Recursively traverses all tasks to sort logs.
	 * - Logs from SUITES go into `this.globalLogs`.
	 * - Logs from TESTS go into `this.logsByFullName`.
	 */
	private processLogs(tasks: Task[]) {
		for (const task of tasks) {
			const taskLogs = this.logsByTaskId.get(task.id) || [];

			if (task.type === 'test') {
				const fullName = this.getTaskFullName(task);
				this.logsByFullName.set(fullName, taskLogs);
			} else if (task.type === 'suite') {
				// Add suite-level logs to globalLogs
				this.globalLogs.push(...taskLogs);
				// Recurse into children
				if (task.tasks) {
					this.processLogs(task.tasks);
				}
			}
		}
	}

	/**
	 * Helper to generate the Jest-style `fullName` for a test task.
	 */
	private getTaskFullName(task: Task): string {
		const ancestorTitles: string[] = [];
		let current: Task | undefined = task.suite;
		while (current) {
			if (current.name) {
				ancestorTitles.push(current.name);
			}
			current = current.suite;
		}
		ancestorTitles.reverse();
		return [...ancestorTitles, task.name].join(' ');
	}

	/**
	 * Called by Vitest when the test run is finished.
	 * We override this to process our logs *before* the parent class builds the report.
	 */
	async onTestRunEnd(
		testModules: ReadonlyArray<TestModule>,
		unhandledErrors: ReadonlyArray<Error>,
		reason: string
	) {
		const files = testModules.map((testModule) => testModule.task);

		// NEW: Process all tasks to sort logs into globalLogs or logsByFullName
		this.processLogs(files);

		// Now, let the parent JsonReporter do its work.
		// It will internally call `this.writeReport` when it's done.
		await super.onTestRunEnd(testModules, unhandledErrors, reason);
	}

	/**
	 * We override `writeReport` to intercept the JSON string,
	 * inject our logs, and then call the parent's `writeReport`
	 * to handle file/stdout.
	 */
	async writeReport(report: string): Promise<void> {
		try {
			const result = JSON.parse(report);

			if (result.testResults) {
				// Iterate through each test file's results
				for (const testResult of result.testResults) {
					if (testResult.assertionResults) {
						// Iterate through each test assertion
						for (const assertion of testResult.assertionResults) {
							// Find the logs we stored for this test
							const logs = this.logsByFullName.get(assertion.fullName);
							if (logs && logs.length > 0) {
								if (!assertion.meta) {
									assertion.meta = {};
								}
								// Inject the logs
								assertion.meta.logs = logs;
							}
						}
					}
				}
			}

			// Add the global and suite-level logs
			result.globalLogs = this.globalLogs;

			// Re-stringify the modified report
			const modifiedReport = JSON.stringify(result, null, 2);

			// Call the *original* writeReport with the modified string
			await super.writeReport(modifiedReport);
		} catch (error) {
			console.error('Error in CustomJsonReporter writeReport:', error);
			// Fallback to writing the original report
			await super.writeReport(report);
		}
	}
}
