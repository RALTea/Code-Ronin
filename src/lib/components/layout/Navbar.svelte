<script lang="ts">
	import type { AddCss } from '$lib/utils/svelte.utils';
	import IconPower from '../icons/IconPower.svelte';
	import IconWrapper from '../icons/IconWrapper.svelte';

	type Props = AddCss;
	const { class: className }: Props = $props();
</script>

{#snippet divider()}
	<div class="mx-6 py-2 h-full">
		<div class="w-[.125rem] h-full bg-primary-light rounded-full"></div>
	</div>
{/snippet}

<nav
	class="h-20 bg-bg-dark rounded-lg m-4 shadow-[.15rem_.15rem_.2rem] shadow-lightless flex items-center px-4 py-2 {className}"
>
	<img src="/default-pfp.png" alt="profile" class="h-12 w-12 mx-2 rounded-full" />
	<div class="mx-2">
		<h1 class="font-extrabold">Robin TOURNÉ</h1>
		<p class="font-space-mono text-primary-light">Apprentice</p>
	</div>
	{@render divider()}

	<div class="ml-auto flex items-center justify-center h-full mr-2">
		{@render divider()}
		<button>
			<IconWrapper size="8">
				<IconPower />
			</IconWrapper>
		</button>
	</div>
</nav>
