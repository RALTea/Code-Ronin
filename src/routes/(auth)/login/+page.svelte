<script lang="ts">
	import Discord from '$lib/components/icons/Discord.svelte';
	import IconWrapper from '$lib/components/icons/IconWrapper.svelte';
	import { SignIn } from '@auth/sveltekit/components';

	import { Github,  } from 'lucide-svelte';
</script>

<div
	class="[&_button]:flex [&_button]:gap-4 [&_button]:w-full text-primary-light border-2 border-primary-light rounded-md"
>
	<SignIn provider="github" signInPage="signin" options={{ redirect: true, redirectTo: '/dashboard' }}>
		<div slot="submitButton" class="px-4 py-2 flex gap-4">
			<Github />
			Sign in with GitHub
		</div>
	</SignIn>
	<SignIn provider="discord" signInPage="signin" options={{ redirect: true, redirectTo: '/dashboard' }}>
		<div slot="submitButton" class="px-4 py-2 flex gap-4">
			<IconWrapper size="6" className="[&_svg]:fill-primary-light [&_svg]:max-h-6 [&_svg]:max-w-6">
				<Discord />
			</IconWrapper>
			Sign in with Discord
		</div>
	</SignIn>
</div>
