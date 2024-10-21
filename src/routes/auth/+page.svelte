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
		href="https://gitea.raltech.school/login/oauth/authorize?client_id=31455fa2-6090-453f-86d6-8e350c0d5f57&redirect_uri=http://localhost:5173/api/oauth/callback&response_type=code&scope=read:user"
	>
		Login with gitea
	</a>
</button>

{data.user ? `Login ${data.user.id} ${data.user.username}` : 'Not login'}

{#if data.user}
	<form
		class="bg-cover bg-[url('/3dcube.jpg')] text-secondary flex flex-col gap-4 pt-10 pb-6 w-[90%] md:w-96"
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
