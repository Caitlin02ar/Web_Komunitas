<script lang="ts">
  import { createEventDispatcher} from 'svelte';
  import Logo from './Logo.svelte';
  import { derived } from 'svelte/store';
  import { page } from '$app/stores';
  import CommunityCreate from './CommunityCreate.svelte';
  import { goto } from '$app/navigation';
  import { getUserId, getJwtToken} from '$lib/js/utils';
  import home from '$lib/images/home.svg';
  import communities from '$lib/images/communities.svg';
  import events from '$lib/images/events.svg';
  import create from '$lib/images/Create.svg';
  export let open = true; // Whether the sidebar is open or closed
  export let myCommunities: any[] = []; // Array of user's communities
  export let onToggleMyCommunities:any; // Callback for toggling "My Communities" section
  let errorMessage = ""; // Variabel untuk menyimpan pesan error


  let showMyCommunities = false; // State to show or hide "My Communities" list
  let showCreateCommunityModal = false;
  const currentRoute = derived(page, $page => $page.url.pathname);
  const dispatch = createEventDispatcher();

  // Toggle "My Communities" section visibility
  function toggleMyCommunities() {
    if (onToggleMyCommunities) {
      onToggleMyCommunities();
    } else {
      showMyCommunities = !showMyCommunities;
    }
  }

  // Handle "Create Community" button click
  function handleCreateCommunity() {
    showCreateCommunityModal = true;
  }

  function closeCreateCommunityModal() {
    showCreateCommunityModal = false;
  }

  function handleCommunityClick(community: { name: string; id: any; }) {
    const url = `/communities/${community.name.replace(/\s+/g, '-').toLowerCase()}-${community.id}`;
    goto(url).then(() => {
      // Force page reload after navigating
      window.location.reload();
    });
  }

  async function createGroupChat(communityId: number) {
  const token = getJwtToken();

  // Payload for the group chat
  const groupChatPayload = {
    "nama_group_chat": "Open Chat",
    "deskripsi": "Memiliki akses",
    "foto": "public/uploads/foto_profile_openchat/aa.png"
  };

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${communityId}/groupchat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(groupChatPayload),
    });

    const result = await response.json(); // Parse response as JSON

    if (response.status === 200) {
      console.log("Group chat created successfully", result);
      // Handle any success logic, e.g., showing a success message
    } else {
      console.error("Failed to create group chat", result);
    }
  } catch (error) {
    console.error("Error occurred while creating group chat:", error);
  }
}


  async function submitCreateCommunity(event: { detail: any; }) {
  const data = event.detail; 
  const token = getJwtToken();


  // Construct the payload
  const payload = {
    "kode_komunitas": data.communityCode, // Example value, you can customize
    "nama_komunitas": data.communityName,
    "deskripsi_komunitas": data.description,
    "gambar_komunitas": data.profileImage ? `public/uploads/foto_profile_komunitas/${data.profileImage}` : "public/uploads/foto_profile_komunitas/default.png",
    "jumlah_anggota": 1,
    "max_kapasitas_anggota": 0,
    "status_privasi": data.privacy || "Public",
    "owner_id": Number(getUserId()), // Get user ID
    "warna_tema": "white",
    "theme_id":1,
    "subkategori_mm_komunitas": data.subcategories.map((id: any) => ({
      "sub_kategori_id": id
    }))
  };
  
  console.log(payload);
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json(); // Parse response as JSON

    if (response.status === 200) {
      const communityId = result.data.Id; // Extract communityId from the API response

      if (data.profileImage && data.profileImage !== '/src/lib/images/camera2.svg' && data.profileImage !== 'public/uploads/foto_profile_komunitas/default.png') {
        const imageFormData = new FormData();
        const imageFile = data.profileImageFile;  

        // Append the image file to the form data
        imageFormData.append('foto', imageFile);

        // Send image to the community upload endpoint
        const imageResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitasuploadfoto/${communityId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: imageFormData,  // Send the image file in the body
        });

        const imageResult = await imageResponse.json();
        if (imageResponse.status === 200) {
          console.log('Community image uploaded successfully');
        } else {
          console.error('Failed to upload community image:', imageResult);
        }
      }


      // Create group chat after the community is created
      await createGroupChat(communityId);

      // Redirect to the community page based on the community name and ID
      const communitySlug = data.communityName.replace(/\s+/g, '-').toLowerCase();
      const url = `/communities/${communitySlug}-${communityId}`;
      
      // Navigate and reload after everything is complete
      goto(url).then(() => {
        window.location.reload();
      });

      // Close the modal after successful creation
      showCreateCommunityModal = false;
      errorMessage = "";
    } else {
      console.error("Failed to create community", result);

      errorMessage = result.message; // Set error message
      console.log(result.message)
    }

  } catch (error) {
    errorMessage = "Terjadi kesalahan jaringan. Silakan coba lagi.";

  }
}

</script>

<div class="layout">
  <aside class="sidebar" class:open={open}>
    <nav class="p-4 text-white">
      <div class="logo-container">
        <Logo />
      </div>
      <div class="menu">
        <a href="/home" class="menu-item" class:active={$currentRoute === '/home'}>
          <img src="{home}" alt="Home" width="24" height="24" class="menu-icon" />
          <span>Home</span>
        </a>
        <a href="/communities/categories/all" class="menu-item" class:active={$currentRoute === '/communities/categories/all'}>
          <img src="{communities}" alt="Communities" width="24" height="24" class="menu-icon" />
          <span>Communities</span>
        </a>
        <a href="/events" class="menu-item" class:active={$currentRoute === '/events'}>
          <img src="{events}" alt="Events" width="24" height="24" class="menu-icon" />
          <span>Events</span>
        </a>
      </div>
      <hr class="thick-hr" />
      <div class="menu">
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a href="#" on:click={handleCreateCommunity} class="menu-item">
          <img src="{create}" alt="Create Community" class="menu-icon create-icon" />
          <span>Create Community</span>
        </a>
      </div>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <h2 class="text-sm font-semibold mt-4 mb-2 flex items-center justify-between cursor-pointer" on:click={toggleMyCommunities}>
        My Community
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          class:rotated={showMyCommunities}
          style="transition: transform 0.3s ease;"
        >
          <path fill="none" stroke="white" stroke-width="2" d="M6 9l6 6 6-6" />
        </svg>
      </h2>
      <div class="menu-container {showMyCommunities ? 'visible' : ''}">
        <div class="menu">
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <!-- svelte-ignore a11y-missing-attribute -->
          {#each myCommunities as community}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <a on:click={() => handleCommunityClick(community)}>
              <div class="menu-item">
              <img src={community.imageSrc} alt={community.name} class="menu-icon community-icon" />
              <span>{community.name}</span>
            </div>
            </a>
          {/each}
        </div>
      </div>
    </nav>
  </aside>
  <div class="main-content">
    <!-- Your main content goes here -->
    <slot></slot>
  </div>

  <CommunityCreate
  open={showCreateCommunityModal}
  on:close={closeCreateCommunityModal}
  on:submit={submitCreateCommunity}
  errorMessage={errorMessage} />
</div>

<style>
  .layout {
    display: flex;
  }

  .sidebar {
    width: 250px;
    background-color: #0F1426;
    color: #ffffff;
    height: 100%;
    position: fixed;
    left: 0;
    transition: left 0.3s ease-in-out;
    z-index: 1000;
  }

  .sidebar:not(.open) {
    left: -250px;
  }

  .main-content {
    margin-left: 250px;
    transition: margin-left 0.3s ease-in-out;
    flex-grow: 1;
  }

  .sidebar:not(.open) + .main-content {
    margin-left: 0;
  }

  .logo-container {
    display: flex;
    justify-content: center;
    padding: 2rem 0;
    margin-bottom: 2rem;
  }

  /* .logo span {
    font-size: 1rem;
    margin-left: 0.5rem;
  } */

  .menu {
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
    overflow: auto;
    max-height: 280px;
  }

  .menu-item {
    display: flex;
    align-items: center;
    padding: 0.3rem 1rem;
    color: white;
    text-decoration: none;
    transition: background 0.2s, border-radius 0.2s;
    font-size: 0.875rem;
    width: 100%;
    justify-content: flex-start;
  }

  .menu-item:hover {
    background-color: #ffffff;
    color: #0F1426;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
  }

  .menu-item.active {
    background-color: #ffffff;
    color: #0F1426;
    font-weight: 600;
    border-radius: 8px;
    margin: 0.5rem 0; /* Add margin to separate active items */
  }

  /* Ensure the icon color turns black for main menu items */
  .menu > .menu-item:hover .menu-icon,
  .menu > .menu-item.active .menu-icon {
    filter: invert(100%);
  }

  /* Ensure the icon color stays as original for "My Community" items */
  .menu-container .menu-item:hover .menu-icon,
  .menu-container .menu-item.active .menu-icon {
    filter: none;
  }

  .menu-item img, .menu-item img {
    margin-right: 0.75rem;
  }


  hr {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.8);
    margin: 1rem 0;
  }

  .thick-hr {
    border-top: 2px solid rgba(255, 255, 255, 0.8);
  }

  .menu-icon {
    width: 24px;
    height: 24px;
  }

  .menu-icon.community-icon {
    border-radius: 50%;
    object-fit: cover;
  }

  svg.rotated {
    transform: rotate(180deg);
  }

  .menu-container {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .menu-container.visible {
    max-height: 500px;
  }
</style>
