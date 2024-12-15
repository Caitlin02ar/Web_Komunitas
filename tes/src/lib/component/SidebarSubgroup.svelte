<script lang="ts">
    import { goto } from '$app/navigation'; // For navigation
    import event_icon from '$lib/images/events.svg';
  
    export let communityName: string;
    // export let chats: Array<{
    //   id: number; 
    //   name: string; 
    //   imageSrc: string; 
    //   isPrivate: boolean; 
    //   hasJoined: boolean;
    // }>;
    
    // Function to open a chat
    function handleOpenChat() {
      let currentUrl = window.location.pathname;
      const communityPath = currentUrl.split('/chat')[0]; // Extract everything before '/chat'
      const newPath = `${communityPath}/chat/openchat`;
      goto(newPath); // Navigate to the open chat page
    }
  
    function handleBackClick() {
      const currentUrl = window.location.href;
      const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
      goto(baseUrl); 
    }
  
  
    function navigateToCommunityEvents() {
      const currentUrl = window.location.pathname;
      const communityPath = currentUrl.split('/chat')[0]; // Extract everything before '/chat'
      const eventsPath = `${communityPath}/events`;
      goto(eventsPath); // Navigate to the /events page
    }
  
    function navigateToCommunityCalendar() {
      const currentUrl = window.location.pathname;
      const communityPath = currentUrl.split('/chat')[0]; // Extract everything before '/chat'
      const eventsPath = `${communityPath}/calendar`;
      goto(eventsPath); // Navigate to the /events page
    }
  
  
  </script>
  
  <!-- Sidebar UI -->
  <div class="sidebar-container">
    <div class="header">
      <button class="back-btn" on:click={handleBackClick}>
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      <div class="header-text">
        <h2 class="bold-text">Group Chat</h2>
        <h3 class="bold-text">{communityName}</h3>
      </div>
    </div>
  
    <hr class="divider"> <!-- Horizontal line -->
  
    <!-- Chat Button -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="chats-section">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="item" on:click={handleOpenChat}>
        <!-- <img src="/src/lib/images/chat_icon.svg" alt="Open Chat" class="item-icon" /> -->
        <span>Open Chat</span>
      </div>
    </div>
  
    <!-- Event Section -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="events-section">
      <h3>Events</h3>
      <div class="event-item" on:click={navigateToCommunityEvents}>
        <img src="{event_icon}" alt="Community Event" class="event-icon" />
        <span>Community Event</span>
      </div>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="event-item" on:click={navigateToCommunityCalendar}>
        <img src="{event_icon}" alt="Group Community Event" class="event-icon" />
        <span>Group Community Event</span>
      </div>
    </div>
  </div>
  
  <style>
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
  
      .chats-section{
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 0 16px;
        max-height: 50vh; 
        overflow-y: auto;
      }
      .events-section h3{
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
        border: 1px solid rgba(115, 115, 115, 0.5); /* Border for Group Community items */
        
      }
  
      .item:hover {
        background-color: #ddd;
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
  
      /* .item-icon {
        width: 32px;
        height: 32px;
        margin-right: 10px;
      } */
  </style>