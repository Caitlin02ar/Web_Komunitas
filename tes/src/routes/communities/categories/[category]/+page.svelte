<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import CommunityCard from '$lib/component/CommunityCard.svelte';
  import { get } from 'svelte/store';
  import { getJwtToken } from '$lib/js/utils';

  let selectedCategories: Array<string> = ['All'];
  let communityItems: Array<any> = [];
  let categories: Array<string> = ['All'];
  let showFilter = false;

  // Fungsi untuk mengambil kategori dari API
  async function fetchCategories() {
    const token = getJwtToken();
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/kategori?page=0&pageSize=0`;

    if (!token) {
      console.error('Token tidak ditemukan');
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.status === 200) {
          categories = ['All', ...result.data.map((cat) => cat.nama_kategori)];
        } else {
          console.error('Gagal mengambil data kategori:', result.message);
        }
      } else {
        console.error('Gagal mengambil data kategori:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  // Fungsi untuk mengambil data komunitas berdasarkan kategori terpilih
  async function fetchCommunityItems(selectedCategories: Array<string>) {
    const token = getJwtToken();
    let apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas?page=0&pageSize=0`;

    // Jika kategori selain "All" dipilih, tambahkan kategori ke URL
    if (!selectedCategories.includes('All')) {
      const categoryParams = selectedCategories.map(cat => cat.split(' ')[0].toLowerCase()).join(',');
      apiUrl += `&kategori=${categoryParams}`;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.status === 200) {
          communityItems = result.data.map(community => ({
            imageSrc: `${import.meta.env.VITE_API_BASE_URL}/getfoto?path=${community.gambar_komunitas}`,
            communityName: community.nama_komunitas,
            tags: community.subkategori_mm_komunitas.map(sub => sub.sub_kategori.nama_subkategori),
            memberCount: community.jumlah_anggota,
            description: community.deskripsi_komunitas,
            visibility: community.status_privasi,
            communityId: community.id
          }));
        } else {
          console.error('Gagal mengambil data komunitas:', result.message);
        }
      } else {
        console.error('Gagal mengambil data komunitas:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching community items:', error);
    }
  }

  function toggleCategory(category: string) {
    if (category === 'All') {
      selectedCategories = ['All'];
    } else {
      if (selectedCategories.includes('All')) {
        selectedCategories = selectedCategories.filter(cat => cat !== 'All');
      }
      if (selectedCategories.includes(category)) {
        selectedCategories = selectedCategories.filter(cat => cat !== category);
      } else {
        selectedCategories = [...selectedCategories, category];
      }
    }
    fetchFilteredCommunities();
  }

  async function fetchFilteredCommunities() {
    await fetchCommunityItems(selectedCategories);
  }

  onMount(async () => {
  await fetchCategories();
  const params = get(page).params;

  // Ubah kategori di URL dari dash (-) ke spasi agar bisa cocok dengan kategori
  const urlCategory = params.category ? params.category.replace(/-/g, ' ') : null;

  // Cek apakah URL mengandung kategori spesifik, abaikan huruf besar/kecil
  if (urlCategory && categories.map(cat => cat.toLowerCase()).includes(urlCategory.toLowerCase())) {
    // Set selectedCategories dengan kategori yang sesuai
    selectedCategories = [categories.find(cat => cat.toLowerCase() === urlCategory.toLowerCase())];
  } else if (urlCategory) {
    // Jika kategorinya ada di URL tapi belum diambil dari fetch, tambahkan tanpa membuat checkbox baru
    selectedCategories = [urlCategory];
  } else {
    selectedCategories = ['All'];
  }

  await fetchFilteredCommunities();
});


</script>

<main>
  <h2>{selectedCategories.length > 0 ? selectedCategories.join(', ') : 'All'} Communities</h2>

  <!-- Filter Dropdown -->
  <div class="filter-dropdown">
    <button class="filter-button" on:click={() => showFilter = !showFilter}>
      Filter by Category
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        class:rotated={showFilter}
        style="transition: transform 0.3s ease;"
      >
        <path fill="none" stroke="black" stroke-width="2" d="M6 9l6 6 6-6" />
      </svg>
    </button>
    {#if showFilter}
      <div class="filter-content">
        {#each categories as category}
          <label class="filter-option">
            <input 
              type="checkbox" 
              on:change={() => toggleCategory(category)} 
              checked={selectedCategories.includes(category)} 
            />
            {category}
          </label>
        {/each}
      </div>
    {/if}
  </div>

  <section class="community-section">
    {#each communityItems as community}
      <CommunityCard 
        imageSrc={community.imageSrc} 
        communityName={community.communityName} 
        tags={community.tags} 
        memberCount={community.memberCount} 
        description={community.description} 
        visibility={community.visibility}
        communityId={community.communityId} 
      />
    {/each}
  </section>
</main>

<style>
  main {
    padding: 20px;
    background-color: #FBFAF9;
  }

  h2 {
    margin-top: 20px;
    font-size: 1.5rem;
    color: #333;
    text-transform: capitalize;
  }

  .community-section {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    padding-top: 20px;
  }

  .filter-dropdown {
    position: relative;
    display: inline-block;
    margin-bottom: 20px;
    padding-top: 15px;
  }

  .filter-button {
    border: 1px solid #ddd;
    padding: 3px 15px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
  }

  .filter-button svg {
    margin-left: 8px;
  }

  .rotated {
    transform: rotate(180deg);
  }

  .filter-content {
    display: block;
    position: absolute;
    background-color: #ffffff;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    padding: 12px 16px;
    z-index: 1;
    border: 1px solid #ddd;
    border-radius: 4px;
    white-space: nowrap;
    max-height: 200px;
    overflow-y: auto;
  }

  .filter-option {
    display: block;
    margin-bottom: 8px;
  }

  .filter-option input[type="checkbox"] {
    margin-right: 8px;
  }
</style>
