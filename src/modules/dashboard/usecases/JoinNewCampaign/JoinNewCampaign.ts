import {
	UseCaseResponseBuilder,
	type InputFactory,
	type OutputFactory,
	type UseCase
} from '$lib/interfaces/UseCase';
import type { Campaign } from './aggregates/Campaign';
import * as IJoinNewCampaignRepository from './repositories/IJoinNewCampaignRepository';

type Input = InputFactory<
	{
		userId: string;
		accessKey: string;
	},
	{
		getCampaignByAccessKey: IJoinNewCampaignRepository.GetCampaignByAccessKey;
		hasUserJoinedCampaign: IJoinNewCampaignRepository.HasUserJoinedCampaign;
		joinCampaign: IJoinNewCampaignRepository.JoinCampaign;
		transferProgressionFromDemo: IJoinNewCampaignRepository.TransferProgressionFromDemo;
		getFirstQuestId: IJoinNewCampaignRepository.GetFirstQuestId;
		defaultRedirectUrl: string;
	}
>;

type Output = OutputFactory<{
	redirectUrl: string;
	joinedCampaign: Campaign;
}>;

export const JoinNewCampaignUseCase: UseCase<Input, Output> = (deps) => {
	const {
		getCampaignByAccessKey,
		hasUserJoinedCampaign,
		joinCampaign,
		transferProgressionFromDemo,
		defaultRedirectUrl
	} = deps;

	return {
		execute: async (input) => {
			const { userId, accessKey } = input;

			if (!userId) {
				return UseCaseResponseBuilder.error(401, 'User must be logged in');
			}

			const campaign = await getCampaignByAccessKey(accessKey);
			if (!campaign) {
				return UseCaseResponseBuilder.error(404, 'Invalid access key');
			}

			if (campaign.isDemo) {
				return UseCaseResponseBuilder.error(400, 'Cannot join a demo campaign');
			}

			const now = new Date();
			if (campaign.closeAt && campaign.closeAt < now) {
				return UseCaseResponseBuilder.error(400, 'Campaign is closed');
			}

			if (campaign.maxParticipants && campaign.currentParticipants >= campaign.maxParticipants) {
				return UseCaseResponseBuilder.error(400, 'Campaign is full');
			}

			const hasJoined = await hasUserJoinedCampaign(userId, campaign.id);
			if (hasJoined) {
				return UseCaseResponseBuilder.error(400, 'User has already joined this campaign');
			}

			await joinCampaign(userId, campaign.id);

			// Transfer progression from demo campaign if available
			await transferProgressionFromDemo(userId, campaign.id);

			const firstQuestId = await deps.getFirstQuestId(campaign.id);
			if (!firstQuestId) {
				return UseCaseResponseBuilder.success(200, {
					joinedCampaign: campaign,
					redirectUrl: defaultRedirectUrl,
				});
			}

			const redirectUrl = `/campaigns/${campaign.slug}/${firstQuestId}`;
			return UseCaseResponseBuilder.success(200, {
				joinedCampaign: campaign,
				redirectUrl
			});
		}
	};
};
