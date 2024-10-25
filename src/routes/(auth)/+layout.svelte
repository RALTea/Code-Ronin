<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { LayoutServerData } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Loading from '$lib/components/layout/Loading.svelte';

	let isLoading = false;
	export let data: LayoutServerData;
	const handleSubmit: SubmitFunction = () => {
		isLoading = true;
		return async ({ result }) => {
			await applyAction(result);
			isLoading = false;
		};
	};
</script>

{#if isLoading}
	<Loading absolute />
{/if}

<div class="flex justify-center items-center h-screen flex-col gap-6 bg-bg-dark">
	<h1 class="text-3xl text-secondary text-center font-poppins-bold">Code ronin</h1>
	<div class="p-8 bg-bg-medium rounded-lg w-11/12 sm:w-4/12 shadow-lg">
		<form
			action={`?/${data.title}`}
			method="POST"
			use:enhance={handleSubmit}
			class="flex-col flex relative"
		>
			<slot />
		</form>
	</div>
	{#if data.title === 'register'}
		<span class="text-secondary flex gap-2"
			>Have an account ?
			<a class="text-primary-dark font-poppins-bold font-bold" href="/login">
				Login with gitea !
			</a>
		</span>
	{/if}
	{#if data.title === 'login'}
		<span class="text-secondary flex gap-2"
			>Don't have an account ?
			<a class="text-primary-dark font-poppins-bold font-bold" href="/register"> Register now ! </a>
		</span>
	{/if}
</div>
