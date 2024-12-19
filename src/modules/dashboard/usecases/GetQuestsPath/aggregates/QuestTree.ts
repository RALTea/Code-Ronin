import { z } from 'zod';
import { QuestTreeItem } from './QuestTreeItem';

export const QuestTreeSchema = QuestTreeItem.array().array();

export type QuestTree = z.infer<typeof QuestTreeSchema>;
