import type { z } from 'zod';
import { NotificationSchema } from '../../../entities/Notification';

export const CreateNotificationDtoSchema = NotificationSchema.omit({ id: true });

export type CreateNotificationDto = z.infer<typeof CreateNotificationDtoSchema>;