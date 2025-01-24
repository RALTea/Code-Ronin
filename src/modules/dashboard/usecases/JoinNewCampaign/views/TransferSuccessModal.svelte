<script lang="ts">
	import { TransferModalStore } from '$dashboard/usecases/JoinNewCampaign/stores/TransferModalStore.svelte';
	import PrimaryButton from '$lib/components/buttons/PrimaryButton.svelte';
	import { clickOutside } from '$lib/directives/clickOutside';

	const closeModal = () => {
		TransferModalStore.close();
	};
</script>

{#if TransferModalStore.isOpen}
	<!-- Backdrop -->
	<div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
		<!-- Modal -->
		<div class="fixed inset-0 flex items-center justify-center p-4">
			<div
				class="bg-bg-light rounded-lg shadow-lg p-6 max-w-lg w-full"
				use:clickOutside
				onclickOutside={closeModal}
			>
				<h2 class="text-4xl font-bold font-space-mono">Progress Transferred</h2>
				<p class="text-zinc-300 mb-6">
					{TransferModalStore.message || 'Your progress has been successfully transferred.'}
				</p>

				<PrimaryButton class="px-4 py-1 w-fit mt-8 float-end" type={{ onclick: closeModal }}>Continue</PrimaryButton>
			</div>
		</div>
	</div>
{/if}

<style>
	.backdrop-blur-sm {
		backdrop-filter: blur(4px);
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.animate-spin {
		animation: spin 1s linear infinite;
	}
</style>
