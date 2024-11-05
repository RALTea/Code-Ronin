<script lang="ts">
	import Card from '$lib/components/cards/Card.svelte';
	import { fade } from 'svelte/transition';

	type Props = {
		animate: boolean;
		animating: boolean;
	};
	let { animate = false, animating = $bindable(true) }: Props = $props();

	const onIntroStart = () => {
		console.debug('Skeleton - onIntroStart called');
		animating = true;
	};
	const onOutroEnd = () => {
		console.debug('Skeleton - onOutroEnd called');
		animating = false;
	};
</script>

<Card class={'p-4 h-full overflow-auto'}>
	<main
		class="opacity-50 text-transparent"
		transition:fade={{ duration: animate ? 150 : 0 }}
		onintrostart={onIntroStart}
		onoutroend={onOutroEnd}
	>
		<div class="animate-pulse">
			<!-- Title -->
			<h1 class="bg-primary-light text-transparent w-2/3">.</h1>
			<!-- Rewards -->
			<p class="bg-lightless text-transparent w-1/3">.</p>
			<p class="bg-lightless text-transparent">.</p>
			<p class="bg-lightless text-transparent">.</p>
			<p class="bg-lightless text-transparent w-2/3">.</p>
			<!-- Instructions -->
			<p class="bg-lightless text-transparent w-1/2 mt-8">.</p>
			<p class="bg-lightless text-transparent">.</p>
			<p class="bg-lightless text-transparent">.</p>
			<p class="bg-lightless text-transparent">.</p>
			<p class="bg-lightless text-transparent w-4/5">.</p>
			<!-- Hint -->
			<p class="bg-lightless text-transparent w-1/2 mt-8">.</p>
			<p class="bg-lightless text-transparent">.</p>
			<p class="bg-lightless text-transparent">.</p>
			<p class="bg-lightless text-transparent w-4/5">.</p>
		</div>
	</main>
</Card>
