<script lang="ts">
	import { UserStore } from '$auth/stores/UserStore.svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import '../fonts.css';
	import { NotificationStack as NotificationStackStore } from '../modules/notifications/stores/NotificationStack.svelte';
	import { CloseNotificationUseCase } from '../modules/notifications/usecases/CloseNotification/CloseNotification';
	import NotificationStack from '../modules/notifications/views/NotificationStack.svelte';
	import TransferSuccessModal from '$dashboard/usecases/JoinNewCampaign/views/TransferSuccessModal.svelte';
	import { TransferModalStore } from '$dashboard/usecases/JoinNewCampaign/stores/TransferModalStore.svelte';
	import { page } from '$app/stores';

	let { data, children } = $props();

	onMount(() => {
		console.debug('Version: 0.0.1');
	})

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

<TransferSuccessModal />


{@render children()}
