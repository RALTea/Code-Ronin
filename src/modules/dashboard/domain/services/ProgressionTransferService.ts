import type { ProgressionTransferRepository } from '../repositories/ProgressionTransferRepository';

export const progressionTransferService = (repository: ProgressionTransferRepository) => ({
  async transferProgression(options: { overwriteExisting: boolean }, userId: string, campaignId: string): Promise<boolean> {
    let transferredAny = false;

    // Get demo campaign tasks and their attempts
    const demoCampaign = await repository.getDemoCampaignWithTasksAndAttempts(userId);
    if (!demoCampaign) return false;

    // Get target campaign tasks
    const targetCampaign = await repository.getTargetCampaignWithTasks(campaignId, userId);
    if (!targetCampaign) return false;

    // Transfer progression
    for (const demoQuest of demoCampaign.quests) {
      for (const demoTask of demoQuest.tasks) {
        if (demoTask.attempts.length === 0) continue;

        const duplicatingTasks = targetCampaign.quests
          .flatMap((q) => q.tasks)
          .filter((t) => t.id === demoTask.duplicatesTask?.id);

        if (duplicatingTasks.length === 0) {
          continue;
        }

        for (const task of duplicatingTasks) {
          if (options.overwriteExisting || task.attempts.length === 0) {
            const latestDemoAttempt = demoTask.attempts.sort(
              (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
            )[0];

            if (options.overwriteExisting) {
              if (task.attempts.length > 0) {
                await repository.deleteAttemptsForTask(task.id, userId);
              }
              await repository.createAttempt({
                userSolution: latestDemoAttempt.userSolution,
                isSuccess: true,
                userId,
                taskId: task.id
              });
              transferredAny = true;
            } else if (task.attempts.length === 0) {
              await repository.createAttempt({
                userSolution: latestDemoAttempt.userSolution,
                isSuccess: true,
                userId,
                taskId: task.id
              });
              transferredAny = true;
            }
          }
        }
      }
    }

    return transferredAny;
  }
});