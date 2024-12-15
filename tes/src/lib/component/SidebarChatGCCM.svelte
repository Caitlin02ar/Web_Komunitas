<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Aksi2 from '$lib/component/Aksi2.svelte';
  import plusIcon from '$lib/images/plus.svg';
  import event_icon from '$lib/images/events.svg';

  export let groupcommunityName: string;
  export let chats: Array<{ id: number; name: string; imageSrc: string }>;
  export let actions: Array<{ text: string; onClick: () => void }>; 

  let showSidebar = true;

  onMount(() => {
      const currentPath = window.location.pathname;
      if (currentPath.includes('CM_SubGroupCommunity')) {
          showSidebar = false;
      }
  });

  function handleOpenChat() {
      goto(`${window.location.pathname}/CM_OpenChat`);
  }

  function handleChatClick(chatId: number) {
      goto(`${window.location.pathname}/CM_SubGroupCommunity/${chatId}`);
  }

function handleEventClick(eventName: string) {
    if (eventName === "Community Event") {
        // Get the current path
        const currentPath = window.location.pathname;
        
        // Remove the last three segments and replace with CM_Events
        const basePath = currentPath.split('/').slice(0, -3).join('/');  // Remove the last three segments
        
        // Create the new path
        const newPath = `${basePath}/CM_Events`;
        
        // Navigate to the new path
        goto(newPath);
    }
    console.log(`${eventName} clicked`);
}
function handleGroupEventClick(eventName: string) {
    if (eventName === "Group Community Event") {
        // Get the current path
        const currentPath = window.location.pathname;
        
        // Remove the last three segments and replace with CM_Events
        const basePath = currentPath.split('/').slice(0, -3).join('/');  // Remove the last three segments
        
        // Create the new path
        const newPath = `${basePath}/CM_Events/CM_CommunitySchedule`;
        
        // Navigate to the new path
        goto(newPath);
    }
    console.log(`${eventName} clicked`);
}



  function handleBackClick() {
      const currentUrl = window.location.href;
      const baseUrl = currentUrl.split('/').slice(0, -2).join('/');
      goto(baseUrl);
  }

  function handleCreateSubGroup() {
      goto(`${window.location.pathname}/CM_CreateSubGroup`);
  }
</script>

{#if showSidebar}
<div class="sidebar-container">
  <div class="header">
      <div class="header-left">
          <button class="back-btn" aria-label="Back" on:click={handleBackClick}>
              <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
          </button>
          <div class="header-text">
              <h2 class="bold-text">Group Chat</h2>
              <h3 class="bold-text">{groupcommunityName}</h3>
          </div>
      </div>
      <div class="header-right">
          <Aksi2 {actions} />
      </div>
  </div>

  <hr class="divider">

  <!-- Events Section -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="events-section">
      <h3>Events</h3>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="event-item" on:click={() => handleEventClick("Community Event")}>
          <img src="{event_icon}" alt="Community Event" class="event-icon" />
          <span>Community Event</span>
      </div>
      <div class="event-item" on:click={() => handleGroupEventClick("Group Community Event")}>
          <img src="{event_icon}" alt="Group Community Event" class="event-icon" />
          <span>Group Community Event</span>
      </div>
  </div>

  <!-- Add Group Community Button -->
  <button class="add-group-btn" on:click={handleCreateSubGroup}>
      <img src={plusIcon} alt="Add" />
      Add Sub Group Community
  </button>

  <!-- Group Community Chats Section -->
  <h3 class="group-title">Group Community</h3>
  <div class="chats-section group-community-scroll">
    {#if chats && chats.length > 0}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      {#each chats as chat}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="item" on:click={() => handleChatClick(chat.id)}>
          <img src={chat.imageSrc} alt={chat.name} class="item-icon" />
          <div class="chat-info">
            <div class="chat-details">
              <span class="chat-name">{chat.name}</span>
            </div>
            <span class="arrow-icon">❯</span>
          </div>
        </div>
      {/each}
    {:else}
      <p class="no-chats-message">No chats available in this community.</p>
    {/if}
  </div>
</div>
{/if}

<style>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .header-right {
    display: flex;
    align-items: center;
  }

  .arrow-icon {
    margin-left: auto;
    font-size: 1.2rem;
    font-weight: bold;
    color: #000;
    border: none;
    outline: none;
  }

  .arrow-icon:hover {
    color: #ff9000;
  }

  .chat-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .chat-name {
    margin: 0;
    font-weight: bold;
  }

  .header-text {
    display: flex;
    flex-direction: column;
  }

  .bold-text {
    font-weight: 700;
    margin: 0;
  }

  .header h3 {
    font-size: 1rem;
    margin: 0;
    color: #000000;
  }

  .back-btn {
    background: none;
    border: none;
    cursor: pointer;
  }

  .icon {
    width: 24px;
    height: 24px;
  }

  .divider {
    margin: 0 0 20px 0;
    border: 0;
    border: 1px solid rgba(115, 115, 115, 0.5);
  }

  .events-section {
    display: flex;
    flex-direction: column;
    gap: 0px;
    padding: 0 16px;
  }

  .group-title {
    padding-left: 16px;
    padding-bottom: 10px;
  }

  .chats-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0 16px;
    max-height: 50vh;
    overflow-y: auto;
  }

  .events-section h3 {
    font-size: 1.1rem;
    margin-bottom: 2px;
    color: #000000;
  }

  .item {
    display: flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 8px;
    cursor: pointer;
    background-color: #fff;
    border: 1px solid rgba(115, 115, 115, 0.5);
  }

  .item:hover {
    background-color: #ddd;
  }

  .event-item {
    display: flex;
    align-items: center;
    padding: 6px 12px;
    cursor: pointer;
    margin-left: 20px;
    background-color: transparent;
  }

  .event-item img {
    width: 24px;
    height: 24px;
    margin-right: 10px;
    filter: invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%);
  }

  .item-icon {
    width: 32px;
    height: 32px;
    margin-right: 10px;
  }

  .arrow-icon {
    float: right;
    width: 20px;
  }

  .add-group-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        width: 85%;
        max-width: 230px;
        background-color: #56A3B2;
        border: none;
        cursor: pointer;
        margin: 10px auto;
        color: white;
        font-weight: bold;
        border-radius: 4px;
  }

  .no-chats-message {
    color: #8F8F8F;
    font-size: 0.9rem;
    padding: 16px;
    text-align: center;
  }
</style>
