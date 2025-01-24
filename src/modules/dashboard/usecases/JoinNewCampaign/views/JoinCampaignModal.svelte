<script lang="ts">
  import { page } from '$app/stores';
  import { UserStore } from '$auth/stores/UserStore.svelte';
  import PrimaryButton from '$lib/components/buttons/PrimaryButton.svelte';
  import Input from '$lib/components/forms/Input.svelte';
  import BaseModal from '$lib/components/layout/BaseModal.svelte';
  import { ArrowRight } from 'lucide-svelte';
  import type { Campaign } from '../aggregates/Campaign';
  import { JoinCampaignModalVM } from './JoinCampaignModalVM.svelte';
	import TransferSuccessModal from './TransferSuccessModal.svelte';
	import { TransferModalStore } from '../stores/TransferModalStore.svelte';
	import { AppNotificationService } from '$notifications/services/AppNotificationService';

  type Props = {
    onSuccess?: (data: {
      campaign: Campaign;
      redirectUrl: string;
      transferStatus: {
        success: boolean;
        error?: string;
      };
    }) => void;
    onFail?: (message: string) => void;
    onCancel?: () => void;
		isOpen: boolean
  };

  let {
    onSuccess,
    onFail,
    onCancel,
		isOpen
  }: Props = $props();

  let accessKey = $state('');
  let isUserLoggedIn = $derived(!!UserStore.user);

  const vm = new JoinCampaignModalVM($page, {
    onSuccess: (data) => {
      onSuccess?.(data);
			AppNotificationService.send({
				message: 'Successfully joined campaign',
				type: 'INFO'
			})
			if (data.transferStatus?.success) {
				const message = data.transferStatus.error
					? `Transfer failed: ${data.transferStatus.error}`
					: `Some progress has been transferred from a Demo campaign`
				TransferModalStore.open(message);
			}
    },
    onFail: (message) => {
      onFail?.(message);
    },
    onCancel
  });

  function handleCancel() {
    onCancel?.();
    isOpen = false;
  }
</script>

<BaseModal
  title={isUserLoggedIn ? 'Join a campaign' : 'Please login to join a campaign'}
  {isOpen}
	animate={true}
  onClose={handleCancel}
  showCloseButton={false}
>
  {#if isUserLoggedIn}
    <p class="text-zinc-400 mt-2 italic">
      Get an access key by joining RALTech School or through a campus partner
    </p>
    <form class="flex gap-4 [$>div>label]:font-medium mt-6">
      <Input
        label="Enter your access key"
        name="accessKey"
				oninput={(val) => accessKey = val}
      />
      <PrimaryButton
        class="h-10 mt-6 px-4"
        type={{ buttonType: 'button', onclick: () => vm.onJoin(accessKey) }}
      >
        Join
      </PrimaryButton>
    </form>
  {:else}
    <PrimaryButton 
      type={{ href: '/login' }} 
      class="px-4 py-1 w-fit flex gap-2 items-center mt-6"
    >
      Login
      <ArrowRight size="16" />
    </PrimaryButton>
  {/if}
</BaseModal>
