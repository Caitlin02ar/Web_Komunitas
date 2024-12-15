<script lang="ts">
  import { goto } from '$app/navigation';
  import { createEventDispatcher } from 'svelte';
  import plusIcon from '$lib/images/plus.svg';
  import event_icon from '$lib/images/events.svg';

  const dispatch = createEventDispatcher();

  export let communityName: string;
  export let chats: Array<{
    id: number; 
    name: string; 
    imageSrc: string; 
    isPrivate: boolean; 
    hasJoined: boolean;
    questions: { 
      field_pertanyaan_1: string; 
      field_pertanyaan_2: string; 
      field_pertanyaan_3: string; 
    }
  }>;

  let showRequestModal: { [key: number]: boolean } = {};
  let selectedChatId = null;
  let answers = {
    question1: '', 
    question2: '', 
    question3: ''
  }; 

  $: {
    chats.forEach(chat => {
      if (!(chat.id in showRequestModal)) {
        showRequestModal[chat.id] = false;
      }
    });
  }

  function handleOpenChat() {
    goto(`${window.location.href}/CM_OpenChat`);
  }

  function handleChatClick(chatId: number) {
    goto(`${window.location.href}/CM_GroupCommunityHome/${chatId}`);
  }

  function handleEventClick(eventName: string) {
    if (eventName === "Community Event") {
        // Get the current path
        const currentPath = window.location.pathname;
        
        // Remove the last three segments and replace with CM_Events
        const basePath = currentPath.split('/').slice(0, -1).join('/');  // Remove the last three segments
        
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
        const basePath = currentPath.split('/').slice(0, -1).join('/');  // Remove the last three segments
        
        // Create the new path
        const newPath = `${basePath}/CM_Events/CM_CommunitySchedule`;
        
        // Navigate to the new path
        goto(newPath);
    }
    console.log(`${eventName} clicked`);
}

  function handleBackClick() {
    const currentPath = window.location.pathname;
        
        // Remove the last three segments and replace with CM_Events
        const basePath = currentPath.split('/').slice(0, -1).join('/');  // Remove the last three segments
        
        // Create the new path
        const newPath = `${basePath}/CM_Home`;
        
        // Navigate to the new path
        goto(newPath);
  }
</script>

<div class="sidebar-container">
  <div class="header">
    <button class="back-btn" aria-label="Back" on:click={handleBackClick}>
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
    </button>
    <div class="header-text">
      <h2 class="bold-text">Group Chat</h2>
      <h3 class="bold-text">{communityName}</h3>
    </div>
  </div>

  <hr class="divider">

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="chats-section">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="item" on:click={handleOpenChat}>
      <!-- <img src="/src/lib/images/chat_icon.svg" alt="Open Chat" class="item-icon" /> -->
      <span>Open Chat</span>
    </div>
  </div>

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="events-section">
    <h3>Events</h3>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="event-item" on:click={() => handleEventClick("Community Event")}>
      <img src="{event_icon}" alt="Community Event" class="event-icon" />
      <span>Community Event</span>
    </div>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="event-item" on:click={() => handleEventClick("Group Community Event")}>
      <img src="{event_icon}" alt="Group Community Event" class="event-icon" />
      <span>Group Community Event</span>
    </div>
  </div>

  <a href="{window.location.href + '/CM_CreateGroupCommunity'}">
    <button class="add-group-btn">
      <img src={plusIcon} alt="Add" />
      Add Group Community
    </button>
  </a>

  <h3 class="group-title">Group Community</h3> 
  <div class="chats-section group-community-scroll">
    {#if chats && chats.length > 0}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      {#each chats as chat}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
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

<style>
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

  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
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
