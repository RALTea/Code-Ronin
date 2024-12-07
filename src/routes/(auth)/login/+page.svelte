<script lang="ts">
	import { SignIn } from '@auth/sveltekit/components';
	import { Github } from 'lucide-svelte';
</script>

<div class="[&_button]:flex [&_button]:gap-4 [&_button]:w-full text-primary-light border-2 border-primary-light rounded-md">
	<SignIn provider="github" signInPage="signin">
		<div slot="submitButton" class="px-4 py-2 flex gap-4">
			<Github />
			Sign in with GitHub
		</div>
	</SignIn>
</div>
