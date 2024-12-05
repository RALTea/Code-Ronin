<script lang="ts">
	import IconWrapper from '$lib/components/icons/IconWrapper.svelte';
	import { X } from 'lucide-svelte';
	import type { Notification } from '../entities/Notification';
	import type { NotificationType } from '../entities/NotificationType';
	import { fade, fly } from 'svelte/transition';
  import { elasticOut } from "svelte/easing"

	type Props = {
		data: Notification;
		closeNotification: (id: string) => void;
	};
	let { data, closeNotification }: Props = $props();

	const themes: Record<NotificationType, string> = {
		ERROR: 'bg-red-500 text-white border-white',
		WARNING: 'bg-yellow-300 text-black border-black',
		INFO: 'bg-blue-300 text-white border-white'
	};
</script>

<div class="{themes[data.type]} px-4 py-2 rounded-md m-4 border shadow-white relative" in:fly={{y: 50, easing: elasticOut, duration: 500}} out:fade>
	<p class="font-bold text-sm tracking-widest">{data.type}</p>
	<button class="absolute top-0 right-0 m-2" onclick={() => closeNotification(data.id)}>
    <IconWrapper size="6">
      <X />
    </IconWrapper>
  </button>

	<p>{data.message}</p>
</div>
