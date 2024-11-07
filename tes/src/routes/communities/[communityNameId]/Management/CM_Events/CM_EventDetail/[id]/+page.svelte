<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { page } from '$app/stores'; 
  import { getJwtToken } from '$lib/js/utils';
  import { goto } from '$app/navigation'; 
  import NotificationWithButton from '$lib/component/NotificationWithButton.svelte'; 

  let event = null;
  let eventDetails = [];
  let loading = true;
  let communityNameId;
  let posterUrl = '';
  
  onMount(async () => {
    try {
      const id = $page.params.id; 
      communityNameId = $page.params.communityNameId;

      const apiUrl = `http://leap.crossnet.co.id:3010/api/v1/users/komunitas/1/event/${id}`;
      const token = getJwtToken();

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.status === 200) {
        event = data.data;
        posterUrl = `http://leap.crossnet.co.id:3010/getfoto?path=${data.data.foto}`;
        eventDetails = [
          { label: 'Event Name', value: event.nama_event },
          { label: 'Registration Date', value: `${new Date(event.tgl_mulai_pendaftaran).toLocaleDateString()} - ${new Date(event.tgl_selesai_pendaftaran).toLocaleDateString()}` },
          { label: 'Event Start Date', value: new Date(event.tgl_mulai_kegiatan).toLocaleDateString() },
          { label: 'Event End Date', value: new Date(event.tgl_selesai_kegiatan).toLocaleDateString() },
          { label: 'Participant Quota', value: `${event.total_kuota} participant` },
          { label: 'Event Status', value: event.status },
          { label: 'Event Status Privacy', value: event.if_public === '1' ? 'Public' : 'Private' },
          { label: 'Registration Fee', value: `Rp. ${event.biaya}` },
          { label: 'Event Location', value: event.lokasi_event },
          { label: 'Event Description', value: event.deskripsi },
          { label: 'Event Poster', value: `<img src="${posterUrl}" class="event-poster" alt="Event Poster" />` }
        ];
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      loading = false;
    }
  });

  function handleEdit() {
    goto(`/communities/${communityNameId}/Management/CM_EditEvent/${event.id}`);
  }

  function handleParticipants() {
    goto(`/communities/${communityNameId}/Management/CM_Events/CM_Payment/CM_AcceptedParticipants/[id]`);
  }

  function handleDelete() {
    alert('Delete event functionality');
  }
</script>

<main class="p-4">
  <button on:click={() => goto(`/communities/${communityNameId}/Management/CM_Events`)} class="btn-back">Back</button>

  <div class="bg-white shadow-md rounded-lg p-8 mt-4">
    {#if loading}
      <p>Loading event details...</p>
    {:else if event}
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold mb-4">Detail Event: {event.nama_event}</h1>
        <div class="flex space-x-2">
          <button class="btn-icon participants" on:click={handleParticipants}>
            <img src="/src/lib/images/participants.svg" alt="Participants" />
            <span>Participants</span>
          </button>
          <button class="btn-icon edit" on:click={handleEdit}>
            <img src="/src/lib/images/edit.svg" alt="Edit" />
            <span>Edit</span>
          </button>
          <button class="btn-icon delete" on:click={handleDelete}>
            <img src="/src/lib/images/delete.svg" alt="Delete" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <table class="detail-table">
        {#each eventDetails as detail}
          <tr>
            <td class="label">{detail.label}</td>
            <td class="value" class:poster-cell={detail.label === 'Event Poster'}>
              {@html detail.value}
            </td>
          </tr>
        {/each}
      </table>

      <NotificationWithButton 
        message="You can manage your event by using event categories."
        buttonText="Event Category Management"
        buttonHref={`/communities/${communityNameId}/Management/CM_Events/CM_EventDetail/${event.id}/CM_EventCategory`} 
        svgPath="/src/lib/images/warning-blue.svg"
      />

      <div class="terms-container">
        <h2 class="text-lg font-semibold mb-2">Terms and Conditions</h2>
        <div class="terms-content">
          <p>{event.termcondition || 'No TERMS AND CONDITIONS'}</p>
        </div>
      </div>

      <div class="question-container">
        <h2 class="text-lg font-semibold mb-2">Event Question Field</h2>
        <div class="question-content">
          <div class="question">
            <h3>Question 1</h3>
            <p>{event.field_pertanyaan_1 || 'No question provided.'}</p>
          </div>
          <div class="question">
            <h3>Question 2</h3>
            <p>{event.field_pertanyaan_2 || 'No question provided.'}</p>
          </div>
          <div class="question">
            <h3>Question 3</h3>
            <p>{event.field_pertanyaan_3 || 'No question provided.'}</p>
          </div>
        </div>
      </div>
    {:else}
      <p>Event not found.</p>
    {/if}
  </div>
</main>

<style>
  .btn-back {
    background-color: #e2e2e2;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    border: none;
    cursor: pointer;
  }

  .detail-table {
    width: 100%;
    margin-bottom: 1.5rem;
    border-collapse: collapse;
  }

  .detail-table td {
    padding: 0.75rem;
    border: 1px solid #e2e2e2;
  }

  .detail-table .label {
    font-weight: bold;
    background-color: #f9f9f9;
  }

  .detail-table .poster-cell {
    text-align: center;
  }

  .event-poster {
    width: 100px;
    height: auto;
    border-radius: 8px;
    object-fit: cover;
  }

  .terms-container,
  .question-container {
    margin-bottom: 2rem;
  }

  .terms-content {
    padding: 1rem;
    border: 1px solid #e2e2e2;
    border-radius: 8px;
  }

  .question-content {
    border: 1px solid #e2e2e2;
    border-radius: 8px;
    padding: 1rem;
  }

  .question {
    padding: 0.75rem;
    border: 1px solid #e2e2e2;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .btn-icon {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    color: white;
    text-transform: uppercase;
    font-weight: bold;
    border: none;
  }

  .btn-icon span {
    margin-left: 0.5rem;
  }

  .participants {
    background-color: #FF9029;
  }

  .edit {
    background-color: #007AFF;
  }

  .delete {
    background-color: #EA4036;
  }
</style>
