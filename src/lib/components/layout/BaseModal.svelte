<script lang="ts">
	import { clickOutside } from '$lib/directives/clickOutside';
	import type { Snippet } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	type Props = {
		title: string;
		onClose: () => void;
		showCloseButton: boolean;
		isOpen: boolean;
		children: Snippet;
		animate?: boolean;
	};
	let {
		title = '',
		onClose = () => {},
		showCloseButton = true,
		isOpen = false,
		animate = false,
		children
	}: Props = $props();

	function handleClose() {
		onClose();
		isOpen = false;
	}
</script>

{#if isOpen}
	<!-- Backdrop -->
	<div
		transition:fade={{ duration: animate ? 200 : 0 }}
		class="fixed inset-0 bg-black/50 backdrop-blur-md z-30"
	>
		<!-- Modal -->
		<div
			class="fixed inset-0 flex items-center justify-center p-4"
			transition:fly={{ duration: animate ? 200 : 0, y: 25 }}
		>
			<div
				use:clickOutside
				onclickOutside={handleClose}
				class="bg-bg-light rounded-lg shadow-lg p-6 max-w-lg w-full"
			>
				<header class="mb-6">
					<h2 class="text-4xl font-bold font-space-mono">{title}</h2>
				</header>

				{@render children()}

				{#if showCloseButton}
					<div class="mt-6 flex justify-end">
						<button
							class="px-4 py-2 rounded bg-bg-medium hover:bg-bg-dark transition-colors"
							onclick={handleClose}
						>
							Close
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
