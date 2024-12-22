import { z } from 'zod';
import { TreeItemSchema } from './TreeItem';

export const TreeSchema = TreeItemSchema.array().array();

export type Tree = z.infer<typeof TreeSchema>;