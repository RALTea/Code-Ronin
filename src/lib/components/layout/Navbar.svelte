<script lang="ts">
	import type { ApprenticeProfileSummary } from '$learning/aggregates/ApprenticeProfileSummary';
	import { getApprenticeProfileSummary } from '$learning/usecases/getApprenticeProfileSummary';
	import type { AddCss } from '$lib/utils/svelte.utils';
	import { onMount } from 'svelte';
	import Progress from '../forms/Progress.svelte';
	import IconPower from '../icons/IconPower.svelte';
	import IconWrapper from '../icons/IconWrapper.svelte';

	type Props = AddCss;
	let apprenticeSummary: ApprenticeProfileSummary | null = $state(null);
	const medalsIndex = [0, 1, 2];
	const emptyMedal = '/medals/Item=default.png';
	const defaultApprenticeSummary: ApprenticeProfileSummary = {
		name: 'Anonymous',
		title: 'Developer'
	};
	const fetchDataUsecase = getApprenticeProfileSummary({
		fetchApprenticeProfileSummary: async () => {
			return {
				name: 'Robin TOURNÉ',
				title: 'Apprentice',
				avatar: '/default-pfp2.webp',
				medals: ['/medals/Item=svelte.png', '/medals/Item=docker.png']
			};
		}
	});
	const { class: className }: Props = $props();

	onMount(() => {
		fetchDataUsecase
			.execute({ apprenticeId: '1' })
			.then((result) => {
				if (result.isSuccess) return (apprenticeSummary = result.data);
				apprenticeSummary = defaultApprenticeSummary;
			})
			.catch((err) => {
				console.error(err);
				apprenticeSummary = defaultApprenticeSummary;
			});
	});
</script>

{#snippet divider()}
	<div class="h-full py-2 mx-6">
		<div class="w-[.125rem] h-full bg-primary-light rounded-full"></div>
	</div>
{/snippet}

<nav
	class="h-20 bg-bg-dark rounded-lg m-4 shadow-[.0rem_.15rem_.2rem] shadow-lightless flex items-center px-4 py-2 {className}"
>
	<div class="w-4/5 h-full flex items-center">
		<div class="flex">
			<img
				src={apprenticeSummary?.avatar}
				alt="profile"
				class="object-cover w-12 h-12 mx-2 rounded-full"
			/>
			<div class="mx-2">
				<h1 class="font-extrabold">{apprenticeSummary?.name}</h1>
				<p class="font-space-mono text-primary-light">{apprenticeSummary?.title}</p>
			</div>
		</div>
		{@render divider()}
		<div class="flex gap-4">
			{#each medalsIndex as medal}
				{@const src = apprenticeSummary?.medals?.at(medal) ?? emptyMedal}
				<div class="shine">
					<img {src} alt="medal" class="w-10 h-10 relative" />
				</div>
			{/each}
		</div>
		{@render divider()}
		<div class="flex  flex-1 h-full items-center">
			<div class="flex flex-col flex-1">
				<p class="font-space-mono text-primary-light">Experience</p>
				<div class="flex gap-4">
					<div class="h-2 w-full flex items-center my-auto">
						<Progress value={70} max={100} />
					</div>
					<div class="row-span-2 content-end">70/100</div>
				</div>
			</div>
		</div>
	</div>

	<div class="flex items-center justify-center h-full mr-2 ml-auto">
		{@render divider()}
		<button>
			<IconWrapper size="8">
				<IconPower />
			</IconWrapper>
		</button>
	</div>
</nav>
