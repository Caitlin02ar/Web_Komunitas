<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { getJwtToken } from '$lib/js/utils';

  let pollDetails = null;
  let isLoading = true;
  let error = null;
  let expandedOption = null;

  onMount(async () => {
    const pollId = $page.params.id;
    const token = getJwtToken();
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/1/polling/${pollId}`;
    
    try {
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const result = await response.json();
      pollDetails = result.data;
    } catch (err) {
      error = `Failed to fetch poll data: ${err.message}`;
    } finally {
      isLoading = false;
    }
  });

  const toggleContent = (optionId) => {
    expandedOption = expandedOption === optionId ? null : optionId;
  };
</script>

{#if isLoading}
  <p>Loading poll details...</p>
{:else if error}
  <p>{error}</p>
{:else if pollDetails}
  <div class="container">
    <h1 class="title">Poll Details</h1>
    <ul>
      {#each pollDetails.polling_pilihan as option}
        <li class="option">
          <div class="option-header" on:click={() => toggleContent(option.id)}>
            <div class="option-info">
              <h3>{option.jawaban}</h3>
            </div>
            <div class="votes">
              <span class="vote-count">{option.jumlah_menjawab} votes</span>
              <svg
                class="icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                class:rotated={expandedOption === option.id}
                style="transition: transform 0.3s ease;"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>

          {#if expandedOption === option.id}
            <div class="voters">
              {#each option.polling_pilihan_detail as detail}
                <div class="voter">
                  <img src={`${import.meta.env.VITE_API_BASE_URL}/getfoto?path=${detail.AnggotaKomunitas.User.foto_profile}`} alt="Profile">
                  <div class="voter-info">
                    <p class="voter-name">
                      {detail.AnggotaKomunitas.User.nama_user}
                      <span class="role {detail.AnggotaKomunitas.Role.nama_roles === 'Leader' ? 'leader' : 'member'}">
                        {detail.AnggotaKomunitas.Role.nama_roles}
                      </span>
                    </p>
                    <p class="voter-username">@{detail.AnggotaKomunitas.User.username}</p>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </li>
      {/each}
    </ul>
  </div>
{:else}
  <p>No poll details available.</p>
{/if}

<style>
  .container {
    padding: 16px;
    background-color: white;
    border-radius: 8px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .title {
    font-size: 1.75rem;
    font-weight: bold;
    margin-bottom: 16px;
  }

  .option {
    margin-bottom: 16px;
    background-color: #f9f9f9;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }

  .option-header {
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background-color: #f7f7f7;
    border-bottom: 1px solid #e5e7eb;
  }

  .option-info h3 {
    font-size: 1.2rem;
    font-weight: bold;
  }

  .votes {
    display: flex;
    align-items: center;
    font-size: 1rem;
    color: #555;
  }

  .vote-count {
    margin-right: 8px;
    font-size: 1rem;
    font-weight: bold;
  }

  .voters {
    padding: 0 16px 16px;
  }

  .voter {
    display: flex;
    align-items: flex-start;
    padding: 12px 0;
    border-top: 1px solid #e5e7eb;
  }

  .voter img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 12px;
  }

  .voter-info {
    display: flex;
    flex-direction: column;
  }

  .voter-name {
    font-weight: bold;
    margin-bottom: 4px;
  }

  .voter-username {
    font-size: 0.85rem;
    color: #555;
  }

  .role {
    font-size: 0.75rem;
    padding: 2px 8px;
    border-radius: 12px;
    border: 1px solid;
    margin-left: 8px;
  }

  .leader {
    color: #093B70;
    border-color: #093B70;
  }

  .member {
    color: #FFA049;
    border-color: #FFA049;
  }

  .icon {
    width: 24px;
    height: 24px;
    transition: transform 0.3s ease;
  }

  .rotated {
    transform: rotate(180deg);
  }
</style>
