<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { getJwtToken } from '$lib/js/utils';
  import { goto } from '$app/navigation';
  import public_icon from '$lib/images/public.svg';
  import private_icon from '$lib/images/private.svg';
  import restrict_icon from '$lib/images/restrict.svg';
  export let open = false;
  // export let onSubmit: any;

  let communityName = "";
  let description = "";
  let privacy = "Public"; 
  let profileImage = ""; 
  /**
	 * @type {any}
	 */
  let profileImageFile: any;
  let communityCode = "";
  let categories: any[] = []; 
  let profileImagePreview = ""; // Untuk menyimpan data base64 gambar (untuk preview)
  let selectedSubcategories = new Set(); 
  export let errorMessage = ""; 

  let currentPage = 1; 
  const dispatch = createEventDispatcher();

  let isCommunityNameValid = true;
  let isDescriptionValid = true;
  let isCommunityCodeValid = true;

  // Reactive statement to check if "Create" button should be enabled
  $: isCreateDisabled = selectedSubcategories.size < 1 || selectedSubcategories.size > 3;

  async function fetchCategoriesAndSubcategories() {
    const token = getJwtToken();
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/subkategori?page=0&pageSize=0`;

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.status === 200) {
        const groupedCategories = result.data.reduce((acc: { [x: string]: any[]; }, subkategori: { KategoriKomunitas: { nama_kategori: any; }; }) => {
          const category = subkategori.KategoriKomunitas.nama_kategori;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(subkategori);
          return acc;
        }, {});

        categories = Object.keys(groupedCategories).map((category) => ({
          category,
          subcategories: groupedCategories[category],
        }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  onMount(() => {
    fetchCategoriesAndSubcategories();
  });

  function toggleSubcategory(subcategoryId: unknown) {
    if (selectedSubcategories.has(subcategoryId)) {
      selectedSubcategories.delete(subcategoryId);
    } else {
      if (selectedSubcategories.size < 3) {
        selectedSubcategories.add(subcategoryId);
      }
    }
    selectedSubcategories = new Set(selectedSubcategories); // Reset the Set to ensure reactivity
  }

  function handleProfileImageChange(event: { target: { files: any[]; }; }) {
    const file = event.target.files[0];
    if (file) {
        // Ambil nama file dari file yang diunggah
        profileImage = file.name; // Menyimpan nama file untuk formData

        // Simpan file dalam variabel untuk dikirim nanti
        profileImageFile = file;

        // Untuk preview gambar
        const reader = new FileReader();
        reader.onload = (e) => {
            profileImagePreview = e.target.result; // Menyimpan data base64 gambar
        };
        reader.readAsDataURL(file); // Membaca file sebagai base64 untuk preview
    } else {
        profileImage = "/src/lib/images/camera2.svg"; // Gambar default
        profileImagePreview = ""; // Reset preview
    }
}


function resetFormData() {
  communityName = "";
  description = "";
  privacy = "Public"; 
  profileImage = ""; 
  communityCode = "";
  selectedSubcategories = new Set(); 
  errorMessage = ""; 

  currentPage = 1; // Kembali ke halaman pertama
  isCommunityNameValid = true;
  isDescriptionValid = true;
  isCommunityCodeValid = true;
}


  function handleNextPage() {
    validateInputs();
    if (isCommunityNameValid && isDescriptionValid && isCommunityCodeValid) {
      currentPage += 1;
    }
  }

  function handlePreviousPage() {
    currentPage -= 1;
  }

  function validateInputs() {
    isCommunityNameValid = communityName.trim() !== "";
    isDescriptionValid = description.trim() !== "";
    isCommunityCodeValid = communityCode.trim() !== "";
  }

  function handleSubmit() {
  console.log('Submit button clicked');

  const formData = {
    communityName,
    description,
    privacy,
    profileImage: profileImage === '/src/lib/images/camera2.svg' ? null : profileImage, // Kirim null jika gambar kosong
    communityCode,
    profileImageFile,
    subcategories: Array.from(selectedSubcategories),
  };
  // console.log(formData);

  dispatch('submit', formData); 
}


  function handleClose() {
    resetFormData(); // Reset semua data
    dispatch('close'); // Tutup modal
  }
</script>

{#if open}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="modal-overlay" on:click={handleClose}></div>
<div class="modal-content">
  <div class="modal-header">
    <strong style="font-size: 22px;">Create New Community</strong>
    <button class="close-button" on:click={handleClose}>✕</button>
  </div>

  <div class="modal-body">
    {#if currentPage === 1}
    <div class="profile-name-group">
      <!-- svelte-ignore a11y-img-redundant-alt -->
      <label for="profile-image-upload" class="profile-image-label">
        <img
        src={profileImagePreview || (profileImage === '/src/lib/images/camera2.svg' ? '/src/lib/images/camera2.svg' : '/src/lib/images/camera2.svg')}
        alt="Profile Image"
        class="profile-image {profileImage === '/src/lib/images/camera2.svg' ? 'default' : ''}"
    />
    

        <input id="profile-image-upload" type="file" accept="image/*" on:change={handleProfileImageChange} />
      </label>
      <div class="form-group">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="label-input">Community Name<span style="color: red;">*</span></label>
        <input type="text" bind:value={communityName} placeholder="Community Name" class:is-invalid={!isCommunityNameValid} />
      </div>
    </div>
    <div class="form-group">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="label-input">Description<span style="color: red;">*</span></label>
      <textarea bind:value={description} placeholder="Type description..." style="height: 100px;" class:is-invalid={!isDescriptionValid}></textarea>
    </div>
    <div class="form-group">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="label-input">Community Privacy Settings<span>*</span></label>
      <div class="privacy-options">
        <div class="privacy-option">
          <input type="radio" value="Public" bind:group={privacy} id="public" />
          <img src="{public_icon}" alt="Public" class="privacy-icon" />
          <label for="public" class="privacy-label">
            <div class="privacy-text">
              <strong>Public</strong><br />
              <small>Anyone can view and contribute</small>
            </div>
          </label>
        </div>
        <div class="privacy-option">
          <input type="radio" value="Private" bind:group={privacy} id="private" />
          <img src="{private_icon}" alt="Private" class="privacy-icon" />
          <label for="private" class="privacy-label">
            <div class="privacy-text">
              <strong>Private</strong><br />
              <small>Only approved users can view and contribute</small>
            </div>
          </label>
        </div>
        <div class="privacy-option">
          <input type="radio" value="Restrict" bind:group={privacy} id="restrict" />
          <img src="{restrict_icon}" alt="Restrict" class="privacy-icon" />
          <label for="restrict" class="privacy-label">
            <div class="privacy-text">
              <strong>Restrict</strong><br />
              <small>Only invited users can join</small>
            </div>
          </label>
        </div>
        <div class="form-group">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label-input">Community Code<span style="color: red;">*</span></label>
          <input type="text" bind:value={communityCode} placeholder="Max 9 characters" maxlength="9" class:is-invalid={!isCommunityCodeValid} />
        </div>
      </div>
    </div>
    {/if}

    {#if currentPage === 2}
    <h3 style="font-size: 20px; font-weight: bold;">Add Topics</h3>
    <p style="padding-bottom: 2%;">Choose max 3 topics for community category</p>

    <div class="topics-container">
      {#each categories as { category, subcategories }}
        <h4>{category}</h4>
        <div class="topics-group">
          {#each subcategories as subcategory}
            <button 
              class="topic-button" 
              class:selected={selectedSubcategories.has(subcategory.id)} 
              on:click={() => toggleSubcategory(subcategory.id)}>
              {subcategory.nama_subkategori}
            </button>
          {/each}
        </div>
      {/each}
    </div>
    {#if errorMessage}
      <div class="error-message">
        {errorMessage}
      </div>
    {/if}
    {/if}
  </div>

  <div class="actions">
    <button on:click={currentPage === 1 ? handleClose : handlePreviousPage} class="secondary">Back</button>
    {#if currentPage === 2}
    <button class="primary" on:click={handleSubmit} disabled={isCreateDisabled}>Create</button>
    {:else}
    <button class="primary" on:click={handleNextPage}>Next</button>
    {/if}
  </div>

  <div class="pagination-dots">
    <span class:active={currentPage === 1}>●</span>
    <span class:active={currentPage === 2}>●</span>
  </div>
</div>
{/if}


<style>
  .label-input {
    font-weight: 600;
  }
 .error-message {
    color: red;
    background-color: #ffe6e6;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    font-size: 0.9rem;
    text-align: center;
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

  .modal-content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    z-index: 999;
    max-width: 600px;
    width: 100%;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
    height: 90%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    position: absolute;
    right: 1rem;
    top: 1rem;
    outline: none;
  }

  .close-button:hover{
    color: #FFA959;
  }

  .modal-body {
    flex-grow: 1;
  }

  .topics-container {
    max-height: 350px;
    overflow-y: auto;
    padding-right: 10px;
    padding-top: 10px;
  }

  .profile-name-group {
    display: flex;
    align-items: center;
    gap: 1rem;
    /* width: 100%; */
  }

  .profile-image-label {
    display: block;
    text-align: center;
  }

  .profile-image-label input {
    display: none;
  }

  /* Gambar default */
.profile-image.default {
  object-fit: contain !important;
  background-color: #f0f0f0; /* Tambahkan warna latar jika diperlukan */
  border: 2px dashed #ccc; /* Tampilkan border untuk membedakan */
}

/* Gambar yang diunggah */
.profile-image {
  object-fit: cover; /* Tetap penuh untuk gambar yang diunggah */
}
.profile-image {
  width: 80px;
  height: 80px;
  min-width: 80px;
  min-height: 80px;
  border-radius: 50%; /* Biar tetap berbentuk bulat */
  object-fit: cover; /* Gambar diunggah tetap memenuhi area */
  border: 2px solid #ccc;
  background-color: #f0f0f0;
}


  img{
    width: 80px;
    height: 80px;
  }

  .form-group {
    width: 100%;
  }

  .form-group input[type="text"],
  .form-group textarea {
    width: 100%;
    margin-top: 0.25rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 4px;
    box-sizing: border-box;
  }

  .form-group textarea {
    resize: none;
    overflow-y: auto;
  }

  .is-invalid {
    border-color: red;
    box-shadow: 0 0 5px red;
  }

  .privacy-options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .privacy-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .privacy-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .privacy-icon {
    width: 24px;
    height: 24px;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
    gap: 1rem;
  }

  .actions button {
    padding: 0.1rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .pagination-dots {
    display: flex;
    justify-content: center;
    margin-top: auto;
    align-items: center;
  }

  .pagination-dots span {
    display: inline-block;
    margin: 0 5px;
    font-size: 20px;
    color: #ddd;
  }

  .pagination-dots span.active {
    color: #333;
  }

  h4 {
    font-weight: bold;
  }

  .topics-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .topic-button {
    border: 1px solid #ccc;
    padding: 10px;
    cursor: pointer;
    background-color: white;
    border-radius: 20px;
    transition: background-color 0.3s ease, border-color 0.3s ease;
  }

  .topic-button:hover {
    background-color: #FFD1A7;
  }

  .topic-button.selected {
    background-color: #FFA959;
    color: white;
    border: none;
  }

  .actions button.primary:disabled {
    background-color: #c0c0c0; 
    color: #ffffff;
    cursor: not-allowed; 
    opacity: 0.6; 
}

.actions button.primary {
    background-color: #007bff;
    color: white;
}

.actions button.secondary {
    background-color: #6c757d;
    color: white;
}
.actions button.secondary:focus, .actions button.primary:focus{
  outline: none;
}

</style>
