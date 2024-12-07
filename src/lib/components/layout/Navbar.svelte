<script lang="ts">
	import { page } from '$app/stores';
	import { UserStore } from '$auth/stores/UserStore.svelte';
	import type { ApprenticeProfileSummary } from '$learning/usecases/getApprenticeProfileSummary/aggregates/ApprenticeProfileSummary';
	import { getApprenticeProfileSummary } from '$learning/usecases/getApprenticeProfileSummary/getApprenticeProfileSummary';
	import { LastRun } from '$learning/usecases/runExercise/stores/LastRun.svelte';
	import { trpc } from '$lib/clients/trpc';
	import type { AddCss } from '$lib/utils/svelte.utils';
	import { SignOut } from '@auth/sveltekit/components';
	import Progress from '../forms/Progress.svelte';
	import IconPower from '../icons/IconPower.svelte';
	import IconWrapper from '../icons/IconWrapper.svelte';
	import NavbarSkeleton from './NavbarSkeleton.svelte';
	import { SendNotificationUseCase } from '$notifications/usecases/SendNotification/SendNotification';
	import { NotificationStack } from '$notifications/stores/NotificationStack.svelte';

	type Props = AddCss;
	const medalsIndex = [0, 1, 2];
	const emptyMedal = '/medals/Item=default.png';
	const defaultApprenticeSummary: ApprenticeProfileSummary = {
		name: 'Anonymous',
		title: 'Developer',
		avatar: '/default-pfp.png',
		exp: 0
	};
	const fetchDataUsecase = $derived.by(() => {
		UserStore.user;
		return getApprenticeProfileSummary({
			fetchApprenticeInfos: async () => {
				return trpc($page)
					.learning.getApprenticeProfileSummary.getApprenticeInfos.query({
						apprenticeId: UserStore.user?.id ?? '-1'
					})
					.catch(() => defaultApprenticeSummary);
			},
			fetchApprenticeExp: async () => {
				return trpc($page)
					.learning.getApprenticeProfileSummary.getApprenticeExp.query({
						apprenticeId: UserStore.user?.id ?? '-1'
					})
					.catch(() => 0);
			}
		});
	});
	const { class: className }: Props = $props();
	let apprenticeId = $derived(UserStore.user?.id ?? '-1');

	let apprenticeSummary: ApprenticeProfileSummary | undefined = $state(undefined);

	const fetchApprenticeSummary = () => {
		console.debug('fetchApprenticeSummary', apprenticeId);
		if (apprenticeId === '-1') return (apprenticeSummary = defaultApprenticeSummary);
		fetchDataUsecase
			.execute({ apprenticeId: apprenticeId })
			.then((result) => {
				console.debug('fetchApprenticeSummary result', result);
				if (apprenticeSummary && apprenticeSummary !== defaultApprenticeSummary) return;
				if (result.isSuccess) return (apprenticeSummary = result.data);
				return (apprenticeSummary = defaultApprenticeSummary);
			})
			.catch((err) => {
				console.error(err);
				SendNotificationUseCase({
					addToStack: NotificationStack.addToStack
				}).execute({
					dto: {
						message: 'Failed to fetch apprentice summary',
						type: 'ERROR'
					}
				});
				return (apprenticeSummary = defaultApprenticeSummary);
			});
	};

	$effect(() => {
		LastRun.time;
		UserStore.user;
		fetchApprenticeSummary();
	});
	$inspect('Apprentice Summary', apprenticeSummary);
</script>

{#snippet divider()}
	<div class="h-full py-2 mx-6">
		<div class="w-[.125rem] h-full bg-primary-light rounded-full"></div>
	</div>
{/snippet}

<nav
	class="h-20 bg-bg-dark rounded-lg m-4 shadow-[.0rem_.15rem_.2rem] shadow-lightless flex items-center px-4 py-2 {className}"
>
	{#if apprenticeSummary}
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
			<div class="flex flex-1 h-full items-center">
				<div class="flex flex-col flex-1">
					<p class="font-space-mono text-primary-light">Experience</p>
					<div class="flex gap-4">
						<div class="h-2 w-full flex items-center my-auto">
							<Progress value={apprenticeSummary?.exp ?? 0} max={100} />
						</div>
						<div class="row-span-2 content-end">
							{apprenticeSummary?.exp}/100
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="flex items-center justify-center h-full mr-2 ml-auto">
			{@render divider()}
			{#if UserStore.user}
				<SignOut className={'flex items-center [&_button]:h-fit'}>
					<!-- <button slot="submitButton"> -->
					<svelte:fragment slot="submitButton">
						<IconWrapper size="8">
							<IconPower />
						</IconWrapper>
					</svelte:fragment>
					<!-- </button> -->
				</SignOut>
			{:else}
				<a href="/login">
					<IconWrapper size="8">
						<IconPower />
					</IconWrapper>
				</a>
			{/if}
		</div>
	{:else}
		<NavbarSkeleton />
	{/if}
</nav>
