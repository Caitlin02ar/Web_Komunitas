<script lang="ts">
    import "../app.css";
    import Navbar from '$lib/component/Navbar.svelte';
    import Sidebar from '$lib/component/Sidebar.svelte';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { page } from '$app/stores';
    import { getJwtToken, getUserId } from '$lib/js/utils';

    export let open = writable(false);

    let isSpecialPage = false;
    let currentRoute = '';
    let src = '';
    let communityData = writable({
      myCommunities: []
    });

    onMount(async () => {
        const path = $page.url.pathname;
        currentRoute = path;
        isSpecialPage = path === '/' || path === '/login' || path === '/signUp' || path === '/forgot';

        if (!isSpecialPage) {
            open.set(true);
            const token = getJwtToken();
            const userId = getUserId();

            if (token && userId) {
                const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/userparticipant/${userId}`;
        
                try {
                    const response = await fetch(apiUrl, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
        
                    if (response.ok) {
                        const result = await response.json();

                        const communities = result.data.AnggotaKomunitas.map(community => ({
                            name: community.Komunitas.nama_komunitas,
                            id: community.Komunitas.id,
                            imageSrc: `${import.meta.env.VITE_API_BASE_URL}/getfoto?path=${community.Komunitas.gambar_komunitas}`
                        }));

                        communityData.set({
                            myCommunities: communities
                        });
                    } else {
                        console.error('Failed to fetch communities:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error fetching communities:', error);
                }
            }

            if (userId){
                const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/user/${userId}`;
        
                try {
                    const response = await fetch(apiUrl, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const result = await response.json();

                        src = `${import.meta.env.VITE_API_BASE_URL}/getfoto?path=${result.data.foto_profile}`;
                    } else {
                        console.error('Failed to fetch communities:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error fetching communities:', error);
                }
                    }
                }
    });
</script>

{#if !isSpecialPage}
    <div class="layout">
        <Sidebar bind:open={$open} myCommunities={$communityData.myCommunities} {currentRoute} />
        <div class="content-wrapper { $open ? 'shifted' : '' }">
            <Navbar bind:sidebar={$open} src={src}/>
            <div class="main-content content-applied">
                <slot />
            </div>
        </div>
    </div>
{:else}
    <div class="special-layout">
        <slot />
    </div>
{/if}

<svelte:head>
    <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet" />
</svelte:head>

<style>
    .layout {
	   display: flex;
       
	}

    .content-wrapper {
	   flex-grow: 1;
	   transition: margin-left 0.3s ease-in-out;
	}
 
	.main-content.content-applied {
	   margin-left: 50px;
	   transition: margin-left 0.3s ease-in-out;
	}
 
	:global(body) {
	   padding: 0;
	   background-color: #FBFAF9;
	}
</style>
