<script lang="ts">
	import Loading from '$lib/components/layout/Loading.svelte';

	let isLoading = false;
</script>

{#if isLoading}
	<Loading absolute />
{/if}

<div class="flex justify-center items-center h-screen flex-col gap-6 bg-bg-dark">
	<h1 class="text-3xl text-secondary text-center font-poppins-bold">Code ronin</h1>
	<div class="p-8 bg-bg-medium rounded-lg w-full md:w-1/2 mx-8 shadow-lg">
		<slot />
	</div>
</div>
