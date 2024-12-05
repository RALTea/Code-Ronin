import { z } from 'zod';

export const NotificationTypeSchema = z.enum([
	'INFO',
	'WARNING',
	'ERROR',
]);

export type NotificationType = z.infer<typeof NotificationTypeSchema>;