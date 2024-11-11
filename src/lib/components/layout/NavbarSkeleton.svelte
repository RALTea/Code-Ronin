<script>
	import Progress from '../forms/Progress.svelte';
</script>

{#snippet divider()}
	<div class="h-full py-2 mx-6">
		<div class="w-[.125rem] h-full bg-primary-light rounded-full"></div>
	</div>
{/snippet}

<div class="opacity-50 flex w-full items-center">
  <div class="w-4/5 h-full flex items-center animate-pulse">
    <div class="flex">
      <div class="object-cover w-12 h-12 mx-2 rounded-full bg-lightless text-lightless">.</div>
      <div class="mx-2">
        <h1 class="bg-lightless text-lightless">Anonymous user</h1>
        <p class="font-space-mono text-primary-light bg-primary-light">Hello</p>
      </div>
    </div>
    {@render divider()}
    <div class="flex gap-4">
      {#each [0, 1, 2] as _}
        <div class="object-cover w-10 h-10 mx-2 rounded-full bg-lightless text-lightless">.</div>
      {/each}
    </div>
    {@render divider()}
    <div class="flex flex-1 h-full items-center">
      <div class="flex flex-col flex-1">
        <p class="font-space-mono text-primary-light bg-primary-light">Experience</p>
        <div class="flex gap-4">
          <div class="h-2 w-full flex items-center my-auto">
            <Progress value={100} max={100} />
          </div>
          <div class="row-span-2 content-end bg-lightless text-lightless">100/100</div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="flex items-center justify-center h-full mr-2 ml-auto animate-pulse">
    {@render divider()}
    <div class="object-cover w-8 h-8 mx-2 rounded-full bg-lightless text-lightless">.</div>
  </div>
  
</div>