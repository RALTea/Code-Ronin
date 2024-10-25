export const base64ToCode = (base64Code: string) => {
	return atob(base64Code);
};
