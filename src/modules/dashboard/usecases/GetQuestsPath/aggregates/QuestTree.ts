import { z } from 'zod';
import { QuestSchema } from './Quest';

export const QuestTreeSchema = QuestSchema.array().array();

export type QuestTree = z.infer<typeof QuestTreeSchema>;
