<script lang="ts">
	import PrimaryButton from '$lib/components/buttons/PrimaryButton.svelte';

	export let data;
</script>

<PrimaryButton type="submit" className="w-[95%] mx-auto font-bold">
	<a href={data.url}> Login with gitea</a>
</PrimaryButton>
