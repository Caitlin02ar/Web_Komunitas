<script lang="ts">
  // @ts-nocheck
  import { page } from '$app/stores'; // Import SvelteKit's page store to access the current URL
  import ButtonBack from '$lib/component/ButtonBack.svelte'; // Import the Back button component
  import CommunitySidebar from '$lib/component/CommunitySidebar.svelte'; // Import CommunitySidebar component

  let openChatImageSrc = '/src/lib/images/poster.svg'; // Path for the chat image

  // Mock community data for sidebar
  let communityData = {
    rules: [
      { title: "Rules 1", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
      { title: "Rules 2", content: "Vivamus luctus urna sed urna ultricies ac tempor dui sagittis." }
    ],
    groupCommunities: [
      { name: "Community A", imageSrc: "/src/lib/images/poster.svg" },
      { name: "Community B", imageSrc: "/src/lib/images/poster.svg" }
    ],
    events: [
      { name: "Event 1", imageSrc: "/src/lib/images/event.svg" },
      { name: "Event 2", imageSrc: "/src/lib/images/event.svg" }
    ]
  };

  let isCommunitySetting = false;

  // Reactive variable to track the current path
  $: currentPath = $page.url.pathname;

  // Check if the current route is part of CM_CommunitySetting
  $: {
    isCommunitySetting = $page.url.pathname.includes('/CM_CommunitySetting');
  }

</script>

<!-- Conditionally render the ButtonBack component -->
{#if !isCommunitySetting}
  <ButtonBack href="/communities" text="Back" />
{/if}

<div class="page">
  <!-- Conditionally render the sidebar if it's not in CM_CommunitySetting -->
  {#if !isCommunitySetting}
    <CommunitySidebar
      rules={communityData.rules}
      groupCommunities={communityData.groupCommunities}
      events={communityData.events}
      openChatImageSrc={openChatImageSrc}
    />
  {/if}

  <!-- Main content section -->
  <div class="content">
    <slot />
  </div>
</div>

<style>
  .page {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 20px;
  }

  .content {
    flex: 1;
    margin-left: 20px;
  }
</style>
