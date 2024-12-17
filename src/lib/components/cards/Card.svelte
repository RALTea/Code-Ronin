<script lang="ts">
	import type { AddCss } from '$lib/utils/svelte.utils';
	import type { Snippet } from 'svelte';

  type CardProps = AddCss & {
    id?: string;
    children: Snippet;
  };
  let { class: className, id, children }: CardProps = $props();

</script>

<div class="bg-bg-light rounded-lg {className}" {id}>
  {@render children()}
</div>
