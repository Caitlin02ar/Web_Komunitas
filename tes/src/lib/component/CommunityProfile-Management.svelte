<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import aksi from '$lib/images/aksi.svg';
  import create_post from '$lib/images/Create.svg';

  const dispatch = createEventDispatcher();

  export let communityData: {
    imageSrc: string;
    name: string;
    members: number;
    tags: string[];
    description: string;
    status: string; 
    admin: string;
    warna_tag: string;
    warna_create_post: string;
    warna_hover_create_post: string;
  };

  console.log("Foto", communityData.imageSrc);
  let showMenu = false;
  let hoverBackgroundColor = communityData.warna_create_post;
  let borderColor = 'black';

  function toggleMenu() {
    showMenu = !showMenu;
  }

  function handleCreatePost() {
    dispatch('createPost');
  }

  function handleCommunityDetail() {
    const currentUrl = window.location.href;
    const newUrl = `${currentUrl}/CM_CommunitySetting/CM_CommunityDetail`;
    window.location.href = newUrl;
  }

  function handleLeaveCommunity() {
    dispatch('leaveCommunity');
  }

  function handleJoinRequest() {
    // communityData.status = 'requested';
    dispatch('requestJoin');
  }

  function handleJoinDirectly() {
    communityData.status = 'joined';
    dispatch('joinDirectly');
  }

  
</script>
{#if communityData && communityData.status !== 'expired'}
<div class="community-card">
  <div class="community-header">
    <img src={communityData.imageSrc} alt={communityData.name} class="community-image" />
    <div class="community-info">
      <h2>{communityData.name}</h2>
      <div class="members-tags">
        <p>{communityData.members} {communityData.members === 1 ? 'member' : 'members'}</p>
        <div class="tags">
          {#each communityData.tags as tag}
            <span class="tag" style="background-color:{communityData.warna_tag}">{tag}</span>
          {/each}
        </div>
      </div>
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    {#if communityData.status === 'joined'}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="actions-menu" on:click={toggleMenu}>
      <img src="{aksi}" alt="Actions" class="actions-icon" />
      {#if showMenu}
        <div class="dropdown-menu">
          <button on:click={handleCommunityDetail}>Community Detail</button>
          {#if communityData.admin === 'no'}
            <button on:click={handleLeaveCommunity}>Leave Community</button>
          {/if}
        </div>
      {/if}
    </div>
    {/if}
  </div>

  <div class="community-description">
    <h3>Description</h3>
    <p>{communityData.description}</p>
  </div>

  <div class="action-buttons">
    {#if communityData.status === 'joined'}
      <button
        class="create-post-btn"
        style="background-color: {hoverBackgroundColor}; border-color: {borderColor};"
        on:click={handleCreatePost}
        on:mouseenter={() => {
          hoverBackgroundColor = communityData.warna_hover_create_post;
          borderColor = communityData.warna_hover_create_post;
        }}
        on:mouseleave={() => {
          hoverBackgroundColor = communityData.warna_create_post;
          borderColor = 'black';
        }}
      >
        <img src="{create_post}" alt="Create Post" class="create-icon" />
        Create post
      </button>     
    {/if}
  </div>
</div>
{:else}
<div class="expired-message">
  <h2>Your link is expired</h2>
  <p>Please ask for a new link to access this community.</p>
</div>
{/if}
<style>
  .community-card {
    background-color: #F6F3F3;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: relative;
  }

  .community-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
  }

  .community-image {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 16px;
  }

  .community-info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .community-info h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .members-tags {
    display: flex;
    align-items: center;
    margin-top: 4px;
    gap: 8px;
  }

  .community-info p {
    margin: 0;
    font-size: 1rem;
    color: #555;
  }

  .tags {
    display: flex;
    gap: 8px;
  }

  .tag {
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 0.875rem;
    color: #000000;
    font-weight: 500;
    border: 1.5px solid rgba(94, 94, 94, 0.5);
  }

  .community-description {
    display: flex;
    flex-direction: column;
    width: calc(100%);
  }

  .community-description h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: bold;
  }

  .community-description p {
    margin: 4px 0 0;
    font-size: 1rem;
    color: #333;
  }

  .action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 16px;
  }

  .actions-menu {
    position: absolute;
    top: 0;
    right: 0;
    margin-top: 4px;
    cursor: pointer;
  }

  .actions-icon {
    width: 24px;
    height: 24px;
  }

  .dropdown-menu {
    position: absolute;
    top: 24px;
    right: 0;
    background-color: #ffffff;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
    width: 160px;
  }

  .dropdown-menu button {
    background: none;
    border: none;
    padding: 12px 16px;
    width: 100%;
    text-align: left;
    cursor: pointer;
    font-size: 14px;
  }

  .dropdown-menu button:hover {
    background-color: #f0f0f0;
  }


  .create-post-btn {
    color: black;
    border: 1px solid black;
    border-radius: 50px;
    padding: 8px 24px;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background-color 0.3s, border-color 0.3s, color 0.3s;
  }

  .create-post-btn:hover {
    color: white;
  }

  .create-icon {
    filter: invert(100%);
    transition: filter 0.3s;
  }

  .create-post-btn:hover .create-icon {
    filter: none;
  }

</style>
