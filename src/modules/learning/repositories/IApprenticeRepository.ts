export type IApprenticeRepository = {
	fetchApprenticeSolution: (id: string) => Promise<string>;
}