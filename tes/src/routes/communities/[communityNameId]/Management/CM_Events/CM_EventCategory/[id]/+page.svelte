<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import ButtonBack from '$lib/component/ButtonBack.svelte';
  import DropdownCard from '$lib/component/DropdownCard.svelte';
  import Modal from '$lib/component/Modal.svelte';
  import ModalSuccess from '$lib/component/ModalSuccess.svelte';
  import ModalDelete from '$lib/component/ModalDelete.svelte';
  import Loading from '$lib/component/Loading.svelte';
  import { getJwtToken, extractIdFromUrl} from '$lib/js/utils';

  let categories = [];
  let showModal = false;
  let showSuccessModal = false;
  let showDeleteModal = false;
  let deleteModalText = '';
  let successMessage = 'Successfully Added Event Category';
  let loading = true;

  onMount(async () => {
      const id = $page.params.id;
      const communityNameId = extractIdFromUrl(window.location.href);

      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${communityNameId}/event/${id}/eventcategory?page=0&pageSize=0`;
     console.log(apiUrl)
      try {
          const token = getJwtToken();
          const response = await fetch(apiUrl, {
              headers: {
                  'Authorization': `Bearer ${token}`,
              },
          });

          const data = await response.json();
          if (response.ok && data.status === 200) {
              // Load event categories
              categories = await Promise.all(data.data.map(async category => {
                  // Fetch event sessions for each category
                  const sessionApiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${communityNameId}/event/${id}/eventcategory/${category.id}/eventsession?page=0&pageSize=0`;
                  const sessionResponse = await fetch(sessionApiUrl, {
                      headers: {
                          'Authorization': `Bearer ${token}`,
                      },
                  });

                  const sessionData = await sessionResponse.json();
                  let sessions = [];
                  if (sessionResponse.ok && sessionData.status === 200) {
                      sessions = sessionData.data.map(session => ({
                          date: new Date(session.tgl_mulai).toLocaleDateString(),
                          time: `${new Date(session.tgl_mulai).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(session.tgl_selesai).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                      }));
                  }

                  return {
                      id: category.id,
                      title: category.nama_event_category,
                      quota: `${category.kuota} participants`,
                      price: `Rp. ${category.price.toLocaleString()}`,
                      description: category.deskripsi,
                      sessions: sessions,
                      eventId: id
                  };
              }));
          } else {
              console.error('Failed to load event categories:', data.message);
          }
      } catch (error) {
          console.error('Error fetching event categories:', error);
      } finally {
          loading = false;
      }
  });

  function handleAddCategory() {
      const communityNameId = $page.params.communityNameId;
      const eventId = $page.params.id;
      window.location.href = `/communities/${communityNameId}/Management/CM_Events/CM_EventCategory/${eventId}/CM_CreateEventCategory`;
  }

  function handleCloseModal() {
      showModal = false;
  }

  function handleSaveCategory() {
      showModal = false;
      showSuccessModal = true;
  }

  function handleCloseSuccessModal() {
      showSuccessModal = false;
  }

  function handleDeleteModalClose() {
      showDeleteModal = false;
  }

  function handleDeleteConfirm() {
      console.log('Confirmed delete');
      showDeleteModal = false;
  }

  function openDeleteModal(category) {
      deleteModalText = `Are you sure you want to delete the ${category.title} category? This action cannot be undone.`;
      showDeleteModal = true;
  }

  function handleEditCategory(title) {
      console.log('Edit', title);
  }

  function handleDeleteCategory(title) {
      openDeleteModal({ title });
  }
</script>

<ButtonBack href="/communities/[communityNameId]/Management/CM_Events" text="Back" />

<div class="bg-white shadow-md rounded-lg p-8 mt-4">
  <h1 class="text-2xl font-bold mb-4 text-left">Event Categories</h1>

  {#if loading}
      <Loading message="Loading event categories..." />
  {:else}
      <div class="flex justify-between items-center mt-8 mb-4">
          <h2 class="text-xl font-semibold">Event Category</h2>
          <button class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700" on:click={handleAddCategory}>
            Add Event Category
          </button>
      </div>

      <div>
          {#each categories as category}
              <DropdownCard title={category.title} quota={category.quota} terms="Terms and Conditions" price={category.price}>
                  <div slot="body-content">
                      <p><strong>Event Date:</strong></p>
                      <div class="dates">
                          {#each category.sessions as session}
                              <button class="session-button">{session.date}</button>
                          {/each}
                      </div>
                      <p><strong>Event Time:</strong></p>
                      <div class="times">
                          {#each category.sessions as session}
                              <button class="session-button">{session.time}</button>
                          {/each}
                      </div>
                  </div>
      
              </DropdownCard>
          {/each}
      </div>
  {/if}
</div>

<Modal bind:show={showModal} title="Add Event Category" on:close={handleCloseModal}>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextInput label="Event Category Name" placeholder="Enter category name" />
      <TextInput label="Event Category Quota" placeholder="Enter category quota" />
      <TextareaInput label="Event Category Description" placeholder="Enter category description" />
      <TextInput label="Event Category Price" placeholder="Enter category price" />
  </div>
  <div class="mt-4 flex justify-end space-x-2">
      <button class="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400" on:click={handleCloseModal}>
          Cancel
      </button>
      <button class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700" on:click={handleSaveCategory}>
          Save
      </button>
  </div>
</Modal>

<ModalSuccess bind:show={showSuccessModal} {successMessage} />
<ModalDelete isOpen={showDeleteModal} headerText="Delete Event Category" bodyText={deleteModalText} onClose={handleDeleteModalClose} onConfirm={handleDeleteConfirm} />

<style>
  .bg-white {
      background-color: white;
  }

  .shadow-md {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .rounded-lg {
      border-radius: 8px;
  }

  .dates, .times {
      display: flex;
      gap: 10px;
      margin-top: 10px;
  }

  .session-button {
      background-color: #f1f5f9;
      border: 1px solid #e2e8f0;
      padding: 8px 12px;
      border-radius: 5px;
      font-size: 0.875rem;
      color: #1e293b;
  }

  .session-button:hover {
      background-color: #e2e8f0;
  }

  .rotated {
      transform: rotate(180deg);
  }
</style>
