import type { CreateQuestDto } from "../aggregates/CreateQuestDto";

export type CreateQuest = (data: CreateQuestDto) => Promise<void>;