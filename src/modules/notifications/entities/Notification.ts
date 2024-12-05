import { z } from 'zod';
import { NotificationTypeSchema } from './NotificationType';

export const NotificationSchema = z.object({
	id: z.string().uuid(),
	type: NotificationTypeSchema,
	message: z.string()
});

export type Notification = z.infer<typeof NotificationSchema>;
