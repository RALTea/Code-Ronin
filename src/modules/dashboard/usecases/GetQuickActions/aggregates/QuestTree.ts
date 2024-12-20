import { z } from 'zod';
import { QuestTreeItemSchema } from './QuestTreeItem';

export const QuestTreeSchema = QuestTreeItemSchema.array().array();

export type QuestTree = z.infer<typeof QuestTreeSchema>;