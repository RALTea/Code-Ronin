<script lang="ts">
	import type { AddCss } from '$lib/utils/svelte.utils';

  type CardProps = AddCss & {
    id?: string;
  };
  let { class: className, id }: CardProps = $$props;

</script>

<div class="bg-bg-light rounded-lg {className}" {id}>
  <slot/>
</div>
