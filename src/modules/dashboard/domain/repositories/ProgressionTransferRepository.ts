export interface ProgressionTransferRepository {
  getDemoCampaignWithTasksAndAttempts(userId: string): Promise<{
    quests: Array<{
      tasks: Array<{
        id: string;
        attempts: Array<{
          id: string;
          userSolution: string;
          isSuccess: boolean;
          createdAt: Date;
        }>;
        duplicatesTask: { id: string } | null;
      }>;
    }>;
  } | null>;

  getTargetCampaignWithTasks(campaignId: string, userId: string): Promise<{
    quests: Array<{
      tasks: Array<{
        id: string;
        attempts: Array<{
          id: string;
        }>;
        duplicatesTask: { id: string } | null;
      }>;
    }>;
  } | null>;

  deleteAttemptsForTask(taskId: string, userId: string): Promise<void>;

  createAttempt(attempt: {
    userSolution: string;
    isSuccess: boolean;
    userId: string;
    taskId: string;
  }): Promise<void>;
}