import type { CreateNotificationDto } from '$notifications/usecases/SendNotification/aggregates/CreateNotificationDto';

export type ParseRawData<T> = (data: T) => CreateNotificationDto[]