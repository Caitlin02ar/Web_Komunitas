<script lang="ts">
  import { onMount } from 'svelte';
  import { getJwtToken, extractIdFromUrl, getUserId } from '$lib/js/utils';
  import { browser } from '$app/environment';
  import Calendar from '$lib/component/CalendarUser.svelte';
  import Loading from '$lib/component/Loading.svelte';

  let events = [];
  let loading = true;
  let komunitasId = '';
  let userId = '';

  onMount(async () => {
    if (browser) {
      const token = getJwtToken();
      komunitasId = extractIdFromUrl(window.location.href);
      userId = getUserId();

      const baseUrl = import.meta.env.VITE_API_BASE_URL;

      try {
        const response = await fetch(`${baseUrl}/v1/users/komunitas/${komunitasId}/userschedule/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (result.status === 200) {
          events = [
            ...result.data.AksesSubGroupKomunitasSchedule.map(schedule => ({
              date: schedule.KomunitasSchedule.tgl_mulai.split('T')[0], // Extract start date portion
              endDate: schedule.KomunitasSchedule.tgl_selesai.split('T')[0], // Extract end date portion
              title: schedule.KomunitasSchedule.nama_schedule,
              time: `${new Date(schedule.KomunitasSchedule.tgl_mulai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - ${new Date(schedule.KomunitasSchedule.tgl_selesai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`
            })),
            ...result.data.SubGroupSchedule.map(schedule => ({
              date: schedule.tgl_mulai.split('T')[0],
              endDate: schedule.tgl_selesai.split('T')[0],
              title: schedule.nama_schedule,
              time: `${new Date(schedule.tgl_mulai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - ${new Date(schedule.tgl_selesai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`
            }))
          ];
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
