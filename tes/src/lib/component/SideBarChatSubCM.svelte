<script lang="ts">
  import { goto } from '$app/navigation'; // Import the navigation function
  import Aksi2 from '$lib/component/Aksi2.svelte'; // Importing Aksi2 component
  export let subgroupcommunityName: string;
  // export let chats: Array<{ id: number; name: string; imageSrc: string }>;
  export let actions: Array<{ text: string; onClick: () => void }>; 
  import plusIcon from '$lib/images/plus.svg';
  import event_icon from '$lib/images/events.svg';


  // Handle the Open Chat click
  function handleOpenChat() {
      goto(`${window.location.href}/CM_OpenChat`);
  }

  // Handle the Group Chat click
  function handleChatClick(chatId: number) {
    goto(`${window.location.href}/CM_SubGroupCommunity/${chatId}`);
  }

  function handleEventClick(eventName: string) {
    if (eventName === "Community Event") {
        // Get the current path
        const currentPath = window.location.pathname;
        
        // Remove the last three segments and replace with CM_Events
        const basePath = currentPath.split('/').slice(0, -5).join('/');  // Remove the last three segments
        
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
        const basePath = currentPath.split('/').slice(0, -5).join('/');  // Remove the last three segments
        
        // Create the new path
        const newPath = `${basePath}/CM_Events/CM_CommunitySchedule`;
        
        // Navigate to the new path
        goto(newPath);
    }
    console.log(`${eventName} clicked`);
}

  // Handle the Back button click to go up one level in the URL
  function handleBackClick() {
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.split('/').slice(0, -2).join('/');
    goto(baseUrl); // Navigate back to the base URL
  }
</script>

<div class="sidebar-container">
  <!-- Community Chat Header -->
  <div class="header">
    <button class="back-btn" aria-label="Back" on:click={handleBackClick}>
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
    </button>
    <div class="header-text">
      <h2 class="bold-text">Group Chat</h2>
      <h3 class="bold-text">{subgroupcommunityName}</h3>
    </div>

    <!-- Aksi2 component for dropdown actions -->
    <div class="relative inline-block">
      <Aksi2 {actions} />
    </div>
  </div>

  <!-- Horizontal line below Komunitas ABC -->
  <hr class="divider">

  <!-- Events Section -->
  <div class="events-section">
    <h3>Events</h3>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="event-item" on:click={() => handleEventClick("Community Event")}>
      <img src="{event_icon}" alt="Community Event" class="event-icon" />
      <span>Community Event</span>
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="event-item" on:click={() => handleGroupEventClick("Group Community Event")}>
      <img src="{event_icon}" alt="Group Community Event" class="event-icon" />
      <span>Group Community Event</span>
    </div>
  </div>
</div>

<style>
  /* Ensure the sidebar container stretches to fill the viewport */
 
  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
  }

  .header-text {
    display: flex;
    flex-direction: column;
  }

  .bold-text {
    font-weight: 700; /* Bold text for Group Chat and community name */
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

  /* Divider line style */
  .divider {
    margin: 0 0 20px 0; /* Increased margin-bottom to create more space */
    border: 0;
    border: 1px solid rgba(115, 115, 115, 0.5); /* Border for Group Community items */
  }

  .events-section {
    display: flex;
    flex-direction: column;
    gap: 0px;
    padding: 0 16px;
  }

  

  .events-section h3{
    font-size: 1.1rem;
    margin-bottom: 2px;
    color: #000000;
  }

  

  .event-item {
    display: flex;
    align-items: center;
    padding: 6px 12px;
    cursor: pointer;
    margin-left: 20px; /* Indent events more to the right */
    background-color: transparent; /* No background or border for events */
  }

  .event-item img {
    width: 24px; /* Adjust SVG size for the event icon */
    height: 24px;
    margin-right: 10px;
    filter: invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%); /* Make it black */
  }

</style>
