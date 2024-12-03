import { ValidationDataSchema } from '$admin/domain/ValidationData';
import { z } from 'zod';

export const UpdateValidationDtoSchema = z.object({
	taskId: z.string().uuid(),
}).merge(ValidationDataSchema);

export type UpdateValidationDto = z.infer<typeof UpdateValidationDtoSchema>;