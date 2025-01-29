<script lang="ts">
	import { UserStore } from '$auth/stores/UserStore.svelte';
	import TransferSuccessModal from '$dashboard/usecases/JoinNewCampaign/views/TransferSuccessModal.svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import '../fonts.css';
	import { NotificationStack as NotificationStackStore } from '../modules/notifications/stores/NotificationStack.svelte';
	import { CloseNotificationUseCase } from '../modules/notifications/usecases/CloseNotification/CloseNotification';
	import NotificationStack from '../modules/notifications/views/NotificationStack.svelte';
	import { env } from '$env/dynamic/public';
	import { isOnMobile } from '$lib/utils/svelte.utils';

	let { data, children } = $props();
	let isWindowTooSmall: boolean = $state(false);

	onMount(() => {
		isWindowTooSmall = isOnMobile() && env.PUBLIC_HIDE_MOBILE === 'true';
		console.debug('Version: 0.0.1');
	});

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

{#if isWindowTooSmall}
	<div class="fixed top-0 left-0 h-screen w-screen z-50">
		<p
			class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-400 w-4/5 text-center"
		>
			This application is only available on desktop for now. Sorry!
		</p>
	</div>
{:else}
	{@render children()}
{/if}
