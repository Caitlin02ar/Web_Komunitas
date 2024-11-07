<script lang="ts">
    //@ts-nocheck
    import { goto } from '$app/navigation';
    import SidebarChat from '$lib/component/SidebarChatSubCM.svelte';
    import { getJwtToken, extractIdFromUrl } from '$lib/js/utils'; 
    import { onMount } from 'svelte'; 
    import Loading from '$lib/component/Loading.svelte';

    let subgroupcommunityName = "";
    let chats = [];
    let isLoading = true;

    let actions = [
        { text: 'Group Community Info', onClick: () => navigateTo('CM_SubGroupCommunityInfo') },
        { text: 'Manage Member', onClick: () => navigateTo('CM_SubGroupCommunityMember') }
    ];

    function navigateTo(target) {
        const currentUrl = window.location.pathname;
        // Navigate to the current path + the target
        goto(`${currentUrl}/${target}`);
    }
    // Fetch community and group data from the API
    async function fetchCommunityData() {
        const token = getJwtToken();
        const SubGroupcommunityId = extractIdFromUrl(window.location.href);  // This assumes extractIdFromUrl correctly extracts the ID
        const communityId = extractIdFromUrl(window.location.href); // Adjust as necessary for community ID extraction
        console.log(SubGroupcommunityId);
        
        try {
            // Fetch group community data
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/admin/subgroupkomunitas/${SubGroupcommunityId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            const result = await response.json();
            console.log('Full API Response:', result); // Log full response for debugging

            if (response.ok && result.status === 200) {
                subgroupcommunityName = result.data.nama_subgroup_komunitas;
                console.log('Group Community Name:', subgroupcommunityName); // Verify the assignment
            } else {
                console.error('Failed to fetch group community data:', result.message);
            }

            // Fetch subgroup data
            const subgroupResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${communityId}/group/${SubGroupcommunityId}/subgroup?page=0&pageSize=0`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            const subgroupResult = await subgroupResponse.json();

            if (subgroupResponse.ok) {
                chats = subgroupResult.data.map(subgroup => ({
                    id: subgroup.id,
                    name: subgroup.nama_subgroup_komunitas,
                    imageSrc: `${import.meta.env.VITE_API_BASE_URL}/${subgroup.foto}`,  // Ensure correct image path
                }));
            } else {
                console.error('Failed to fetch subgroup data');
            }
        } catch (error) {
            console.error('Error in fetching data:', error);
        } finally {
            isLoading = false;
        }
    }

    onMount(() => {
        fetchCommunityData();  // Call the API when the component is mounted
    });
</script>

<!-- Render the SidebarChat component and pass the data as props -->
<div class="page-container">
    {#if isLoading}
        <Loading /> <!-- Show loading component while data is being fetched -->
    {:else if subgroupcommunityName && chats.length}
        <div class="sidebar-container">
            <SidebarChat {subgroupcommunityName} {chats} {actions} /> <!-- Pass data to SidebarChat component -->
        </div>
    {/if}
    <div class="chat-container">
        <main>
            <slot />
        </main>
    </div>
</div>

<style>
/* Global settings for body to ensure full-height layout and prevent overflow issues */
:global(body, html) {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow-x: hidden; /* Prevent horizontal overflow */
}

/* Main container for your application */
.page-container {
    display: flex;
    background-color: #f9f9f9;
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    position: relative;
}

/* Sidebar styling with fixed positioning to overlay on top of other content */
.sidebar-container {
    position: fixed; /* Use fixed to ensure it does not move on content scroll */
    width: 300px;
    background-color: #fff;
    height: 100vh;
    z-index: 150; /* Higher z-index to ensure it is above main content */
    box-shadow: 2px 0 5px rgba(0,0,0,0.1); /* Adds shadow for better visibility */
    transform: translateX(0);
    margin-left: -300px; /* Adjust based on layout needs */
}

/* Main content area */
.chat-container {
    flex-grow: 1;
    overflow-y: auto;
    padding: 20px; /* Optional padding for content */
}

/* Ensure all images and icons within the sidebar do not overflow */
.sidebar-container img {
    max-width: 100%;
    height: auto;
}

/* Optional: Transition for smooth sliding effect */
.sidebar-container {
    transition: transform 0.3s ease-in-out;
}
</style>
