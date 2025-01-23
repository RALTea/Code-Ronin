import { progressionTransferService } from './ProgressionTransferService';
import { mockDeep } from 'vitest-mock-extended';
import type { ProgressionTransferRepository } from '../repositories/ProgressionTransferRepository';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ProgressionTransferService', () => {
  const mockRepository = mockDeep<ProgressionTransferRepository>();
  const service = progressionTransferService(mockRepository);
  
  beforeEach(() => {
    vi.resetAllMocks();
    mockRepository.getDemoCampaignWithTasksAndAttempts.mockResolvedValue({
      quests: [{
        id: 'demo-quest',
        tasks: [{
          id: 'demo-task',
          attempts: [{
            id: 'demo-attempt',
            userSolution: 'const x = 1',
            isSuccess: true,
            createdAt: new Date()
          }],
          duplicatesTask: { id: 'target-task' }
        }]
      }]
    });

    mockRepository.getTargetCampaignWithTasks.mockResolvedValue({
      quests: [{
        id: 'target-quest',
        tasks: [{
          id: 'target-task',
          attempts: [],
          duplicatesTask: null
        }]
      }]
    });
  });

  it('should transfer attempts when target task has no attempts', async () => {
    await service.transferProgression({ overwriteExisting: false }, 'user-id', 'campaign-id');
    
    expect(mockRepository.createAttempt).toHaveBeenCalledWith({
      userSolution: 'const x = 1',
      isSuccess: true,
      userId: 'user-id',
      taskId: 'target-task'
    });
  });

  it('should transfer attempts when overwriteExisting is true', async () => {
    mockRepository.getTargetCampaignWithTasks.mockResolvedValue({
      quests: [{
        id: 'target-quest',
        tasks: [{
          id: 'target-task',
          attempts: [{
            id: 'existing-attempt',
            userSolution: 'const y = 2',
            isSuccess: false,
            createdAt: new Date()
          }],
          duplicatesTask: null
        }]
      }]
    });

    await service.transferProgression({ overwriteExisting: true }, 'user-id', 'campaign-id');
    
    expect(mockRepository.deleteAttemptsForTask).toHaveBeenCalledWith('target-task', 'user-id');
    expect(mockRepository.createAttempt).toHaveBeenCalledWith({
      userSolution: 'const x = 1',
      isSuccess: true,
      userId: 'user-id',
      taskId: 'target-task'
    });
  });

  it('should not transfer attempts when target task has attempts and overwriteExisting is false', async () => {
    mockRepository.getTargetCampaignWithTasks.mockResolvedValue({
      quests: [{
        id: 'target-quest',
        tasks: [{
          id: 'target-task',
          attempts: [{
            id: 'existing-attempt',
            userSolution: 'const y = 2',
            isSuccess: false,
            createdAt: new Date()
          }],
          duplicatesTask: null
        }]
      }]
    });

    await service.transferProgression({ overwriteExisting: false }, 'user-id', 'campaign-id');
    
    expect(mockRepository.createAttempt).not.toHaveBeenCalled();
  });

  it('should not transfer attempts when no matching tasks found', async () => {
    mockRepository.getTargetCampaignWithTasks.mockResolvedValue({
      quests: [{
        id: 'target-quest',
        tasks: [{
          id: 'other-task',
          attempts: [],
          duplicatesTask: null
        }]
      }]
    });

    await service.transferProgression({ overwriteExisting: false }, 'user-id', 'campaign-id');
    
    expect(mockRepository.createAttempt).not.toHaveBeenCalled();
  });
});