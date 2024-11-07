<script lang="ts">
  import Chat from '$lib/component/Chat.svelte';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { getJwtToken, extractIdFromUrl, getUserId } from '$lib/js/utils';

  let chatMessages = [];
  let currentUser = ''; 
  let isLoading = true;
  let komunitasId = '';
  let idChat = '';
  let groupName = ''; // Variable to store the group name

  // Fungsi untuk mengekstrak `idChat` dari URL
  function extractChatIdFromUrl(url: string): string | null {
    const match = url.match(/\/chat\/(\d+)/);
    return match ? match[1] : null;
  }

  onMount(async () => {
    if (browser) {
      komunitasId = extractIdFromUrl(window.location.href); // Extract komunitasId
      idChat = extractChatIdFromUrl(window.location.href); // Extract idChat
      const userId = getUserId(); // Get current user's ID
      const token = getJwtToken();
      
      if (!token) {
        console.error('Token not found');
        isLoading = false;
        return;
      }

      if (!idChat) {
        console.error('Chat ID not found');
        isLoading = false;
        return;
      }

      try {
        // Fetch group name
        const groupResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${komunitasId}/group/${idChat}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const groupResult = await groupResponse.json();
        if (groupResult.status === 200 && groupResult.data && groupResult.data.GroupKomunitas) {
          groupName = groupResult.data.GroupKomunitas.nama_group_komunitas; // Set the group name
        } else {
          console.error('Failed to fetch group name:', groupResult.message);
        }

        // Fetch chat messages
        const chatResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${komunitasId}/group/${idChat}/pesan?page=0&pageSize=0`, { 
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const chatResult = await chatResponse.json();
        if (chatResult.status === 200) {
          chatMessages = chatResult.data.map(message => ({
            username: message.AnggotaKomunitas.User.username,
            id: message.id,
            text: message.isi,
            type: message.AnggotaKomunitas.User.id === Number(userId) ? 'sent' : 'received'
          }));
          console.log('Chat messages set:', chatMessages);
        } else {
          console.error('Failed to fetch messages:', chatResult.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        isLoading = false;
      }
    }
  });
</script>

{#if isLoading}
  <div>Loading chat...</div>
{:else}
  <div class="chat">
    <Chat {chatMessages} {currentUser} title={groupName} />
  </div>
{/if}
<style>
  
</style>
