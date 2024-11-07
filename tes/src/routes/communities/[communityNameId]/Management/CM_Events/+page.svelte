<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import Table from '$lib/component/Table.svelte';
  import CustomButton from '$lib/component/CustomButton.svelte';
  import { getJwtToken, extractIdFromUrl } from '$lib/js/utils';

  let columns = ['Event Name', 'Quota', 'Event Date', 'Price', 'Status', 'Action'];
  let rows = [];
  let communityNameId;
  let isLoading = false;
  let showDeleteModal = false;
  let selectedEventId = null; // Holds the eventId to be deleted
  let message = "";

  $: communityNameId = extractIdFromUrl(window.location.href);

  const buttons = [
    {
      text: 'Create Event',
      href: `${window.location.href}/CM_CreateEvents`,
      color: '#0F1426', 
      hoverColor: '#FF9029', 
      svgPath: '/src/lib/images/plus.svg',
    },
    {
      text: 'Community Schedule',
      href: `${window.location.href}/CM_CommunitySchedule`,
      color: '#0F1426', 
      hoverColor: '#FF9029', 
      svgPath: '/src/lib/images/calendar_white.svg', 
    }
  ];

  const actions = [
    { 
      text: 'Event Detail', 
      fn: (id) => { window.location.href = `${window.location.href}/CM_EventDetail/${id}`; }
    },
    { 
      text: 'Edit Event', 
      fn: (id) => { window.location.href = `${window.location.href}/CM_EditEvent/${id}`; }
    },
    { 
      text: 'Delete Event', 
      fn: (id) => { 
        selectedEventId = id; 
        showDeleteModal = true; // Show delete confirmation modal
      } 
    },
    { 
      text: 'Payment Management', 
      fn: (id) => { window.location.href = `${window.location.href}/CM_Payment/CM_RegisteredParticipants/${id}`; }
    }
  ];

  let currentPage = 1;
  let pageSize = 10;

  // onMount function to fetch the data
  onMount(async () => {
    isLoading = true;

    try {
      const token = getJwtToken();
      if (!token) {
        console.error('Authentication token not found.');
        return;
      }

      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${communityNameId}/event?page=${currentPage}&pageSize=0`;

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok && data.status === 200) {
        rows = data.data.map(event => [
          event.nama_event,
          `${event.total_kuota} person`,
          `${new Date(event.tgl_mulai_kegiatan).toLocaleDateString()} - ${new Date(event.tgl_selesai_kegiatan).toLocaleDateString()}`,
          `Rp. ${event.biaya.toLocaleString()}`,
          event.status,
          event.id
        ]);
      } else {
        console.error(`Failed to fetch events: ${data.message}`);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      isLoading = false;
    }
  });

  // Function to handle deletion
  async function confirmDelete() {
    try {
      const token = getJwtToken();
      const apiUrl = `http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityNameId}/event/delete/${selectedEventId}`;

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok && data.status === 200) {
        message = "Event deleted successfully!";
        rows = rows.filter(row => row[5] !== selectedEventId); // Remove the deleted event from rows
        showDeleteModal = false;
      } else {
        message = `Failed to delete event: ${data.message}`;
      }
    } catch (error) {
      message = "An error occurred while deleting the event.";
      console.error(error);
    }
  }
</script>

<main class="p-4">
  <h1 class="text-2xl font-bold mb-4 text-left">Event Community</h1>
  <div class="mb-4 flex space-x-2">
    {#each buttons as button}
      <CustomButton text={button.text} href={button.href} color={button.color} hoverColor={button.hoverColor} svgPath={button.svgPath} />
    {/each}
  </div>
  <Table {columns} {rows} bind:currentPage bind:pageSize {actions} />

  <!-- Delete Modal -->
  {#if showDeleteModal}
    <div class="modal-overlay">
      <div class="modal">
        <h3>Delete Event</h3>
        <p>Are you sure you want to delete this event?</p>
        <div class="modal-actions">
          <button class="cancel-button" on:click={() => showDeleteModal = false}>Cancel</button>
          <button class="delete-button" on:click={confirmDelete}>Yes, Delete</button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Message display -->
  {#if message}
    <div class="mt-4 text-red-600">{message}</div>
  {/if}
</main>

<style>
  main {
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    width: 300px;
    max-width: 100%;
  }

  .modal-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }

  .cancel-button, .delete-button {
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }

  .cancel-button {
    background-color: #ccc;
  }

  .delete-button {
    background-color: red;
    color: white;
  }
</style>
