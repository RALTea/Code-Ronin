<script lang="ts">
	export let absolute = false;
</script>

<div
	class="lds-ellipsis w-[80px] h-[80px]
  {absolute
		? 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10'
		: 'relative'
	}"
>
	<div
		class="absolute w-3 h-3 rounded-[50%] bg-white top-8 left-2 ease-in animate-scaleZeroToOne"
	/>
	<div class="absolute w-3 h-3 rounded-[50%] bg-white top-8 left-2 ease-in animate-dotFadeOut" />
	<div class="absolute w-3 h-3 rounded-[50%] bg-white top-8 left-8 ease-in animate-dotFadeOut" />
	<div
		class="absolute w-3 h-3 rounded-[50%] bg-white top-8 left-14 ease-in animate-scaleOneToZero"
	/>
</div>