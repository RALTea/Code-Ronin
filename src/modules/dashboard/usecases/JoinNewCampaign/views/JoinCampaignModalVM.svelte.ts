import type { TRPCClientInit } from 'trpc-sveltekit';
import { JoinNewCampaignUseCase } from '../JoinNewCampaign';
import { trpc } from '$lib/clients/trpc';
import { TRPCJoinNewCampaignRepository } from '../repositories/TRPCJoinNewCampaignRepository';
import type { Campaign } from '../aggregates/Campaign';

type Callbacks = {
	onSuccess?: (data: { campaign: Campaign, redirectUrl: string, transferStatus: { success: boolean; error?: string; } }) => void;
	onFail?: (message: string) => void;
	onCancel?: () => void;
}

export class JoinCampaignModalVM {
	#context: TRPCClientInit | undefined;
	#trpcRepository;
	#usecase;
	#callbacks: Callbacks | undefined;

	constructor(init?: TRPCClientInit, callbacks?: Callbacks) {
		this.#context = init;
		this.#trpcRepository = TRPCJoinNewCampaignRepository(init);
		this.#usecase = JoinNewCampaignUseCase({
			...this.#trpcRepository,
			hasUserJoinedCampaign: this.#trpcRepository.hasUserJoinedCampaign,
			joinCampaign: this.#trpcRepository.joinCampaign,
			transferProgressionFromDemo: this.#trpcRepository.transferProgressionFromDemo,
			defaultRedirectUrl: '/dashboard'
		});
		this.#callbacks = callbacks;
	}

	async onJoin(accessKey: string) {
		const me = await trpc(this.#context).auth.me.query();
		const ucResult = await this.#usecase.execute({ accessKey, userId: me?.id });
		if (ucResult.isSuccess) {
			return this.#callbacks?.onSuccess?.({
				campaign: ucResult.data.joinedCampaign,
				redirectUrl: ucResult.data.redirectUrl,
				transferStatus: ucResult.data.transferStatus
			});
		};

		// If failed
		return this.#callbacks?.onFail?.(ucResult.message);
	}
}