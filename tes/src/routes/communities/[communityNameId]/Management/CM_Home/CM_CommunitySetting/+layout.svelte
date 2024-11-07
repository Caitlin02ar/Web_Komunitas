<script>
  import TabNavContainer from '$lib/component/TabNavContainer.svelte';
  import ButtonBack from '$lib/component/ButtonBack.svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  let communityNameId = '';

  // Get communityNameId from URL params
  $: communityNameId = $page.params.communityNameId;

  // Get the current URL
  $: currentUrl = $page.url.pathname;

  // Utility to remove the last part of the URL path before adding a new segment
  function removeLastSegment(url) {
    const segments = url.split('/');  // Split the URL into segments
    segments.pop(); // Remove the last segment (current tab)
    return segments.join('/'); // Rejoin the remaining segments
  }

  // Define the tabs with actions
  const tabs = [
    {
      text: 'Community Detail',
      action: () => goto(`${removeLastSegment(currentUrl)}/CM_CommunityDetail`)
    },
    {
      text: 'Community Privacy',
      action: () => goto(`${removeLastSegment(currentUrl)}/CM_CommunityPrivacy`)
    },
    {
      text: 'Community Theme',
      action: () => goto(`${removeLastSegment(currentUrl)}/CM_CommunityTheme`)
    }
  ];
</script>

<main>
  <!-- Back button and header -->
  <div class="header-container">
    <ButtonBack href={`/communities/${communityNameId}/Management/CM_Home`} text="Back" />
    <h1 class="text-2xl font-bold text-left">Community Settings</h1>
  </div>
  
  <!-- Tab navigation -->
  <TabNavContainer {tabs} />

  <!-- Content area: Slot for tab content -->
  <div class="content-area">
    <slot />
  </div>
</main>

<style>
  .header-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .content-area {
    margin-top: 2rem;
    padding: 1rem;
    border: 1px solid #C6D8DB;
    border-radius: 8px;
    background-color: white;
    min-height: 700px;
  }
</style>
