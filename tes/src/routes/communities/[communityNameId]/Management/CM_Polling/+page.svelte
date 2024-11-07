<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import Polling from '$lib/component/Polling.svelte';
  import Modal from '$lib/component/Modal.svelte';
  import TextInput from '$lib/component/TextInput.svelte';
  import Loading from '$lib/component/Loading.svelte'; 
  import deleteicon from '$lib/images/deleteO-merah.svg';
  import { getJwtToken, getUserId, extractIdFromUrl } from '$lib/js/utils';

  let showCreateModal = false;
  let showEditModal = false;
  let showDeleteModal = false;
  let selectedPolling = null;
  let pollings = [];
  let communityNameId;
  let isLoading = false; 

  let newQuestion = '';
  let newOptions = ['', '', '']; 
  let errorMessage = ''; 

  // Ambil community ID dari URL
  communityNameId = extractIdFromUrl(window.location.href);

  // Fetch polling data ketika komponen dimuat
  onMount(async () => {
    await fetchPollings();
  });

  // Function untuk fetch polling dari API
  async function fetchPollings() {
    try {
      const token = getJwtToken();
      communityNameId = extractIdFromUrl(window.location.href);

      if (!token) {
        console.error('Authentication token not found.');
        return;
      }

      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${communityNameId}/polling?page=0&pageSize=0`;

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.status === 200) {
        pollings = data.data.map(polling => ({
          id: polling.id,
          question: polling.pertanyaan,
          options: polling.polling_pilihan.map(p => ({
            id: p.id, 
            jawaban: p.jawaban
          })),
          votes: polling.polling_pilihan.map(p => p.jumlah_menjawab)
        }));
      } else {
        console.error(`Failed to fetch pollings: ${data.message}`);
      }
    } catch (error) {
      console.error('Error fetching pollings:', error);
    }
  }

  // Function untuk membuka modal create
  function openCreateModal() {
    showCreateModal = true;
    errorMessage = ''; 
  }

  // Function untuk menutup modal create
  function handleCloseCreateModal() {
    showCreateModal = false;
    newQuestion = ''; 
    newOptions = ['', '', '']; 
    errorMessage = ''; 
  }

  // Function untuk membuat polling
  async function createPolling() {
    try {
      isLoading = true; 
      const token = getJwtToken();
      if (!token) {
        console.error('Authentication token not found.');
        isLoading = false; 
        return;
      }

      const filteredOptions = newOptions.filter(option => option.trim() !== '');

      if (filteredOptions.length < 2) {
        errorMessage = 'Please provide at least two options.';
        isLoading = false;
        return;
      }

      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${communityNameId}/polling`;

      const body = {
        pertanyaan: newQuestion,
        anggota_komunitas_id: parseInt(getUserId(), 10),
        polling_pilihan: filteredOptions.map(option => ({ jawaban: option }))
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Polling created successfully');
        handleCloseCreateModal();
        await fetchPollings();
      } else {
        const errorData = await response.json();
        console.error(`Failed to create polling: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error creating polling:', error);
    } finally {
      isLoading = false;
    }
  }

  // Function untuk membuka modal edit
  function openEditModal(polling) {
    selectedPolling = {
      ...polling,
      options: [
        { id: polling.options?.[0]?.id || null, jawaban: polling.options?.[0]?.jawaban || '' },
        { id: polling.options?.[1]?.id || null, jawaban: polling.options?.[1]?.jawaban || '' },
        { id: polling.options?.[2]?.id || null, jawaban: polling.options?.[2]?.jawaban || '' },
      ]
    };
    showEditModal = true;
  }

  // Function untuk menutup modal edit
  function handleCloseEditModal() {
    showEditModal = false;
  }

  // Function untuk mengupdate polling
  async function updatePolling() {
    try {
      isLoading = true; 
      const token = getJwtToken();
      if (!token) {
        console.error('Authentication token not found.');
        isLoading = false; 
        return;
      }

      const updateQuestionUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${communityNameId}/polling/update/${selectedPolling.id}`;

      const questionBody = {
        pertanyaan: selectedPolling.question,
        anggota_komunitas_id: parseInt(getUserId(), 10)
      };

      const response = await fetch(updateQuestionUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(questionBody),
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Question updated successfully');
      } else {
        const errorData = await response.json();
        console.error(`Failed to update question: ${errorData.message}`);
        return;
      }

      for (const option of selectedPolling.options) {
        if (option.id && option.jawaban.trim() !== '') {
          const updateOptionUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/admin/pollingpilihan/update/${option.id}`;
          
          const optionBody = {
            jawaban: option.jawaban
          };

          const optionResponse = await fetch(updateOptionUrl, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(optionBody),
            credentials: 'include',
          });

          if (optionResponse.ok) {
            console.log(`Option with ID ${option.id} updated successfully`);
          } else {
            const optionErrorData = await optionResponse.json();
            console.error(`Failed to update option with ID ${option.id}: ${optionErrorData.message}`);
          }
        } else {
          console.error(`Failed to update option: Invalid or missing ID`);
        }
      }

      handleCloseEditModal();
      await fetchPollings(); 
    } catch (error) {
      console.error('Error updating polling:', error);
    } finally {
      isLoading = false; 
    }
  }


  function openDeleteModal(polling) {
    selectedPolling = polling;
    showDeleteModal = true;
  }


  function handleCloseDeleteModal() {
    showDeleteModal = false;
  }

  async function deletePolling() {
    try {
      isLoading = true; 
      const token = getJwtToken();
      if (!token) {
        console.error('Authentication token not found.');
        isLoading = false; 
        return;
      }

      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${communityNameId}/polling/delete/${selectedPolling.id}`;

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Polling deleted successfully');
        handleCloseDeleteModal(); 
        await fetchPollings(); 
      } else {
        const errorData = await response.json();
        console.error(`Failed to delete polling: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error deleting polling:', error);
    } finally {
      isLoading = false;
    }
  }

</script>

{#if isLoading}
  <Loading message="Processing, please wait..." />
{/if}

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Polling</h1>

  <div class="mb-4">
    <button 
      class="create-btn text-white px-4 py-2 rounded" 
      on:click={openCreateModal}>
      Create Polling
    </button>
  </div>

  <div class="pollings-grid">
    {#each pollings as polling}
      <Polling 
        question={polling.question}
        options={polling.options.map(o => o.jawaban)}
        votes={polling.votes}
        onEdit={() => openEditModal(polling)}
        onDelete={() => openDeleteModal(polling)}
        pollId={polling.id}
      />
    {/each}
  </div>
</div>

<Modal title="Create Polling" bind:show={showCreateModal} onClose={handleCloseCreateModal}>
  <TextInput label="Polling Question" placeholder="Enter your question..." bind:value={newQuestion} />
  <TextInput label="Option Polling" placeholder="Enter option 1..." bind:value={newOptions[0]} />
  <TextInput label="Option Polling" placeholder="Enter option 2..." bind:value={newOptions[1]} />
  <TextInput label="Option Polling" placeholder="Enter option 3..." bind:value={newOptions[2]} />
  {#if errorMessage}
    <p class="text-red-500">{errorMessage}</p>
  {/if}
  <div class="flex justify-end space-x-2 mt-4">
    <button class="bg-gray-400 text-white px-4 py-2 rounded" on:click={handleCloseCreateModal}>Cancel</button>
    <button class="bg-blue-500 text-white px-4 py-2 rounded" on:click={createPolling}>Save</button>
  </div>
</Modal>

<Modal title="Edit Polling" bind:show={showEditModal} onClose={handleCloseEditModal}>
  <TextInput label="Polling Question" placeholder="Enter your question..." bind:value={selectedPolling.question} />
  <TextInput label="Option Polling" placeholder="Enter option 1..." bind:value={selectedPolling.options[0].jawaban} />
  <TextInput label="Option Polling" placeholder="Enter option 2..." bind:value={selectedPolling.options[1].jawaban} />
  <TextInput label="Option Polling" placeholder="Enter option 3..." bind:value={selectedPolling.options[2].jawaban} />
  {#if errorMessage}
    <p class="text-red-500">{errorMessage}</p>
  {/if}
  <div class="flex justify-end space-x-2 mt-4">
    <button class="bg-gray-400 text-white px-4 py-2 rounded" on:click={handleCloseEditModal}>Cancel</button>
    <button class="bg-blue-500 text-white px-4 py-2 rounded" on:click={updatePolling}>Save</button>
  </div>
</Modal>


<Modal title="Delete Polling" bind:show={showDeleteModal} onClose={handleCloseDeleteModal}>
  <div class="delete-modal-content">
    <div class="icon-container">
      <img src={deleteicon} alt="Delete Icon" class="delete-icon">
    </div>
    <h2 class="delete-title">Delete Polling</h2>
    <p class="delete-description">Are you sure want to delete this polling?</p>
    <p class="delete-warning">*This action cannot be irreversible</p>
    <div class="modal-actions">
      <button class="cancel-btn" on:click={handleCloseDeleteModal}>Cancel</button>
      <button class="delete-btn" on:click={deletePolling}>Yes, delete</button>
    </div>
  </div>
</Modal>


<style>
  .container {
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .pollings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .text-2xl {
    font-size: 1.5rem;
  }

  .font-bold {
    font-weight: bold;
  }

  .mb-4 {
    margin-bottom: 1rem;
  }

  .flex {
    display: flex;
  }

  .justify-end {
    justify-content: flex-end;
  }

  .space-x-2 > :not(:first-child) {
    margin-left: 0.5rem;
  }

  .rounded {
    border-radius: 0.375rem;
  }

  .bg-gray-400 {
    background-color: #bdbdbd;
  }

  .bg-blue-500 {
    background-color: #3b82f6;
  }

  .bg-red-500 {
    background-color: #ef4444;
  }

  .text-white {
    color: white;
  }

  .create-btn {
  background-color: #0F1426;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
}

.create-btn:hover {
  background-color: #FFA049;
}

.delete-modal-content {
  text-align: center;
  padding: 20px;
}

.icon-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.delete-icon {
  width: 60px;
  height: 60px;
}

.delete-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.delete-description {
  font-size: 1rem;
  margin-bottom: 8px;
}

.delete-warning {
  color: red;
  font-style: italic;
  margin-bottom: 16px;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.cancel-btn {
  background-color: #BDBDBD;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.delete-btn {
  background-color: white;
  color: red;
  border: 2px solid red;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #FFEEEE;
}

.cancel-btn:hover {
  background-color: #A0A0A0;
}


  @media (min-width: 640px) {
    .pollings-grid {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }
  }
</style>
