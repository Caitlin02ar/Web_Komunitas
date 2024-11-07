<script>
  //@ts-nocheck
  import { onMount } from 'svelte';
  import { getJwtToken, extractIdFromUrl } from '$lib/js/utils';
  import { browser } from '$app/environment';
  import Calendar from '$lib/component/CalendarCM.svelte';
  import Loading from '$lib/component/Loading.svelte';

  let events = [];
  let loading = true;
  let komunitasId = '';

  onMount(async () => {
    if (browser) {
      const token = getJwtToken();
      komunitasId = extractIdFromUrl(window.location.href);

      const baseUrl = import.meta.env.VITE_API_BASE_URL;

      try {
        const response = await fetch(`${baseUrl}/v1/users/komunitas/${komunitasId}/event?page=0&pageSize=0`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (result.status === 200) {
          events = result.data.map(event => ({
            date: event.tgl_mulai_kegiatan.split('T')[0], // Extract date portion
            title: event.nama_event,
            time: `${new Date(event.tgl_mulai_kegiatan).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.tgl_selesai_kegiatan).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`
          }));
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        loading = false;
      }
    }
  });
</script>

{#if loading}
  <Loading message="Loading events..." />
{:else}
  <Calendar {events} />
{/if}

<style>
  .container {
    display: flex;
    justify-content: center;
    padding: 24px;
  }
  
</style>
