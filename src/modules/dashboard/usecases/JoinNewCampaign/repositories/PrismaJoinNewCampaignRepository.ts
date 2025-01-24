import type { PrismaClient } from '@prisma/client';
import type { ProgressionTransferRepository } from '../../../domain/repositories/ProgressionTransferRepository';
import { progressionTransferService } from '../../../domain/services/ProgressionTransferService';
import type * as IJoinNewCampaignRepository from './IJoinNewCampaignRepository';

type _PrismaJoinNewCampaignRepository = {
  getCampaignByAccessKey: IJoinNewCampaignRepository.GetCampaignByAccessKey;
  hasUserJoinedCampaign: IJoinNewCampaignRepository.HasUserJoinedCampaign;
  joinCampaign: IJoinNewCampaignRepository.JoinCampaign;
  transferProgressionFromDemo: (
    options: { overwriteExisting: boolean }
  ) => (userId: string, campaignId: string) => Promise<boolean>;
  getFirstQuestId: IJoinNewCampaignRepository.GetFirstQuestId;
};

const createPrismaProgressionTransferRepository = (prisma: PrismaClient): ProgressionTransferRepository => ({
  async getDemoCampaignWithTasksAndAttempts(userId: string) {
    const result = await prisma.campaign.findFirst({
      where: { isDemo: true },
      include: {
        quests: {
          include: {
            tasks: {
              select: {
                id: true,
                attempts: {
                  where: {
                    apprenticeId: userId,
                    isSuccess: true
                  },
                  select: {
                    id: true,
                    userSolution: true,
                    isSuccess: true,
                    createdAt: true
                  }
                },
                duplicatesTask: {
                  select: {
                    id: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!result) return null;

    return {
      quests: result.quests.map(quest => ({
        tasks: quest.tasks.map(task => ({
          id: task.id,
          attempts: task.attempts,
          duplicatesTask: task.duplicatesTask
        }))
      }))
    };
  },

  async getTargetCampaignWithTasks(campaignId: string, userId: string) {
    return prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        quests: {
          include: {
            tasks: {
              include: {
                duplicatesTask: true,
                attempts: {
                  where: {
                    apprenticeId: userId
                  }
                }
              }
            }
          }
        }
      }
    });
  },

  async deleteAttemptsForTask(taskId: string, userId: string) {
    await prisma.attempt.deleteMany({
      where: {
        taskId,
        apprenticeId: userId
      }
    });
  },

  async createAttempt(attempt: {
    userSolution: string;
    isSuccess: boolean;
    userId: string;
    taskId: string;
  }) {
    await prisma.attempt.create({
      data: {
        userSolution: attempt.userSolution,
        isSuccess: attempt.isSuccess,
        apprentice: {
          connect: { id: attempt.userId }
        },
        tasks: {
          connect: { id: attempt.taskId }
        }
      }
    });
  }
});

export const PrismaJoinNewCampaignRepository = (
  prisma: PrismaClient
): _PrismaJoinNewCampaignRepository => {
  const progressionTransferRepository = createPrismaProgressionTransferRepository(prisma);
  const transferService = progressionTransferService(progressionTransferRepository);

  return {
    getCampaignByAccessKey: async (accessKey: string) => {
      const campaign = await prisma.campaign.findFirst({
        where: {
          accessKeys: {
            some: { key: accessKey }
          }
        },
        include: {
          apprentices: true
        }
      });

      if (!campaign) return null;

      return {
        id: campaign.id,
        name: campaign.name,
        slug: campaign.slug,
        isDemo: campaign.isDemo,
        closeAt: campaign.closeAt,
        maxParticipants: campaign.maxParticipants ?? Infinity,
        currentParticipants: campaign.apprentices.length
      };
    },

    hasUserJoinedCampaign: async (userId: string, campaignId: string) => {
      const count = await prisma.campaign.count({
        where: {
          id: campaignId,
          apprentices: {
            some: { id: userId }
          }
        }
      });
      return count > 0;
    },

    joinCampaign: async (userId: string, campaignId: string) => {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          apprentices: {
            connect: { id: userId }
          }
        }
      });
    },

    transferProgressionFromDemo: (options: { overwriteExisting: boolean }) => {
      return async (userId: string, campaignId: string) => {
        return await transferService.transferProgression(options, userId, campaignId);
      };
    },

    getFirstQuestId: async (campaignId: string) => {
      const firstQuest = await prisma.quest.findFirst({
        where: {
          campaignId,
          previousQuests: {
            none: {}
          }
        },
        select: {
          id: true
        }
      });
      
      return firstQuest?.id ?? null;
    }
  };
};
