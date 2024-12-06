<script lang="ts">
	import { SignIn } from '@auth/sveltekit/components';
	import { Github } from 'lucide-svelte';
</script>

<div class="flex gap-4 text-primary-light border-2 border-primary-light rounded-md px-4 py-2">
	<Github />
	<SignIn provider="github" signInPage="signin" />
</div>
