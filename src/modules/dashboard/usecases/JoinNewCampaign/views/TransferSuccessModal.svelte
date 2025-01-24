<script lang="ts">
  import BaseModal from '$lib/components/layout/BaseModal.svelte';
  import PrimaryButton from '$lib/components/buttons/PrimaryButton.svelte';
  import { TransferModalStore } from '../stores/TransferModalStore.svelte';

  let isOpen = $derived(TransferModalStore.isOpen);
  let message = $derived(TransferModalStore.message);

  const closeModal = () => {
    TransferModalStore.close();
  };
</script>

<BaseModal
  title="Progress Transferred"
  {isOpen}
  onClose={closeModal}
  showCloseButton={false}
>
  <p class="text-zinc-300 mb-6">
    {message || 'Your progress has been successfully transferred.'}
  </p>

  <PrimaryButton 
    class="px-4 py-1 w-fit mt-8 float-end" 
    type={{ buttonType: 'button', onclick: closeModal }}
  >
    Continue
  </PrimaryButton>
</BaseModal>
