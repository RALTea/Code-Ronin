<script lang="ts">
	import type { AddCss } from "$lib/utils/svelte.utils";

  type CardProps = AddCss;
  let { class: className }: CardProps = $$props;

</script>

<div class="bg-bg-light rounded-lg {className}">
  <slot/>
</div>