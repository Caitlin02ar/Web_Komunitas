<script>
  //@ts-nocheck
  import ButtonNav from '$lib/component/ButtonNav.svelte';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { getJwtToken, extractIdFromUrl } from '$lib/js/utils';
  import { page } from '$app/stores';
  
  let open = writable(false);
  let showMemberRequest = writable(false); 
  let komunitasId = ''; 
  let communityNameId = $page.params.communityNameId; 
  const token = getJwtToken();

  onMount(() => {
    open.set(true);
    komunitasId = extractIdFromUrl(window.location.href); 
    fetchCommunityData(); 
  });

  async function fetchCommunityData() {
    try {
      const response = await fetch(`http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${komunitasId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (data.status === 200) {
        const statusPrivasi = data.data.Komunitas.status_privasi;

        if (statusPrivasi === 'Private' || statusPrivasi === 'Restrict') {
          showMemberRequest.set(true);
        } else {
          showMemberRequest.set(false); 
        }
      } else {
        console.error('Failed to fetch community data:', data.message);
      }
    } catch (error) {
      console.error('Error fetching community data:', error);
    }
  }

  // Check if the current path is within CM_GroupCommunity or its subpaths
  $: isGroupCommunityPath = $page.url.pathname.includes(`/communities/${communityNameId}/Management/CM_GroupCommunity`);
</script>

<div class="layout">
  <div class="content-wrapper">
    <div class="main-content" class:shifted={$open}>
      <div class="flex justify-center mt-4">
        {#if !isGroupCommunityPath}
          <ButtonNav iconPath="/src/lib/images/CM_Home.svg" text="Home" href={`/communities/${communityNameId}/Management/CM_Home`} />
          <ButtonNav iconPath="/src/lib/images/CM_Members.svg" text="Members" href={`/communities/${communityNameId}/Management/CM_Members`} />
          <ButtonNav iconPath="/src/lib/images/CM_Events.svg" text="Events" href={`/communities/${communityNameId}/Management/CM_Events`} />

          {#if $showMemberRequest}
            <ButtonNav iconPath="/src/lib/images/CM_MemberRequest.svg" text="Member Request" href={`/communities/${communityNameId}/Management/CM_MemberRequest`} />
          {/if}

          <ButtonNav iconPath="/src/lib/images/CM_GroupCommunity.svg" text="Group Community" href={`/communities/${communityNameId}/Management/CM_GroupCommunity`} />
          <ButtonNav iconPath="/src/lib/images/CM_Polling.svg" text="Polling" href={`/communities/${communityNameId}/Management/CM_Polling`} />
        {/if}
      </div>
      <slot />
    </div>
  </div>
</div>

<svelte:head>
  <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet" />
</svelte:head>

<style>
  .layout {
    display: flex;
    background-color: #FBFAF9;
    min-height: 100vh;
    margin-left: -50px;
  }

  .sidebar:not(.open) {
    transform: translateX(-200px);
  }

  .content-wrapper {
    flex-grow: 1;
    transition: margin-left 0.3s ease-in-out;
    background-color: #FBFAF9;
  }

  .main-content {
    transition: margin-left 0.3s ease-in-out;
    background-color: #FBFAF9;
    min-height: calc(100vh - 50px);
  }

  .shifted .main-content {
    margin-left: 250px;
  }

  :global(body) {
    padding: 0;
    margin: 0;
    background-color: #FBFAF9;
  }

  :global(html) {
    height: 100%;
  }

  :global(body) {
    height: 100%;
  }
</style>
