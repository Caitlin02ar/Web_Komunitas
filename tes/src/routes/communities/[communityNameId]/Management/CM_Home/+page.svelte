<script lang="ts">
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import CommunityProfile from '$lib/component/CommunityProfile-Management.svelte';
  import OpenForum from '$lib/component/CommunityForum.svelte';
  import CreatePost from '$lib/component/CreatePost.svelte';
  import LeaveCommunityModal from '$lib/component/LeaveCommunityModal.svelte';
  import ModalRequestJoin from '$lib/component/ModalRequestJoin.svelte';
  import Loading from '$lib/component/Loading.svelte'; 
  import { getJwtToken, getUserId, extractIdFromUrl } from '$lib/js/utils';
  import { browser } from '$app/environment';

  let communityData = null;
  let forumPosts = [];
  let showModal = false;
  let showLeaveModal = false;
  let showRequestJoinModal = false;
  let loading = true;
  let loadingRequest = false;
  let komunitasId = '';
  let communityName = '';

  onMount(async () => {
    if (browser) {
      const token = getJwtToken();
      const userId = getUserId();
      komunitasId = extractIdFromUrl(window.location.href);

      if (!token) {
        console.error('Token not found');
        loading = false;
        return;
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL;

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
          console.log(result.data);
          
          if (Number(komunitas.owner_id) === Number(userId)) {
            communityData = {
              imageSrc: komunitas.gambar_komunitas || '/src/lib/images/default_image.png',
              name: komunitas.nama_komunitas || 'No Name',
              members: komunitas.jumlah_anggota || 0,
              tags: komunitas.subkategori_mm_komunitas.map(sub => sub.sub_kategori.nama_subkategori) || [],
              description: komunitas.deskripsi_komunitas || 'No Description',
              status: 'joined',
              admin: 'yes',
            };
          } else {
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
                  imageSrc: komunitas.gambar_komunitas || '/src/lib/images/default_image.png',
                  name: komunitas.nama_komunitas || 'No Name',
                  members: komunitas.jumlah_anggota || 0,
                  tags: komunitas.subkategori_mm_komunitas.map(sub => sub.sub_kategori.nama_subkategori) || [],
                  description: komunitas.deskripsi_komunitas || 'No Description',
                  status: 'joined',
                  admin: anggotaData.Role.nama_roles !== 'Member' ? 'yes' : 'no',
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

                  if (isRequested) {
                    communityData = {
                      imageSrc: komunitas.gambar_komunitas || '/src/lib/images/default_image.png',
                      name: komunitas.nama_komunitas || 'No Name',
                      members: komunitas.jumlah_anggota || 0,
                      tags: komunitas.subkategori_mm_komunitas.map(sub => sub.sub_kategori.nama_subkategori) || [],
                      description: komunitas.deskripsi_komunitas || 'No Description',
                      status: 'requested',
                      admin: 'no',
                    };
                  } else {
                    communityData = {
                      imageSrc: komunitas.gambar_komunitas || '/src/lib/images/default_image.png',
                      name: komunitas.nama_komunitas || 'No Name',
                      members: komunitas.jumlah_anggota || 0,
                      tags: komunitas.subkategori_mm_komunitas.map(sub => sub.sub_kategori.nama_subkategori) || [],
                      description: komunitas.deskripsi_komunitas || 'No Description',
                      status: komunitas.status_privasi === 'Public' ? 'public' : 'private',
                      admin: 'no',
                    };
                  }
                }
              }
            }
          }
        }

        const forumResponse = await fetch(`${baseUrl}/v1/users/komunitas/${komunitasId}/forum?page=0&pageSize=0`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const forumResult = await forumResponse.json();
        if (forumResult.status === 200) {
          forumPosts = forumResult.data.map(post => ({
            id: post.id,
            title: post.judul_forum,
            userName: post.AnggotaKomunitas.User.nama_user,
            userImageSrc: post.AnggotaKomunitas.User.foto_profile,
            content: post.isi,
            likes: post.JumlahLike,
            hasLiked: post.Like.some(like => like.AnggotaKomunitas.user_id === userId),
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        loading = false;
      }
    }
  });

  function handleCommentClick(event) {
    const { id } = event.detail;
    goto(`/communities/${communityName.replace(/\s+/g, '-').toLowerCase()}-${komunitasId}/forum/${id}`);
  }

  async function handleRequestJoin() {
    const token = getJwtToken();
    const userId = getUserId();
    loadingRequest = true;

    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${komunitasId}/join`;

    const requestData = {
      user_id: Number(userId),
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        console.log('Request to join successful');
        showRequestJoinModal = false;
        communityData.status = 'requested';
        location.reload();
      } else {
        console.error('Request to join failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error requesting to join community:', error);
    } finally {
      loadingRequest = false;
    }
  }

  async function handleJoinDirectly() {
    const token = getJwtToken();
    const userId = getUserId();
    loadingRequest = true;
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
        console.log('Joined community successfully');
        communityData.status = 'joined';
        location.reload();
      } else {
        console.error('Failed to join community:', response.statusText);
      }
    } catch (error) {
      console.error('Error joining community:', error);
    }
  }

  function handleLike(id) {
    const post = forumPosts.find(post => post.id === id);
    if (post) {
      post.hasLiked = !post.hasLiked;
      post.likes += post.hasLiked ? 1 : -1;
    }
  }

  function handleCreatePost() {
    showModal = true;
  }

  function closeCreatePost() {
    showModal = false;
  }

  function handleLeaveCommunity() {
    showLeaveModal = true;
  }

  function closeLeaveModal() {
    showLeaveModal = false;
  }

  function confirmLeaveCommunity() {
    closeLeaveModal();
  }

  function openRequestJoinModal() {
    console.log("Opening Request Join Modal");
    showRequestJoinModal = true;
  }

  function closeRequestJoinModal() {
    console.log("Closing Request Join Modal");
    showRequestJoinModal = false;
  }
</script>

<div class="community-container">
  {#if loading}
    <Loading message="Loading community data..." />
  {:else}
    {#if communityData}
      <CommunityProfile 
        {communityData} 
        on:createPost={handleCreatePost}
        on:leaveCommunity={handleLeaveCommunity}
        on:requestJoin={openRequestJoinModal}
        on:joinDirectly={handleJoinDirectly}
      />

      {#if communityData.status === 'public' || communityData.status === 'joined'}
        {#each forumPosts as post}
          <OpenForum
            userName={post.userName}
            userImageSrc={post.userImageSrc}
            content={post.content}
            likes={post.likes}
            hasLiked={post.hasLiked}
            postId={post.id} 
            title={post.title} 
            on:comment={handleCommentClick} 
            on:like={() => handleLike(post.id)}
          />
        {/each}
      {/if}
    {/if}

    {#if showModal}
      <div class="modal-overlay" on:click={closeCreatePost}></div>
      <CreatePost on:close={closeCreatePost} />
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
  {/if}
</div>

<style>
  .community-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 16px 24px 24px 24px;
    background-color: #f9f9f9;
    margin-top: -16px;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
  }
</style>
