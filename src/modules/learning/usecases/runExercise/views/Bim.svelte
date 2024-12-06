<script lang="ts">
	import { reversedraw } from '$lib/components/animations/ReverseDraw';
	import PrimaryButton from '$lib/components/buttons/PrimaryButton.svelte';
	import IconArrowRight from '$lib/components/icons/IconArrowRight.svelte';
	import IconWrapper from '$lib/components/icons/IconWrapper.svelte';
	import { expoIn } from 'svelte/easing';
	import { fade, fly, scale } from 'svelte/transition';

	const apparitionTime = 500;
	const interval = 300;

	type Props = {
		onContinue: () => void;
    onOutroEnd: () => void;
	};
	let { onContinue, onOutroEnd }: Props = $props();
</script>

<!-- Wrapper -->
<div class="fixed top-0 left-0 h-screen w-screen z-50">
		<div
			in:scale={{ duration: apparitionTime, start: 0, easing: expoIn, opacity: 1 }}
			out:fade={{ duration: apparitionTime, easing: expoIn}}
      onoutroend={onOutroEnd}
			class="bg-bg-dark bg-opacity-80 blur-lg shadow-lg absolute h-[200vh] w-[200vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
		></div>
		<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">
			<IconWrapper size="24" className="flex justify-center">
				<!-- <IconCheck /> -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="feather feather-check stroke-primary-light"
				>
					<polyline
						in:reversedraw={{ delay: apparitionTime + interval, duration: 300 }}
            out:fade={{ duration: 300, delay: 0 }}
						points="20 6 9 17 4 12"
					></polyline>
				</svg>
			</IconWrapper>
			<p
				in:fly={{ duration: 300, delay: apparitionTime + interval * 2, y: -25 }}
        out:fade={{ duration: 300, delay: 0 }}
				class="font-black text-3xl tracking-wider text-center"
			>
				SUCCESS
			</p>
			<div 
      in:fly={{ duration: 300, delay: apparitionTime + interval * 3, y: -25 }}
      out:fade={{ duration: 300, delay: 0}}
      >
				<PrimaryButton
					onclick={onContinue}
					class="px-12 py-2 m-auto mt-6 flex gap-2 items-center hover:scale-105 duration-200 [&_svg]:hover:translate-x-1 [&_svg]:duration-200"
				>
					Continue
					<IconArrowRight />
				</PrimaryButton>
			</div>
		</div>
</div>
