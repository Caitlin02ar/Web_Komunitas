<script>
  import { onMount } from 'svelte';
  import TabNav from '$lib/component/TabNav.svelte';
  import { page } from '$app/stores'; 

  let id;
  let currentUrl;

  // Ensure id is extracted from page params correctly
  $: id = $page.params.id;

  let buttons = [];

  // Use onMount to get window location on client-side
  onMount(() => {
    currentUrl = window.location.href.split('/Management')[0];
    
    // Define buttons once currentUrl is available
    buttons = [
      { text: 'Registered Participants', href: `${currentUrl}/Management/CM_Events/CM_Payment/CM_RegisteredParticipants/${id}` },
      { text: 'Accepted Participants', href: `${currentUrl}/Management/CM_Events/CM_Payment/CM_AcceptedParticipants/${id}` },
      { text: 'Rejected Participants', href: `${currentUrl}/Management/CM_Events/CM_Payment/CM_RejectedParticipants/${id}` },
      { text: 'Refund', href: `${currentUrl}/Management/CM_Events/CM_Payment/CM_PaymentRefund/${id}` }
    ];
  });
</script>

<main>
  <h1 class="text-2xl font-bold mb-4 text-left">Registered Participants of Seoul Culture Night</h1>
  <div class="tab-nav-container">
    <TabNav {buttons} />
  </div>
  <slot /> 
</main>

<style>
  main {
    padding: 1rem;
  }

  .tab-nav-container {
    margin-bottom: 1.5rem;
  }
</style>
