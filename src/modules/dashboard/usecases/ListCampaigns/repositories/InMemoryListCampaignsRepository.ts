import type { AttemptsByCampaign } from '../aggregates/AttemptByCampaign';
import type { CampaignCompletion } from '../aggregates/CampaignCompletion';
import type { CampaignInfos } from '../aggregates/CampaignInfos';
import * as IListCampaignsRepository from './IListCampaignsRepository';

type _InMemoryListCampaignsRepository = {
	getCompletionByCampaign: IListCampaignsRepository.GetCompletionByCampaign;
};

// Type for objects that have an id property
interface HasId {
  taskId: string;
  [key: string]: unknown;  // Allow any other properties
}

function deduplicateById<T extends HasId>(array: T[]): T[] {
  const seen = new Set<T['taskId']>();
  return array.filter(item => {
    if (seen.has(item.taskId)) {
      return false;
    }
    seen.add(item.taskId);
    return true;
  });
}


export const InMemoryListCampaignsRepository = (
	inMemoryData: AttemptsByCampaign[]
): _InMemoryListCampaignsRepository => {
	return {
		getCompletionByCampaign: async (
			joinedCampaigns: CampaignInfos[]
		): Promise<CampaignCompletion[]> => {
			return joinedCampaigns.map((joinedCampaign) => {
				const campaignName = joinedCampaign.name;
				const attempts = (
					inMemoryData.find((c) => c.campaignName === joinedCampaign.name)?.attempts ?? []
				).filter((a) => a.success); // Keep only successful attempts

				const completed = deduplicateById(attempts); // Deduplicate attempts by id
				return {
					campaignName,
					completion: Math.round((completed.length / joinedCampaign.nbOfTasks) * 100)
				};
			});
		}
	};
};
