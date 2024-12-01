import type { QuestData } from '../aggregates/QuestData';

export type GetQuestData = (questId: string) => Promise<QuestData>;