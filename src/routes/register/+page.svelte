<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	export let form: any;

	const handleSubmit = (): any => {
		return async ({ result }: any) => {
			await applyAction(result);
		};
	};
</script>


	<form
		enctype="multipart/form-data"
		method="POST"
		use:enhance={handleSubmit}
	>
		<input name="username" class="text-black" value="test" />
		<input name="email" class="text-black" value="test@gmail.com" />
		<input name="password" class="text-black" value="securepassword123" />

		<button type="submit">Submit</button>
	</form>
