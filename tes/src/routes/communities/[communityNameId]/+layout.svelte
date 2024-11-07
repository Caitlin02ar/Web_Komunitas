<script lang="ts">
  import ButtonBack from '$lib/component/ButtonBack.svelte';
  import CommunitySidebar from '$lib/component/CommunitySidebar.svelte';
  import CommunityProfile from '$lib/component/CommunityProfile.svelte';
  import CreatePost from '$lib/component/CreatePost.svelte';
  import LeaveCommunityModal from '$lib/component/LeaveCommunityModal.svelte';
  import ModalRequestJoin from '$lib/component/ModalRequestJoin.svelte';
  import { extractIdFromUrl, getJwtToken, getUserId, getAnggotaKomunitasId, getTheme } from '$lib/js/utils'; 
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let openChatImageSrc = ''; 
  let showModal = false;
  let showLeaveModal = false;
  let showRequestJoinModal = false;
  let komunitasId = '';
  let communityName = '';
  let communityData = null;
  let communityDataRules = {
    rules: [],
    groupCommunities: [],
    events: []
  };

  let hideSidebar = false;
  let hideBack = false;
  let HideCommunityProfile = false;
  let isMember = false; 
  let btn_community_schedule_color = "";
  let btn_community_event_color = "";
  let btn_submit_vote = ''; 


  // Check if the current page is a management page or openchat page
  $: {
    const pathname = $page.url.pathname;
    hideSidebar = pathname.includes('/Management') || pathname.includes('/chat') || pathname.includes('/events');
    hideBack = pathname.includes('/Management') || pathname.includes('/chat');
    HideCommunityProfile =  pathname.includes('/Management') || pathname.includes('/events') || pathname.includes('/calendar') || pathname.includes('/chat')
  }

  // Fetch the community data on mount
  onMount(async () => {
    await fetchCommunityData();
    
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const token = getJwtToken();
    const userId = getUserId();
    komunitasId = extractIdFromUrl(window.location.href);

    if (!token) {
      console.error('Token not found');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/v1/users/komunitas/${komunitasId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.status === 200) {
        const komunitas = result.data.Komunitas;
        communityName = komunitas.nama_komunitas || 'No Name';
        btn_submit_vote = komunitas.Theme.btn_submit_vote;

        const anggotaResponse = await fetch(`${baseUrl}/v1/users/komunitas/${komunitasId}/anggota?page=0&pageSize=0`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const anggotaResult = await anggotaResponse.json();
        if (anggotaResult.status === 200) {
          const anggotaData = anggotaResult.data.find(anggota => anggota.user_id === Number(userId));
          if (anggotaData) {
            communityData = {
              imageSrc: `${baseUrl}/getfoto?path=${komunitas.gambar_komunitas}` || '/src/lib/images/default_image.png',
              name: komunitas.nama_komunitas || 'No Name',
              members: komunitas.jumlah_anggota || 0,
              tags: komunitas.subkategori_mm_komunitas.map(sub => sub.sub_kategori.nama_subkategori) || [],
              description: komunitas.deskripsi_komunitas || 'No Description',
              status: 'joined',
              admin: anggotaData.Role.nama_roles !== 'Member' ? 'yes' : 'no',
              warna_create_post: komunitas.Theme.btn_create_post,
              warna_hover_create_post: komunitas.Theme.btn_hover_create_post,
              warna_tag: komunitas.Theme.label_subcategory,
            };
          } else {
            const requestResponse = await fetch(`${baseUrl}/v1/users/komunitas/${komunitasId}/requestanggota?page=0&pageSize=0`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });

            const requestResult = await requestResponse.json();
            if (requestResult.status === 200) {
              const isRequested = requestResult.data.find(request => request.user_id === Number(userId));
              communityData = {
                imageSrc: `${baseUrl}/getfoto?path=${komunitas.gambar_komunitas}` || '/src/lib/images/default_image.png',
                name: komunitas.nama_komunitas || 'No Name',
                members: komunitas.jumlah_anggota || 0,
                tags: komunitas.subkategori_mm_komunitas.map(sub => sub.sub_kategori.nama_subkategori) || [],
                description: komunitas.deskripsi_komunitas || 'No Description',
                status: isRequested ? 'requested' : komunitas.status_privasi === 'Public' ? 'public' : 'private',
                admin: 'no',
                warna_create_post: komunitas.Theme.btn_create_post,
                warna_hover_create_post: komunitas.Theme.btn_hover_create_post,
                warna_tag: komunitas.Theme.label_subcategory,
              };
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });

  async function fetchCommunityData() {
    const communityId = extractIdFromUrl(window.location.href);
    const token = getJwtToken();
    const userId = getUserId();
    const anggotaKomunitasId = await getAnggotaKomunitasId(communityId, userId);
    isMember = anggotaKomunitasId !== null;

    if (communityId && token) {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/sidebarkomunitas/${communityId}`;
      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (response.ok) {
          const result = await response.json();
          if (result.status === 200) {
            const Theme = await getTheme(communityId);
            if (Theme) {
              btn_community_schedule_color = Theme.btn_community_schedule || "#FFA959";
              btn_community_event_color = Theme.btn_community_event || "#7AB2B2";
            }

            if (result.data.ChatKomunitas && result.data.ChatKomunitas.length > 0) {
              openChatImageSrc = `${import.meta.env.VITE_API_BASE_URL}/getfoto?path=${result.data.ChatKomunitas[0].foto}`;
            }

            communityDataRules = {
              rules: result.data.Rules.map(rule => ({
                title: rule.judul,
                content: rule.deskripsi
              })),
              groupCommunities: result.data.GroupKomunitas.map(group => ({
                name: group.nama_group_komunitas,
                imageSrc: `${import.meta.env.VITE_API_BASE_URL}/getfoto?path=${group.foto}`
              })),
              events: result.data.Event.map(event => ({
                name: event.nama_event,
                imageSrc: `${import.meta.env.VITE_API_BASE_URL}/getfoto?path=${event.foto}`
              }))
            };
          }
        } else {
          console.error('Failed to fetch community data');
        }
      } catch (error) {
        console.error('Error fetching community data:', error);
      }
    }
  }

  function handleCreatePost() {
    showModal = true;
  }

  function closeCreatePost() {
    showModal = false;
  }

  function openRequestJoinModal() {
    showRequestJoinModal = true;
  }

  function closeRequestJoinModal() {
    showRequestJoinModal = false;
  }

  async function handleJoinDirectly() {
    const token = getJwtToken();
    const userId = getUserId();
    const requestData = {
      user_id: Number(userId),
    };
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${komunitasId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        communityData.status = 'joined';
        location.reload();
      } else {
        console.error('Failed to join community:', response.statusText);
      }
    } catch (error) {
      console.error('Error joining community:', error);
    }
  }

  function handleLeaveCommunity() {
    showLeaveModal = true;
  }

  function closeLeaveModal() {
    showLeaveModal = false;
  }

  async function confirmLeaveCommunity() {
    const token = getJwtToken();
    const communityId = extractIdFromUrl(window.location.href);

    try {
      const anggotaKomunitasId = await getAnggotaKomunitasId(communityId, getUserId());
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${communityId}/anggota/delete/${anggotaKomunitasId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        showLeaveModal = false;
        goto(`/communities/${communityData.name.replace(/\s+/g, '-').toLowerCase()}-${communityId}`).then(() => {
          window.location.reload();
        });
      } else {
        console.error('Failed to leave community.');
      }
    } catch (error) {
      console.error('Error leaving community:', error);
    }
  }
</script>


<!-- Show the ButtonBack only if not in any path under /Management or /openchat -->
{#if !hideBack}
  <ButtonBack href="/communities" text="Back" />
{/if}

<div class="page">
  <!-- Community Profile always takes full width -->
  {#if communityData && !HideCommunityProfile}
    <CommunityProfile 
      {communityData} 
      on:createPost={handleCreatePost}
      on:leaveCommunity={handleLeaveCommunity}
      on:requestJoin={openRequestJoinModal}
      on:joinDirectly={handleJoinDirectly}
    />
  {/if}

  <!-- Wrapper for Sidebar and Content -->
  <div class="content-wrapper" class:is-sidebar-active={communityData && !hideSidebar}>
    <!-- Sidebar Section -->
    {#if communityData && !hideSidebar}
      <CommunitySidebar
        rules={communityDataRules.rules}
        groupCommunities={communityDataRules.groupCommunities}
        events={communityDataRules.events}
        openChatImageSrc={openChatImageSrc}  
        isMember={isMember}
        btn_community_schedule_color={btn_community_schedule_color}
        btn_community_event_color={btn_community_event_color}
      />
    {/if}

    <!-- Content Section - Slot will always display -->
    <div class="content">
      <slot />
    </div>
  </div>

  <!-- Modals -->
  {#if showModal}
    <div class="modal-overlay" on:click={closeCreatePost}></div>
    <CreatePost on:close={closeCreatePost} on:submit={handleSubmitPost} />
  {/if}

  {#if showLeaveModal}
    <div class="modal-overlay" on:click={closeLeaveModal}></div>
    <LeaveCommunityModal 
      on:close={closeLeaveModal} 
      on:confirmLeave={confirmLeaveCommunity} 
    />
  {/if}

  {#if showRequestJoinModal}
    <div class="modal-overlay" on:click={closeRequestJoinModal}></div>
    <ModalRequestJoin 
      title="Request to Join This Community"
      content="If you want to enter the Community, request to join first."
      buttonText="Request Join"
      komunitasId={komunitasId}
      bind:open={showRequestJoinModal} 
      on:requestJoin={handleRequestJoin}
      on:close={closeRequestJoinModal}
    >
      {#if loadingRequest}
        <Loading message="Sending request..." />
      {/if}
    </ModalRequestJoin>
  {/if}

 
</div>

<style>
 
  /* Content Wrapper for Sidebar and Content */
  .content-wrapper {
    display: flex;
    flex-direction: row;
    width: 100%;
    margin-top: 30px;
  }

  /* Style for Sidebar and Content when sidebar is active */
  .content-wrapper.is-sidebar-active .content {
    margin-left: 20px;
    flex: 1;
  }

  /* Sidebar takes specific width when displayed */
  .content-wrapper.is-sidebar-active CommunitySidebar {
    width: 250px;
    flex-shrink: 0;
  }

  /* Full width content when sidebar is hidden */
  .content-wrapper:not(.is-sidebar-active) .content {
    width: 100%;
  }

  .content {
    flex: 1;
  }
</style>