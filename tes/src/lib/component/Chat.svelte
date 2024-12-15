<script lang="ts">
  import { getJwtToken, extractIdFromUrl, getAnggotaKomunitasId, getUserId } from '$lib/js/utils';
  import { onMount, tick } from 'svelte';
  import PollingCarousel from '$lib/component/PollingChat.svelte';

  export let chatMessages: Array<{ username: string, text: string, type: 'sent' | 'received' }> = [];
  export let currentUser: string;
  export let title: string = 'Open Chat';
  export let grupid = '1';

  let inputText = '';
  let showPollingCarousel = false;
  let sidebarCollapsed = false;
  let messagesContainer: HTMLDivElement;
  let polls: any[] = [];
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

  function navigateToPollingGroup() {
    const currentURL = window.location.href;
    window.location.href = `${currentURL}/CM_GroupCommunityPolling`; // Navigate to PollingGroup page
  }

  async function anggota_group_id(komunitasId: string | number | null, grupId: string, userId: string | null): Promise<number | null> {
  const token = getJwtToken(); 

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${komunitasId}/group/${grupId}/anggota?page=0&pageSize=0`, {
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
        anggota_group_id: id_anggota,
        user_id: Number(userId)
      });

      console.log(body);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${komunitasId}/group/${grupid}/pesan`, {
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
  async function fetchPolls() {
  try {
    const userId = getUserId();
    const komunitasId = extractIdFromUrl(window.location.href);
    const anggotaKomunitasId = await getAnggotaKomunitasId(komunitasId, userId);
    const token = getJwtToken();

    const pollResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${komunitasId}/group/${grupid}/polling?page=0&pageSize=0`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    const pollResult = await pollResponse.json();
    if (pollResult.status === 200) {
      polls = pollResult.data.map((poll: { polling_pilihan_group: any; id: any; pertanyaan: any; }) => {
        const pollingPilihan = Array.isArray(poll.polling_pilihan_group) ? poll.polling_pilihan_group : []; // Pastikan polling_pilihan adalah array
        const userHasVoted = pollingPilihan.some(pilihan => 
          pilihan.polling_pilihan_detail?.some((detail: { anggota_komunitas_id: any; }) => detail.anggota_komunitas_id === anggotaKomunitasId)
        );
        return {
          id: poll.id,
          question: poll.pertanyaan,
          options: pollingPilihan.map(option => ({
            id: option.id,
            text: option.jawaban,
            votes: option.jumlah_menjawab
          })),
          hasVoted: userHasVoted
        };
      });
    } else {
      console.error("Gagal mendapatkan polling:", pollResult.message);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}


  async function submitVote(event: { detail: { selectedOption: any; pollId: any; }; }) {
    const { selectedOption, pollId } = event.detail;

    const token = getJwtToken();
    const userId = getUserId();
    const anggotaKomunitasId = await getAnggotaKomunitasId(komunitasId, userId);

    if (!selectedOption || !anggotaKomunitasId) {
      console.error("Missing selected option or anggota_komunitas_id.");
      return;
    }

    let id_anggota = await anggota_group_id(komunitasId, grupid, userId);
    const voteData = {
      polling_pilihan_group_id: selectedOption,
      anggota_group_id: id_anggota
    };
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    try {
      const response = await fetch(`${baseUrl}/v1/users/pollingpilihandetailgroup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(voteData)
      });

      const result = await response.json();

      if (result.status === 200) {
        polls = polls.map(poll => {
          if (poll.id === pollId) {
            return {
              ...poll,
              options: poll.options.map((option: { id: any; votes: number; }) =>
                option.id === selectedOption ? { ...option, votes: option.votes + 1 } : option
              ),
              hasVoted: true
            };
          }
          return poll;
        });
      } else {
        console.error("Failed to submit vote:", result.message);
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  }

  onMount(async () => {
    await fetchPolls();
    // console.log(komunitasId);
    komunitasId = extractIdFromUrl(window.location.href);
    const showPollingIcon = currentUser.includes('Management');

    scrollToBottom();
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="chat-container {sidebarCollapsed ? 'expanded' : ''}" bind:this={messagesContainer}>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
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
    <div class="polling-container">
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
<button class="file-icon" on:click={navigateToPollingGroup}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path fill="none" stroke="currentColor" stroke-width="2" d="M6 2L6 22M18 2L18 22" />
      </svg>
    </button>
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
      top: 60px;
      bottom: 0;
      background-color: #f5f5f5;
      border: 1px solid #ddd;
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
  