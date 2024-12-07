<script lang="ts">
	import '../app.css';
	import '../fonts.css';
	import { UserStore } from '$auth/stores/UserStore.svelte';
	import { NotificationStack as NotificationStackStore } from '../modules/notifications/stores/NotificationStack.svelte';
	import NotificationStack from '../modules/notifications/views/NotificationStack.svelte';
	import { CloseNotificationUseCase } from '../modules/notifications/usecases/CloseNotification/CloseNotification';

	let { data, children } = $props();

	const closeNotification = (id: string) => {
		const notif = NotificationStackStore.stack.find((n) => n.id === id);
		if (!notif) return;
		CloseNotificationUseCase({
			removeNotification: NotificationStackStore.closeNotification
		}).execute({ notification: notif });
	};

	$effect(() => {
		UserStore.user = data.user;
	});
</script>

<NotificationStack notifications={NotificationStackStore.stack} {closeNotification} />
<!-- {#if NotificationStack.stack.length > 0}
	<div class="fixed top-0 right-0">
		<Notification data={NotificationStack.stack[0]} />
	</div>
{/if} -->

{@render children()}
<!-- <slot /> -->
