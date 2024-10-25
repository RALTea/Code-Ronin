export const extractError = (error: unknown): string => {
	if (error instanceof Error) {
		return error.message;
	}
	return 'Unknown error';
};
