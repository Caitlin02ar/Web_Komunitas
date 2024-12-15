<script lang="ts">
    import { getJwtToken, extractIdFromUrl, getAnggotaKomunitasId, getUserId } from '$lib/js/utils';
    import { onMount, tick } from 'svelte';
    import PollingCarousel from '$lib/component/PollingChat.svelte';
  
    export let chatMessages: Array<{ username: string, text: string, type: 'sent' | 'received' }> = [];
    export let currentUser: string;
    export let title: string = 'Open Chat';
    export let grupid = '1';
    export let subgroupid = '1';

    let inputText = '';
    let showPollingCarousel = false;
    let sidebarCollapsed = false;
    let messagesContainer: HTMLDivElement;
    let polls = [];
    let komunitasId = '';
    let anggotaKomunitasId = 0;
    let showPollingContainer = false; 
    let btn_submit_vote = '';
  
    function toggleSidebar() {
      sidebarCollapsed = !sidebarCollapsed;
    }
  
    function togglePollingContainer() {
      showPollingContainer = !showPollingContainer; // Toggle visibilitas polling-container
    }
  
    function navigateToDetail() {
      const currentURL = window.location.href;
      window.location.href = `${currentURL}/detail`; // Mengarahkan ke halaman detail
    }
  
    async function anggota_group_id(komunitasId, grupId, userId): Promise<number | null> {
    const token = getJwtToken(); 
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${komunitasId}/group/${grupId}/subgroup/${subgroupid}/anggota?page=0&pageSize=0`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      const result = await response.json();
  
      if (result.status === 200 && Array.isArray(result.data)) {
        const anggota = result.data.find((item: any) => item.user_id === Number(userId));
  
        if (anggota) {
          return anggota.id; 
        } else {
          console.error(`Anggota dengan user_id ${userId} tidak ditemukan dalam grup.`);
          return null;
        }
      } else {
        console.error(`Gagal mendapatkan data anggota grup. Pesan: ${result.message}`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching anggota group ID:', error);
      return null;
    }
  }
  
    async function sendMessage() {
      if (inputText.trim() !== '') {
        const komunitasId = extractIdFromUrl(window.location.href);
        const userId = getUserId();
        const anggotaKomunitasId = await getAnggotaKomunitasId(komunitasId, userId);
        const token = getJwtToken();
        let id_anggota = await anggota_group_id(komunitasId, grupid, userId);
  
        const body = JSON.stringify({
          isi: inputText,
          anggota_subgroup_id: id_anggota,
          user_id: Number(userId)
        });
  
        console.log(body);
  
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${komunitasId}/group/${grupid}/subgroup/${subgroupid}/pesan`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: body
          });
  
          const result = await response.json();
          if (response.ok) {
            chatMessages.push({
              username: currentUser,
              text: inputText,
              type: 'sent'
            });
            inputText = '';
            await scrollToBottom();
            window.location.href;
          } else {
            console.error('Failed to send message:', result.message);
          }
        } catch (error) {
          console.error('Error sending message:', error);
        }
      }
    }
  
    async function scrollToBottom() {
      await tick();
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
  
    
    onMount(async () => {
      // console.log(komunitasId);
      komunitasId = extractIdFromUrl(window.location.href);
  
      scrollToBottom();
    });
  

	function submitVote(e: CustomEvent<any>): void {
		throw new Error('Function not implemented.');
	}
</script>
  
  <div class="chat-container {sidebarCollapsed ? 'expanded' : ''}" bind:this={messagesContainer}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <header class="chat-header" on:click={navigateToDetail}>
      <button class="back-btn" aria-label="Back" on:click={toggleSidebar}>
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      <div class="chat-title">
        <span class="chat-avatar">C</span>
        <span>{title}</span>
      </div>
    </header>
  
    <div class="messages-container">
      {#if polls && polls.length > 0}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="polling-container">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="poll-dropdown" on:click={togglePollingContainer}>
          <span>Polling Options</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            class:rotated={showPollingContainer}
            style="transition: transform 0.3s ease;"
          >
            <path fill="none" stroke="black" stroke-width="2" d="M6 9l6 6 6-6" />
          </svg>
        </div>
      
        {#if showPollingContainer}
          <div class="poll-content">
            {#if polls && polls.length > 0}
            <PollingCarousel {polls} submitButtonColor={btn_submit_vote} on:submitVote={submitVote} />
            {/if}
          </div>
        {/if}
      </div>
      {/if}
    
      {#each chatMessages as message (message.id)}
        <div class="message {message.type}">
          <span class="username" class:received={message.type === 'received'}>
            {message.username}
          </span>
          <div class="message-text">
            {message.text}
          </div>
        </div>
      {/each}
    </div>
    
  
    <div class="input-container">
      <input
        type="text"
        placeholder="Type your message here..."
        bind:value={inputText}
        on:keypress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button on:click={sendMessage}>
        <svg class="send-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M2 21v-6l15-3-15-3v-6l20 9z"/>
        </svg>
      </button>
    </div>
  </div>
  
    
    <style>
      .chat-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        top: 60px; /* Adjust this to match the height of your navbar */
        bottom: 0;
        background-color: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
    
      .chat-header {
        display: flex;
        align-items: center;
        height: 50px; /* Set a fixed height */
        padding: 0 10px; /* Adjust as needed */
        background-color: #e0e0e0;
        border-bottom: 1px solid #ddd;
        width: 100%;
        box-sizing: border-box; 
      }
    
      .back-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0 10px;
      }
    
      .icon {
        width: 24px;
        height: 24px;
      }
    
      .polling-toggle {
      padding: 10px;
      text-align: center;
    }
  
      .chat-title {
        display: flex;
        align-items: center;
        flex: 1;
        margin-left: 10px; /* Adjust space between back button and title */
      }
    
      .polling-container {
        position: fixed; /* Posisi tetap di atas layar */
        top: 0; /* Jarak dari bagian atas layar */
        left: 0; /* Jarak dari bagian kiri layar */
        width: 100%; /* Lebar penuh */
        z-index: 1000; /* Pastikan berada di atas elemen lainnya */
        background-color: white; /* Tambahkan background agar kontras */
        border-bottom: 1px solid #ddd; /* Tambahkan garis bawah untuk membedakan */
        padding: 10px; /* Padding untuk estetika */
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Tambahkan bayangan */
      }
  
  
      .chat-avatar {
        width: 32px;
        height: 32px;
        background-color: #ccc;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
        font-weight: bold;
      }
    
      .messages-container {
        flex: 1;
        padding: 10px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        box-sizing: border-box;
        min-height: 73vh;
        max-height: 73vh;
      }
    
      .message {
        display: flex;
        flex-direction: column;
        max-width: 70%;
        padding: 8px;
        border-radius: 15px;
        word-wrap: break-word;
      }
    
      .message.sent {
        align-self: flex-end;
        background-color: #72a1b9;
        color: white;
      }
    
      .message.received {
        align-self: flex-start;
        background-color: #ddd;
      }
    
      .message .username {
        font-size: 0.8rem;
        margin-bottom: 5px;
      }
    
      .username.received {
        color: #ff6767;
      }
    
      .input-container {
      position: sticky;
      bottom: 0;
      display: flex;
      align-items: center;
      padding: 10px;
      background-color: #e0e0e0;
      border-top: 1px solid #ddd;
      width: 100%;
      box-sizing: border-box;
    }
    
      .input-container input {
        flex: 1;
        padding: 10px;
        border: none;
        border-radius: 20px;
        background-color: white;
        outline: none;
        margin-right: 10px;
        width: 100%;
        box-sizing: border-box;
      }
    
      .input-container button {
        background-color: #72a1b9;
        border: none;
        border-radius: 50%;
        padding: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    
      .send-icon {
        fill: white;
        width: 24px;
        height: 24px;
      }
  
      .polling-toggle {
    padding: 10px;
    text-align: center;
    background-color: #f5f5f5; /* Tambahkan background */
    z-index: 10; /* Pastikan berada di atas elemen lainnya */
    position: relative; /* Agar properti z-index berfungsi */
  }
  
  .polling-container {
    position: sticky; /* Posisi tetap saat scroll */
    top: 0; /* Jarak dari bagian atas layar */
    z-index: 1000; /* Pastikan berada di atas elemen lainnya */
    background-color: white; /* Tambahkan background agar kontras */
    border-bottom: 1px solid #ddd; /* Tambahkan garis bawah untuk membedakan */
    padding: 10px; /* Padding untuk estetika */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Tambahkan bayangan */
  }
  
    </style>
    