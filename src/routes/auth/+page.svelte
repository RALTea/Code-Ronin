<script lang="ts">
	import type { PageServerData } from './$types';
	import { applyAction, enhance } from '$app/forms';


	export let data: PageServerData;
	export let form: any;

	const handleSubmit = (): any => {
		return async ({ result }: any) => {
			await applyAction(result);
		};
	};
</script>

<button>
	<a
		href={data.url}
	>
		Login with gitea
	</a>
</button>

{data.user ? `Login ${data.user.id} ${data.user.username}` : 'Not login'}

{#if data.user}
	<form
		enctype="multipart/form-data"
		method="POST"
		use:enhance={handleSubmit}
	>
		<input name="filename" value="index.js" />

		<button type="submit">Submit</button>
	</form>
{/if}

{#if form?.codeOutput}
	{#each form.codeOutput.data as line, i}
		<p>{line.message}</p>
	{/each}
{:else}
	<p>nothing here</p>
{/if}
