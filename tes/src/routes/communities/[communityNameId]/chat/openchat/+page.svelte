<script lang="ts">
    import Chat from '$lib/component/Chat.svelte';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment'; // Menggunakan browser untuk pengecekan client-side
    import { getJwtToken, extractIdFromUrl, getUserId } from '$lib/js/utils'; // Updated imports

    let chatMessages = [];
    let currentUser = ''; // Ini akan di-set setelah fetch dari API
    let isLoading = true;
    let komunitasId = '';
    let idGroupChat = ''; // Id group chat yang akan digunakan untuk fetch pesan

    onMount(async () => {
        if (browser) {
            komunitasId = extractIdFromUrl(window.location.href); // Ekstrak komunitasId dari URL
            const userId = getUserId(); // Dapatkan user ID saat ini
            const token = getJwtToken();
            if (!token) {
                console.error('Token not found');
                isLoading = false;
                return;
            }

            try {
                // Fetch pertama untuk mendapatkan idGroupChat berdasarkan "Open Chat"
                const groupChatResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${komunitasId}/groupchat?page=0&pageSize=0`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const groupChatResult = await groupChatResponse.json();
                if (groupChatResult.status === 200) {
                    // Cari group chat yang mengandung "Open Chat"
                    const openChatGroup = groupChatResult.data.find(chat => chat.nama_group_chat.includes("Open Chat"));
                    
                    if (openChatGroup) {
                        idGroupChat = openChatGroup.id; // Set idGroupChat dengan hasil dari fetch
                    } else {
                        console.error('Open Chat group not found');
                        isLoading = false;
                        return;
                    }
                } else {
                    console.error('Failed to fetch group chats:', groupChatResult.message);
                    isLoading = false;
                    return;
                }

                // Fetch kedua untuk mendapatkan pesan berdasarkan idGroupChat
                const chatResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${komunitasId}/groupchat/${idGroupChat}/pesan?page=0&pageSize=0`, {
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
    <Chat {chatMessages} {currentUser} title="Open Chat" />
</div>
{/if}

<style>
  .chat {
    width: 100%;
  }
</style>
