<script lang="ts">
  import { onMount } from 'svelte';
  import EventCard from '$lib/component/EventCard.svelte';
  import { getJwtToken } from '$lib/js/utils';

  let eventItems = []; // Array to hold event data
  let loading = true;  // Loading state to handle API fetching
  let error = null;    // Error state

  // Function to format date
  function formatDateRange(startDateStr, endDateStr) {
    const startDate = new Date(startDateStr);
    const endDate = endDateStr ? new Date(endDateStr) : null;

    const dateFormatter = new Intl.DateTimeFormat('id-ID', {
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });

    const timeFormatter = new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit', 
      minute: '2-digit'
    });

    const formattedStartDate = dateFormatter.format(startDate);
    const formattedStartTime = timeFormatter.format(startDate);

    if (!endDate) {
      return `${formattedStartDate}, ${formattedStartTime}`;
    }

    const formattedEndDate = dateFormatter.format(endDate);
    const formattedEndTime = timeFormatter.format(endDate);

    if (startDate.toDateString() === endDate.toDateString()) {
      return `${formattedStartDate}, ${formattedStartTime} - ${formattedEndTime}`;
    } else {
      return `${formattedStartDate}, ${formattedStartTime} - ${formattedEndDate}, ${formattedEndTime}`;
    }
  }

  // Function to fetch events from the API
  async function fetchEvents() {
    const token = getJwtToken(); // Assuming you need JWT token for authentication
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/eventpublic?page=0&pageSize=0`;

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (result.status === 200) {
        eventItems = result.data.map(event => ({
          imageSrc: `${import.meta.env.VITE_API_BASE_URL}/getfoto?path=${event.foto}`,
          eventId: event.id,
          eventName: event.nama_event,
          communityName: event.Komunitas ? event.Komunitas.nama_komunitas : 'Unknown Community',
          communityId: event.komunitas_id,
          formattedDateRange: formatDateRange(event.tgl_mulai_kegiatan, event.tgl_selesai_kegiatan),
        }));
      } else {
        error = "Failed to fetch events";
      }
    } catch (err) {
      error = err.message;
    } finally {
      loading = false; // Set loading to false once data is fetched or error occurs
    }
  }

  onMount(() => {
    fetchEvents(); // Fetch events when component is mounted
  });
</script>

<main>
  <h2>All Events</h2>

  {#if loading}
    <p>Loading events...</p>
  {/if}

  {#if error}
    <p>{error}</p>
  {/if}

  {#if !loading && !error}
    <section class="event-section">
      {#each eventItems as event}
        <EventCard 
          imageSrc={event.imageSrc} 
          eventId={event.eventId} 
          eventName={event.eventName} 
          communityName={event.communityName} 
          communityId={event.communityId}
          formattedDateRange={event.formattedDateRange}
        />
      {/each}
    </section>
  {/if}
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
  }

  .event-section {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    padding-top: 20px;
  }

  p {
    font-size: 1rem;
    color: #555;
  }
</style>
