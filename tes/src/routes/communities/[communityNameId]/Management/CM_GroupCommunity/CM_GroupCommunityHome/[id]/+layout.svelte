<script>
    // @ts-nocheck
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation'; 
    import SidebarChatGCCM from '$lib/component/SidebarChatGCCM.svelte';
    import { getJwtToken, extractIdFromUrl } from '$lib/js/utils';
    import Loading from '$lib/component/Loading.svelte';

    let groupcommunityName = "";
    let chats = [];
    let isLoading = true;
    let displaySidebarChat = true;
    let groupid = null;
    
    let actions = [
        { text: 'Group Community Info', onClick: () => navigateTo('CM_GroupCommunityInfo') },
        { text: 'Manage Member', onClick: () => navigateTo('CM_GroupCommunityMember') }
    ];

    // Extract the groupid from URL
    onMount(() => {
        const urlParts = window.location.pathname.split('/');
        groupid = urlParts[urlParts.length - 1];  // Ambil bagian terakhir dari URL (groupid)
        const communityId = extractIdFromUrl(window.location.href);
        fetchCommunityData(communityId, groupid);
    });

    // Reactive check for URL change using SvelteKit's $page store
    $: displaySidebarChat = !$page.url.pathname.includes('CM_SubGroupCommunity');
    $: console.log("Sidebar Display:", displaySidebarChat, "Current Path:", $page.url.pathname);

    // Navigation function to dynamically add a path
    function navigateTo(target) {
        const currentUrl = $page.url.pathname;
        goto(`${currentUrl}/${target}`);
    }

    async function fetchCommunityData(communityId, groupid) {
        isLoading = true;
        const token = getJwtToken();

        try {
            // Fetch community data
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/admin/groupkomunitas/${communityId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (response.ok) {
                const result = await response.json();
                groupcommunityName = result.data.nama_group_komunitas;

                // Fetch subgroup data
                const subgroupResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${communityId}/group/${groupid}/subgroup?page=0&pageSize=0`, {
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
                        imageSrc: `${import.meta.env.VITE_API_BASE_URL}/${subgroup.foto}`,
                    }));
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            isLoading = false;
        }
    }
</script>

    
    <!-- UI Layout -->
    <div class="page-container">
        {#if isLoading}
            <Loading />
        {:else if groupcommunityName && chats.length && displaySidebarChat}
            <div class="sidebar-container">
                <SidebarChatGCCM {groupcommunityName} {chats} {actions} />
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
        overflow-x: hidden;
    }
    
    /* Main container for your application */
    .page-container {
        display: flex;
        background-color: #f9f9f9;
        width: 100vw;
        height: 100vh;
        box-sizing: border-box;
        position: relative;
        margin-left: -40px;
    }
    
    /* Sidebar styling with fixed positioning to overlay on top of other content */
    .sidebar-container {
        position: fixed;
        width: 300px;
        background-color: #fff;
        height: 100vh;
        z-index: 150;
        box-shadow: 2px 0 5px rgba(0,0,0,0.1);
        transform: translateX(0);
    }
    
    /* Main content area */
    .chat-container {
        margin-left: 300px;
        flex-grow: 1;
        overflow-y: auto;
    }
    </style>
    