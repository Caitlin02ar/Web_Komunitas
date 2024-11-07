<script lang="ts">
    //@ts-nocheck
    import Chat from '$lib/component/Chat.svelte';
    import { onMount } from 'svelte';
    import { getJwtToken, extractIdFromUrl } from '$lib/js/utils'; // Assuming these are in your utils
    import { browser } from '$app/environment'; // To check if running in the browser

    let chatMessages = [];
    let currentUser = ''; // This will be set after fetching from the API
    let isLoading = true;
    let komunitasId = '';

    onMount(async () => {
        if (browser) {
            console.log('Fetching user and chat data...');
            komunitasId = extractIdFromUrl(window.location.href); // Extract komunitasId from the URL

            const token = getJwtToken();
            if (!token) {
                console.error('Token not found');
                isLoading = false;
                return;
            }

            try {
                // Fetch the current user's data
                const userResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/user/1`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const userResult = await userResponse.json();
                if (userResult.status === 200) {
                    currentUser = userResult.data.username;
                    console.log('Current user:', currentUser);
                } else {
                    console.error('Failed to fetch current user:', userResult.message);
                }

                // Fetch group chat messages
                const chatResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${komunitasId}/groupchat/1/pesan?page=0&pageSize=0`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const chatResult = await chatResponse.json();
                if (chatResult.status === 200) {
                    chatMessages = chatResult.data.map(message => ({
                        id: message.id,
                        username: message.AnggotaKomunitas.User.username,
                        text: message.isi,
                        type: message.AnggotaKomunitas.User.username === currentUser ? 'sent' : 'received'
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
  
</style>
