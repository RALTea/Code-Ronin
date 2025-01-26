import { trpc } from '$lib/clients/trpc';
import type { TRPCClientInit } from 'trpc-sveltekit';
import * as IJoinNewCampaignRepository from './IJoinNewCampaignRepository';

type _TRPCJoinNewCampaignRepository = {
	getCampaignByAccessKey: IJoinNewCampaignRepository.GetCampaignByAccessKey;
	hasUserJoinedCampaign: IJoinNewCampaignRepository.HasUserJoinedCampaign;
	joinCampaign: IJoinNewCampaignRepository.JoinCampaign;
	transferProgressionFromDemo: IJoinNewCampaignRepository.TransferProgressionFromDemo;
	getAccessKeyDetails: IJoinNewCampaignRepository.GetAccessKeyDetails;
	getFirstQuestId: IJoinNewCampaignRepository.GetFirstQuestId;
};

export const TRPCJoinNewCampaignRepository = (init?: TRPCClientInit): _TRPCJoinNewCampaignRepository => {
	return {
		getCampaignByAccessKey: (accessKey: string) => {
			return trpc(init).dashboard.joinNewCampaign.getCampaignByAccessKey.query({ accessKey });
		},
		hasUserJoinedCampaign: (userId: string, campaignId: string) => {
			return trpc(init).dashboard.joinNewCampaign.hasUserJoinedCampaign.query({ userId, campaignId });
		},
		joinCampaign: (userId: string, campaignId: string, accessKey: string) => {
			return trpc(init).dashboard.joinNewCampaign.joinCampaign.mutate({ userId, campaignId, accessKey });
		},
		transferProgressionFromDemo: (userId: string, campaignId: string) => {
			return trpc(init).dashboard.joinNewCampaign.transferProgressionFromDemo.mutate({ userId, campaignId });
		},
		getAccessKeyDetails: (accessKey: string) => {
			return trpc(init).dashboard.joinNewCampaign.getAccessKeyDetails.query({ accessKey });
		},
		getFirstQuestId: (campaignId: string) => {
			return trpc(init).dashboard.joinNewCampaign.getFirstQuestId.query({ campaignId });
		}
	}
};
