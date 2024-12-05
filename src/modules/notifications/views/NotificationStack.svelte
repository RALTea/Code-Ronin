<script lang="ts">
	import Notification from './Notification.svelte';
	import type { Notification as NotificationEntity } from '../entities/Notification';

	type Props = {
		notifications: NotificationEntity[];
		closeNotification: (id: string) => void;
	};
	let { notifications, closeNotification }: Props = $props();
</script>

<div class="fixed z-40 top-0 right-0">
	{#each notifications.slice(0, 5) as notification, i (notification.id)}
		<div
			class="absolute right-0 w-[min(36rem,50vw)]"
			style="top: {i * 1}rem; z-index: {(5 * 20) - i}; opacity: {1 - (i * 0.2)}"
		>
			<Notification data={notification} {closeNotification} />
		</div>
	{/each}
</div>
