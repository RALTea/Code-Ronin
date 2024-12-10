export function isExpired(dateString?: string): boolean {
	if (!dateString) return true;
	
	const providedDate = new Date(dateString);
	const now = new Date();

	// Check if the provided date is a valid date
	if (isNaN(providedDate.getTime())) return true;

	return providedDate < now;
}
