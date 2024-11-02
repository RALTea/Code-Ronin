<script lang="ts">
	import { browser } from "$app/environment";
	import { onMount } from "svelte";

  export let threshold = 0.5;
  export let className = "";
	let key = { hidden: true };
  let containerRef: HTMLDivElement;

	const observerOptions = {
		root: null,
		rootMargin: '0px',
		threshold,
	};

  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          key = { hidden: false };
          observer.disconnect();
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    observer.observe(containerRef);
  })
</script>

{#key key.hidden}
  <div class:invisible={browser && key.hidden} class="{className}" bind:this={containerRef}>
    <slot />
  </div>
{/key}
