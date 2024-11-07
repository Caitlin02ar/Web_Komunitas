<script lang="ts">
    import { onMount } from 'svelte';
    import { getJwtToken, extractIdFromUrl, getUserId } from '$lib/js/utils';
    import AnggotaGroup from '$lib/component/AnggotaGroup.svelte';

    let members = [];
    let groupName = '';
    let groupDescription = '';
    let groupPeriod = '';
    let communityStatus = '';
    let groupImage = '';
    let currentUserId = Number(getUserId()); // Ambil ID user saat ini
    let userMemberId = ''; // Untuk menyimpan id anggota user saat ini di grup

    // Fungsi untuk mengekstrak ID Chat dari URL
    function extractChatIdFromUrl(url: string): string | null {
      const match = url.match(/\/chat\/(\d+)/);
      return match ? match[1] : null;
    }

    onMount(async () => {
      const komunitasId = extractIdFromUrl(window.location.href); // Mengambil ID komunitas
      const chatId = extractChatIdFromUrl(window.location.href); // Mengambil ID grup
      const token = getJwtToken();

      if (!token) {
        console.error('Token not found');
        return;
      }

      try {
        // Fetch data grup
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${komunitasId}/group/${chatId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const result = await response.json();

        if (result.status === 200) {
          const groupData = result.data.GroupKomunitas;
          groupName = groupData.nama_group_komunitas;
          groupDescription = groupData.deskripsi;
          groupPeriod = `${new Date(groupData.start_date).toLocaleDateString()} - ${new Date(groupData.end_date).toLocaleDateString()}`;
          communityStatus = groupData.status_privasi;
          groupImage = `${import.meta.env.VITE_API_BASE_URL}/${groupData.foto}`;

          // Fetch data anggota
          const memberResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${komunitasId}/group/${chatId}/anggota?page=0&pageSize=0`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          const memberResult = await memberResponse.json();

          if (memberResult.status === 200) {
            members = memberResult.data.map((member) => {
              // Jika userId anggota sama dengan user saat ini, simpan id anggota
              if (member.user_id === currentUserId) {
                userMemberId = member.id;
              }

              return {
                id: member.id,
                userid: member.user_id,
                profileImage: `${import.meta.env.VITE_API_BASE_URL}/${member.User.foto_profile}`,
                name: member.User.nama_user,
                username: member.User.username,
                role: member.Role.nama_roles
              };
            });
          } else {
            console.error('Failed to fetch member data:', memberResult.message);
          }
        } else {
          console.error('Failed to fetch group data:', result.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    });

    // Fungsi untuk meninggalkan grup
    async function leaveGroup() {
      const komunitasId = extractIdFromUrl(window.location.href);
      const chatId = extractChatIdFromUrl(window.location.href);
      const token = getJwtToken();

      if (!userMemberId) {
        console.error("User's member ID not found in this group");
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${komunitasId}/group/${chatId}/anggota/delete/${userMemberId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const result = await response.json();

        if (result.status === 200) {
          console.log("Successfully left the group");
          const currentUrl = window.location.href;
          const newUrl = currentUrl.replace(/\/chat\/\d+\/detail$/, '/chat/openchat');

          window.location.href = newUrl;        }
        else {
          console.error('Failed to leave group:', result.message);
        }
      } catch (error) {
        console.error('Error leaving group:', error);
      }
    }
</script>

<div class="detail-container">
  <div class="header">
    <img src={groupImage} alt="Group Avatar" class="avatar" />
    <h1 class="group-name">{groupName}</h1>
  </div>

  <button class="leave-button" on:click={leaveGroup}>
    <img src="/src/lib/images/logout.svg" alt="Leave Group Icon" class="icon" />
    Leave Group Community
  </button>

  <section class="description-section">
    <h2>Group Community Description</h2>
    <p>{groupDescription}</p>
  </section>

  <section class="period-section">
    <h2>Group Community Period Time</h2>
    <p>{groupPeriod}</p>
  </section>

  <div class="status-section">
    <h2>Group Community Status Privacy</h2>
    <div class="privacy-info">
      {#if communityStatus === 'Public'}
        <img src="/src/lib/images/public.svg" alt="Public" class="privacy-icon" />
        <div class="privacy-text">
          <p class="status-title">Public</p>
          <p class="status-description">Anyone can view and contribute</p>
        </div>
      {:else if communityStatus === 'Private'}
        <img src="/src/lib/images/private.svg" alt="Private" class="privacy-icon" />
        <div class="privacy-text">
          <p class="status-title">Private</p>
          <p class="status-description">Only approved users can view and contribute</p>
        </div>
      {:else if communityStatus === 'Restrict'}
        <img src="/src/lib/images/restrict.svg" alt="Restrict" class="privacy-icon" />
        <div class="privacy-text">
          <p class="status-title">Restrict</p>
          <p class="status-description">Only invited users can join</p>
        </div>
      {/if}
    </div>
  </div>

  <!-- Daftar Anggota -->
  <div class="member-list">
    {#each members as member}
      <AnggotaGroup
        profileImage={member.profileImage}
        name={member.name}
        username={member.username}
        role={member.role}
      />
    {/each}
  </div>
</div>


  <style>
    .detail-container {
      display: flex;
      flex-direction: column;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
  
    .header {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 20px;
    }
  
    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
    }
  
    .group-name {
      font-size: 1.5rem;
      font-weight: bold;
      margin-top: 10px;
      text-align: center;
    }
  
    .leave-button {
      display: flex;
      align-items: center;
      color: red;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      font-weight: bold;
      margin-top: 10px;
      margin-bottom: 20px;
      justify-content: flex-start;
      outline: none;
    }
  
    .leave-button .icon {
      width: 20px;
      height: 20px;
      margin-right: 5px;
    }
  
    .description-section, .period-section {
      width: 100%;
      max-width: 600px;
      text-align: left;
      margin-bottom: 20px;
    }
  
    .description-section h2, .period-section h2 {
      font-size: 1.1rem;
      font-weight: bold;
      margin-bottom: 5px;
    }
  
    .description-section p, .period-section p {
      font-size: 1rem;
      line-height: 1.5;
      color: #333;
    }
  
    .status-section {
      width: 100%;
      max-width: 600px;
      text-align: left;
      margin-bottom: 20px;
    }
  
    .status-section h2 {
      font-size: 1.1rem;
      font-weight: bold;
      margin-bottom: 10px;
    }
  
    .privacy-info {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }
  
    .privacy-icon {
      width: 32px;
      height: 32px;
    }
  
    .privacy-text {
      display: flex;
      flex-direction: column;
    }
  
    .status-title {
      font-size: 1rem;
      font-weight: bold;
    }
  
    .status-description {
      font-size: 0.9rem;
      color: #333;
    }
  
    
  </style>
  