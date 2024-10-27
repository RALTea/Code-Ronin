export type AddCss = {
	class?: string;
}

export const hideEffect = (fn: () => unknown) => {
	setTimeout(fn, 0);
}