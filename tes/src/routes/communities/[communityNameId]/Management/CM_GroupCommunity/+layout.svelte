<script lang="ts">
    //@ts-nocheck
    import SidebarChat from '$lib/component/SidebarChatCM.svelte';
    import { getJwtToken, extractIdFromUrl } from '$lib/js/utils'; 
    import { onMount } from 'svelte'; // Import the onMount function
    import Loading from '$lib/component/Loading.svelte';
    import { page } from '$app/stores'; 
	import Chat from '$lib/component/Chat.svelte';

    let communityName = "";
    let chats = [];
    let isLoading = true;
    let displaySidebarChat = true;
    const communityId = extractIdFromUrl(window.location.href);
    // Fetch community and group data from the API
    async function fetchCommunityData() {
    const token = getJwtToken();

    if (typeof window !== 'undefined') {
        const communityId = extractIdFromUrl(window.location.href); 
        console.log("Komunitas ID:", communityId); // Pastikan ID komunitas benar

        // Fetch community name
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${communityId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            const result = await response.json();
            console.log("Community API Response:", result); // Tambahkan log di sini untuk melihat data

            if (response.ok) {
                communityName = result.data.Komunitas.nama_komunitas;
            } else {
                console.error('Failed to fetch community data');
            }
        } catch (error) {
            console.error('Error fetching community data:', error);
        }

        // Fetch group data (sub-groups)
        try {
            const groupResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${communityId}/group?page=0&pageSize=0`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            const groupResult = await groupResponse.json();
            console.log("Group API Response:", groupResult); // Tambahkan log di sini untuk melihat data grup

            if (groupResponse.ok) {
                chats = groupResult.data.map(group => ({
                    id: group.id,
                    name: group.nama_group_komunitas,
                    imageSrc: `${import.meta.env.VITE_API_BASE_URL}/${group.foto}`, 
                }));
            } else {
                console.error('Failed to fetch group data', groupResult.message);
            }
        } catch (error) {
            console.error('Error fetching group data:', error);
        }

        // Set loading to false after fetching data
        isLoading = false;
    }
}


    // Use onMount to fetch the data when the component is mounted on the client
    onMount(() => {
        fetchCommunityData();
    });

    $: displaySidebarChat = !$page.url.pathname.includes(`/communities/${$page.params.communityNameId}/Management/CM_GroupCommunity/CM_GroupCommunityHome`);
    $: console.log("Display Sidebar Chat:", displaySidebarChat, "Current Path:", $page.url.pathname);
</script>

<!-- Render the SidebarChat component and pass the data as props -->
<div class="page-container">
    {#if isLoading}
        <Loading />
    {:else if communityName && displaySidebarChat}
        <div class="sidebar-container">
            <SidebarChat {communityName} {chats} />
        </div>
    {/if}
    <div class="chat-container">
        <main>
            <slot />
        </main>
    </div>
</div>


 
<style>
    :global(html, body) {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden; 
  }
    .page-container {
    display: flex;
    justify-content: flex-start;
    background-color: #f9f9f9;
    width: 100vw; /* Take full width */
    height: 100vh; /* Take full height */
    box-sizing: border-box;
    /* margin-top: -36; */
}

.sidebar-container {
    width: 300px; /* Fixed width for sidebar */
    background-color: #fff;
    border-right: 1px solid #ddd;
    height: 100%;
    overflow-y: auto;
    margin-left: -40px;
    box-sizing: border-box; /* Ensure padding and borders are included in element's total width and height */
    margin-top: -36px;
    overflow: visible;
}

.chat-container {
        flex-grow: 1; /* Take remaining space after sidebar */
        max-width: calc(100vw - 300px); /* Ensure chat container doesn't overflow */
        background-color: #f0f0f0;
        height: calc(100% - 36px); /* Adjust height to account for margin-top */
        margin-top: -36px; /* Negative margin for chat container */
        overflow-y: auto; /* Enable vertical scrolling */
       
        box-sizing: border-box;
    }

    /* Remove any negative margins to fix layout issues */


</style>
