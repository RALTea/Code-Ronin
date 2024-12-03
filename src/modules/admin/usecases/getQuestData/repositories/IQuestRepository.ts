import type { QuestData } from '../../../domain/QuestData';

export type GetQuestData = (questId: string) => Promise<QuestData>;