<script lang="ts">
	import { UserStore } from '$auth/stores/UserStore.svelte';
	import type { AddCss } from '$lib/utils/svelte.utils';
	import { SignOut } from '@auth/sveltekit/components';
	import Progress from '../forms/Progress.svelte';
	import IconPower from '../icons/IconPower.svelte';
	import IconWrapper from '../icons/IconWrapper.svelte';
	import NavbarSkeleton from './NavbarSkeleton.svelte';
	import { NavbarVM } from './NavbarVM.svelte';
	import { page } from '$app/stores';

	type Props = AddCss;
	const { class: className }: Props = $props();

	const vm = new NavbarVM($page);
</script>

{#snippet divider()}
	<div class="h-full py-2 mx-6 hidden md:block">
		<div class="w-[.125rem] h-full bg-primary-light rounded-full"></div>
	</div>
{/snippet}

<nav
	class="h-20 bg-bg-dark rounded-lg m-4 shadow-[.0rem_.15rem_.2rem] shadow-lightless flex items-center px-4 py-2 {className}"
>
	{#await vm.apprenticeSummary}
		<NavbarSkeleton />
	{:then apprenticeSummary}
		<div class="w-4/5 h-full flex items-center">
			<div class="flex">
				<img
					src={apprenticeSummary?.avatar}
					alt="profile"
					class="object-cover w-12 h-12 mx-2 rounded-full"
				/>
				<div class="mx-2 hidden md:block">
					<h1 class="font-extrabold">{apprenticeSummary?.name}</h1>
					<p class="font-space-mono text-primary-light">{apprenticeSummary?.title}</p>
				</div>
			</div>
			{@render divider()}
			<div class="gap-4 hidden md:flex">
				{#each vm.medalsIndex as medal}
					{@const src = apprenticeSummary?.medals?.at(medal) ?? vm.emptyMedal}
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
	{/await}
</nav>
