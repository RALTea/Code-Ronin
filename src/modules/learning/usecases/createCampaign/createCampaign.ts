import { UseCaseResponseBuilder, type InputFactory, type OutputFactory, type UseCase } from '$lib/interfaces/UseCase';
import type { CreateCampaignDto } from './aggregates/CreateCampaignDto';
import * as ICampaignRepository from './repositories/ICampaignRepository';

type Input = InputFactory<
	{ data: CreateCampaignDto },
	{
		createCampaign: ICampaignRepository.CreateCampaign;
	}
>

type Output = OutputFactory<void>;

export const createCampaign: UseCase<Input, Output> = (dependencies) => {
	const { createCampaign } = dependencies;
	return {
		execute: async (data) => {
			const { data: campaignData } = data;
			await createCampaign(campaignData);
			return UseCaseResponseBuilder.success(201, void 0);
		}
	};
};