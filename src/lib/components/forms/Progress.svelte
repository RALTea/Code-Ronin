<script lang="ts">
	import type { AddCss } from "$lib/utils/svelte.utils";

	type Props = {
		value: number;
    max: number
	} & AddCss;
	let { value, max, class: className }: Props = $props();
  let fill: number = $derived((value * 100) / max)
</script>

<div class="w-full h-full bg-black relative rounded-full overflow-hidden {className}">
  <progress class="rounded-full hidden" {value} {max}></progress>
  <div class="bg-primary-light absolute top-0 left-0 h-full w-full" style="width: {fill}%;"></div>
</div>
