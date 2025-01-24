<script lang="ts">
	import { page } from '$app/stores';
	import { UserStore } from '$auth/stores/UserStore.svelte';
	import PrimaryButton from '$lib/components/buttons/PrimaryButton.svelte';
	import Input from '$lib/components/forms/Input.svelte';
	import { ArrowRight } from 'lucide-svelte';
	import type { Campaign } from '../aggregates/Campaign';
	import { TransferModalStore } from '../stores/TransferModalStore.svelte';
	import { JoinCampaignModalVM } from './JoinCampaignModalVM.svelte';
	import { clickOutside } from '$lib/directives/clickOutside';

	type Props = {
		onSuccess?: (data: {
			campaign: Campaign;
			redirectUrl: string;
			transferStatus: {
				success: boolean;
				error?: string;
			};
		}) => void;
		onFail?: (message: string) => void;
		onCancel?: () => void;
	};
	const { onSuccess, onFail, onCancel }: Props = $props();
	const vm = new JoinCampaignModalVM($page, {
		onSuccess: (data: {
			campaign: Campaign;
			redirectUrl: string;
			transferStatus: {
				success: boolean;
				error?: string;
			};
		}) => {
			onSuccess?.(data);
		},
		onFail: (message) => {
			onFail?.(message);
		},
		onCancel
	});
	let accessKey: string = $state('');
	let isUserLoggedIn = $state(!!UserStore.user);
</script>

<!-- Backdrop -->
<div
	class="h-screen w-screen bg-bg-dark/80 flex items-center justify-center fixed top-0 left-0 z-30"
>
	<!-- Modal -->
	<div class="bg-bg-medium p-8 rounded-lg space-y-8 min-w-[50%] max-w-80 flex flex-col" use:clickOutside onclickOutside={() => onCancel?.()}>
		{#if isUserLoggedIn}
			<header>
				<h1 class="text-4xl font-bold font-space-mono">Join a campaign</h1>
				<p class="text-zinc-400 mt-2 italic">Get an access key by joining RALTech School or through a campus partner</p>
			</header>
			<form class="flex gap-4 [$>div>label]:font-medium">
				<Input
					label="Enter your access key"
					name="accessKey"
					oninput={(val) => (accessKey = val)}
				/>
				<PrimaryButton
					class="h-10 mt-6 px-4"
					type={{
						buttonType: 'button',
						onclick: () => vm.onJoin(accessKey)
					}}
				>
					Join
				</PrimaryButton>
			</form>
		{:else}
			<h1 class="text-4xl font-bold font-space-mono">Please login to join a campaign</h1>
			<PrimaryButton type={{ href: '/login' }} class="px-4 py-1 w-fit flex gap-2 items-center">
				Login
				<ArrowRight size="16" />
			</PrimaryButton>
		{/if}
	</div>
</div>
