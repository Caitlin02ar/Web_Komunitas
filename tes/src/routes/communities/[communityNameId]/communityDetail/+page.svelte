<script lang="ts">
    import { onMount } from 'svelte';
    import Loading from '$lib/component/Loading.svelte'; // Importing Loading component
    import CommunityDetail from '$lib/component/CommunityDetail.svelte'; // Importing CommunityDetail component
    import { getJwtToken, getUserId, extractIdFromUrl, getAnggotaKomunitasId, getRoleAnggotaKomunitas } from '$lib/js/utils'; // Importing getRoleAnggotaKomunitas
    import { goto } from '$app/navigation'; // SvelteKit navigation
    import LeaveCommunityModal from '$lib/component/LeaveCommunityModal.svelte'; // Importing LeaveCommunityModal

    let communityData = null;
    let errorMessage = '';
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    let communityStatus = ''; // Store privacy status (Public/Private)
    let anggotaKomunitasId = null; // Initialize as null to store the ID later
    let showModal = false; // State to control the modal visibility
    let userRole = ''; // Store the user's role

    // Function to fetch community data
    async function fetchCommunityData(communityId: string) {
        const token =  getJwtToken(); // Get JWT Token
        try {
            const response = await fetch(`${baseUrl}/v1/users/komunitas/${communityId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const result = await response.json();
            if (response.ok && result.status === 200) {
                const data = result.data.Komunitas;  
                communityData = {
                    imageSrc: `${baseUrl}/${data.gambar_komunitas}`, // Community image
                    name: data.nama_komunitas,
                    members: data.jumlah_anggota,
                    tags: data.subkategori_mm_komunitas.map(subkategori => subkategori.sub_kategori.nama_subkategori),
                    description: data.deskripsi_komunitas,
                };
                communityStatus = data.status_privasi; // Get privacy status
            } else {
                errorMessage = 'Failed to load community data';
            }
        } catch (error) {
            errorMessage = 'Error fetching community data';
            console.error(error);
        }
    }

    // Function to handle leaving the community
    async function leaveCommunity() {
        const token = getJwtToken();
        const communityId = extractIdFromUrl(window.location.href); // Get community ID from URL

        try {
            // Ensure we await `getAnggotaKomunitasId` to retrieve the correct ID
            anggotaKomunitasId = await getAnggotaKomunitasId(communityId, getUserId());
            
            const response = await fetch(`${baseUrl}/v1/users/komunitas/${communityId}/anggota/delete/${anggotaKomunitasId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                console.log('Successfully left the community.');
                // Close the modal after successfully leaving the community
                showModal = false;
                // Navigate to the community list
                goto(`/communities/${communityData.name.replace(/\s+/g, '-').toLowerCase()}-${communityId}`);
            } else {
                console.error('Failed to leave community.');
            }
        } catch (error) {
            console.error('Error leaving community:', error);
        }
    }

    // Get the community ID from URL and fetch data on mount
    onMount(async () => {
        const communityId = extractIdFromUrl(window.location.href);
        anggotaKomunitasId = await getAnggotaKomunitasId(communityId, getUserId()); // Fetch `anggotaKomunitasId`
        fetchCommunityData(communityId); // Fetch community data

        // Fetch the role of the user in the community
        userRole = await getRoleAnggotaKomunitas(communityId, getUserId());
        console.log(userRole);
    });

    function openModal() {
        showModal = true;
    }

    function closeModal() {
        showModal = false;
    }
</script>

{#if errorMessage}
  <p>{errorMessage}</p>
{:else if !communityData}
  <!-- Using the Loading component -->
  <Loading />
{:else}
  <div class="community-wrapper">
    <!-- Calling the CommunityDetail component with fetched community data -->
    <CommunityDetail {communityData} />
  
    <!-- Conditionally show Leave Community Button if the user role is 'Member' -->
    {#if userRole === 'Member'}
      <div class="leave-community-section">
        <button class="leave-community-btn" on:click={openModal}>
          <img src="/src/lib/images/logout.svg" alt="Leave Community" class="leave-icon" />
          <span>Leave Community</span>
        </button>
      </div>
    {/if}
  
    <!-- Displaying the privacy status of the community -->
    <div class="community-privacy-status">
      <h3>Community Status Privacy</h3>
      <div class="privacy-info">
        {#if communityStatus === 'Public'}
          <img src="/src/lib/images/public.svg" alt="Public" class="privacy-icon" />
          <p><strong>Public</strong><br>Anyone can view and contribute</p>
        {:else if communityStatus === 'Private'}
          <img src="/src/lib/images/private.svg" alt="Private" class="privacy-icon" />
          <p><strong>Private</strong><br>Only approved users can view and contribute</p>
          {:else if communityStatus === 'Restrict'}
          <img src="/src/lib/images/restrict.svg" alt="Restrict" class="privacy-icon" />
          <p><strong>Restrict</strong><br>Only invited users can join</p>
        {/if}
      </div>
    </div>
  </div>

  <!-- Modal for leave confirmation -->
  {#if showModal}
    <div class="modal-overlay" on:click={closeModal}></div>
    <LeaveCommunityModal 
      on:close={closeModal} 
      on:confirmLeave={leaveCommunity} 
    />
  {/if}
{/if}

<style>
  .community-wrapper {
    border: 1px solid black;
    padding: 16px;
    background-color: #f9f9f9;
    border-radius: 8px;
    max-width: 100%;
    height: 77vh;
  }

  .leave-community-section {
    margin-top: 20px;
    display: flex;
    align-items: center;
    padding-top: 16px;
    border-top: 1px solid #ccc;
    padding-bottom: 16px;
    gap: 8px;
  }

  .leave-community-btn {
    display: flex;
    align-items: center;
    background-color: transparent;
    border: none;
    color: red;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
  }

  .leave-community-btn:hover {
    color: darkred;
  }

  .leave-icon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    transition: filter 0.3s ease;
  }

  .leave-community-btn:hover .leave-icon {
    filter: invert(40%) sepia(100%) saturate(5000%) hue-rotate(-10deg) brightness(90%) contrast(80%);
  }

  .community-privacy-status {
    margin-top: 16px;
    padding-top: 0px;
  }

  .privacy-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .privacy-icon {
    width: 24px;
    height: 24px;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    color: #333;
  }

  h3 {
    font-size: 1.2rem;
    margin: 0;
  }

  /* Modal styling */
 
</style>
