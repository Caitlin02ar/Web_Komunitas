<script lang="ts">
  import { goto } from '$app/navigation'; // For navigation
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  import events from '$lib/images/events.svg';

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

  let showRequestModal: { [key: number]: boolean } = {}; // Modal visibility state for each chat
  let selectedChatId = null; // Track which chat is selected for request to join
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

  // Function to open a chat
  function handleOpenChat() {
    let currentUrl = window.location.pathname;
    const communityPath = currentUrl.split('/chat')[0]; // Extract everything before '/chat'
    const newPath = `${communityPath}/chat/openchat`;
    goto(newPath); // Navigate to the open chat page
  }

  // Handle when a chat is clicked
  function handleChatClick(chatId: number, isPrivate: boolean, hasJoined: boolean) {
    const chat = chats.find(c => c.id === chatId);
    const sudahJoin = chat?.hasJoined;

    if (chat) {
      if (sudahJoin) {
        let currentUrl = window.location.pathname;
        const communityPath = currentUrl.split('/chat')[0]; // Extract everything before '/chat'
        const newPath = `${communityPath}/chat/${chatId}`;
        goto(newPath);
      } else if (!sudahJoin) {
        Object.keys(showRequestModal).forEach(id => showRequestModal[id] = false);

        selectedChatId = chatId;
        showRequestModal[chatId] = true; // Buka modal untuk chat ini

        console.log(`Clicked Request to Join for chat ID: ${chatId}`);
      }
    }
  }

  function handleBackClick() {
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
    goto(baseUrl); 
  }

  function handleRequestJoin(chatId) {
    console.log(`Requesting to join chat ID: ${chatId} with answers:`, answers);

    // Dispatch event to parent
    dispatch('requestJoin', { chatId, answers });

    showRequestModal[chatId] = false; 
    selectedChatId = null;
  }


  // Handle when the modal is closed (reset answers and close modal)
  function closeModal(chatId: number) {
      showRequestModal[chatId] = false; // Close the modal
      answers = { question1: '', question2: '', question3: '' }; // Reset input fields
      selectedChatId = null; // Reset selected chat after the modal closes
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
  <div class="chats-section">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="item" on:click={handleOpenChat}>
      <!-- <img src={"/src/lib/images/chat_icon.svg"} alt="Open Chat" class="item-icon" /> -->
      <span>Open Chat</span>
    </div>
  </div>

  <!-- Event Section -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="events-section">
    <h3>Events</h3>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="event-item" on:click={navigateToCommunityEvents}>
      <img src="{events}" alt="Community Event" class="event-icon" />
      <span>Community Event</span>
    </div>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="event-item" on:click={navigateToCommunityCalendar}>
      <img src="{events}" alt="Group Community Event" class="event-icon" />
      <span>Group Community Event</span>
    </div>
  </div>

  <!-- Group Chat Section -->
  {#if chats && chats.length > 0}
  <h3 class="group-title">Group Community</h3> 
    <div class="chats-section group-community-scroll">
      {#each chats as chat}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="item" on:click={() => handleChatClick(chat.id, chat.isPrivate, chat.hasJoined)}>
        <img src={chat.imageSrc} alt={chat.name} class="item-icon" />
        <div class="chat-info">
          <div class="chat-details">
            <span class="chat-name">{chat.name}</span>
            {#if !chat.hasJoined}
              <span class="request-join">Request to Join</span>
            {/if}
          </div>
          <span class="arrow-icon"></span>
        </div>
      </div>

      <!-- Modal for Request to Join -->
      {#if showRequestModal[chat.id]}
      <div class="modal-backdrop">
        <div class="modal">
            <div class="modal-header">
                <h2>Request to Join the Community: <strong>{chat.name}</strong></h2>
                <button class="close-btn" on:click={() => closeModal(chat.id)}>×</button>
              </div>
            <p>If you want to enter the Group Community, request to join first</p>
            <div class="modal-body">
                {#if chat.questions.field_pertanyaan_1}
                <div class="question-field">
                    <label for="question1">{chat.questions.field_pertanyaan_1}</label>
                    <input type="text" id="question1" bind:value={answers.question1} />
                </div>
                {/if}
                {#if chat.questions.field_pertanyaan_2}
                <div class="question-field">
                    <label for="question2">{chat.questions.field_pertanyaan_2}</label>
                    <input type="text" id="question2" bind:value={answers.question2} />
                </div>
                {/if}
                {#if chat.questions.field_pertanyaan_3}
                <div class="question-field">
                    <label for="question3">{chat.questions.field_pertanyaan_3}</label>
                    <input type="text" id="question3" bind:value={answers.question3} />
                </div>
                {/if}
            </div>
            <div class="modal-footer">
              <button class="submit-btn" on:click={() => handleRequestJoin(chat.id)}>Submit</button>
            </div>
        </div>
    </div>
    
      {/if}
      {/each}
    </div>
  {/if}
</div>

<style>
    .arrow-icon {
      margin-left: auto;
      font-size: 1.2rem; /* Adjust the size as needed */
      font-weight: bold; /* Make it bold to resemble an arrow */
      color: #000; /* Set the color, adjust as necessary */
      border: none;
      outline: none;
    }

    .arrow-icon:hover{
      color: #ff9000;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
    }

    .request-join {
      font-size: 0.75rem; /* Smaller font size for Request to Join */
      color: #8F8F8F; /* Gray color */
      cursor: pointer; /* Make it clear it's clickable */
    }
    .chat-info {
      display: flex;
      justify-content: space-between; /* Menyebarkan konten ke kedua ujung */
      align-items: center; /* Pusatkan item secara vertikal */
      width: 100%; /* Gunakan lebar penuh untuk mengakomodasi anak-anak */
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

    .group-title {
      padding-left: 16px;
      padding-bottom: 10px;
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

    .item-icon {
      width: 32px;
      height: 32px;
      margin-right: 10px;
    }

    .arrow-icon {
      float: right;
      width: 20px;
    }

    /* Modal-specific CSS */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 99999;
    }

    .modal {
      background: white;
      border-radius: 8px;
      padding: 20px;
      max-width: 400px;
      width: 100%;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      outline: none; 
    }
    .close-btn:hover {
      color: #ff9000; /* Contoh efek hover, bisa diubah sesuai keinginan */
    }


    .modal-body {
      margin-top: 20px;
    }

    .question-field {
      margin-bottom: 15px;
    }

    .question-field input {
      width: 100%;
      padding: 8px;
      font-size: 1rem;
      border-radius: 4px;
      border: 1px solid #ccc;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
    }

    .submit-btn {
      background-color: #FFA94D; /* Orange background */
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      border-radius: 24px;
    }

    .submit-btn:hover {
      background-color: #ff9000;
    }

    .modal-header h2 {
      font-size: 1.25rem;
      font-weight: bold; /* Bold text */
      text-align: center; /* Center the text */
      margin-bottom: 10px;
    }

    .modal p {
      text-align: center; /* Center the instruction text */
      margin-top: 10px;
    }

</style>
