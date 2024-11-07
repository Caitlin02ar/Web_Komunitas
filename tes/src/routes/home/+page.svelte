<script lang="ts">
  import { onMount } from 'svelte';
  import Carousel from '$lib/component/Carousel.svelte';
  import { getJwtToken } from '$lib/js/utils';
  import CommunityCard from '$lib/component/CommunityCard.svelte';
  import EventCard from '$lib/component/EventCard.svelte';
  import Loading from '$lib/component/Loading.svelte';
  import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

  let themeItems = [];
  let communityItems = [];
  let eventItems = [];
  let isLoading = true;

  function formatDate(dateStr: string, showTime = true): string {
    const date = new Date(dateStr);
    const dateFormatter = new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const timeFormatter = new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const formattedDate = dateFormatter.format(date);
    const formattedTime = showTime ? timeFormatter.format(date) : '';

    return showTime ? `${formattedDate}, ${formattedTime}` : formattedDate;
  }

  function formatEventDateRange(startDateStr: string, endDateStr: string): string {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const isSameDay = startDate.toDateString() === endDate.toDateString();
    const isTimeOnlyDate = startDate.getHours() === 0 && startDate.getMinutes() === 0;

    if (isSameDay) {
      return `${formatDate(startDateStr, false)}\n${formatDate(startDateStr, true).split(", ")[1]}-${formatDate(endDateStr, true).split(", ")[1]}`;
    } else {
      const formattedStart = isTimeOnlyDate ? formatDate(startDateStr, false) : formatDate(startDateStr, true);
      const formattedEnd = isTimeOnlyDate ? formatDate(endDateStr, false) : formatDate(endDateStr, true);
      return `${formattedStart} - ${formattedEnd}`;
    }
  }

  onMount(async () => {
    if (browser) {
      const token = getJwtToken();
      if (!token) {
        console.error('Authentication token not found.');
        return;
      }
      const baseUrl = import.meta.env.VITE_API_BASE_URL;

      try {
        const [themeResponse, communityResponse, eventResponse] = await Promise.all([
          fetch(`${baseUrl}/v1/users/kategori?page=0&pageSize=0`, { headers: { 'Authorization': `Bearer ${token}` }, credentials: 'include' }),
          fetch(`${baseUrl}/v1/users/randomkomunitas`, { headers: { 'Authorization': `Bearer ${token}` }, credentials: 'include' }),
          fetch(`${baseUrl}/v1/users/randomevent`, { headers: { 'Authorization': `Bearer ${token}` }, credentials: 'include' })
        ]);

        if (themeResponse.ok) {
          const themeResult = await themeResponse.json();
          themeItems = themeResult.data.map(item => ({ imageSrc: 'src/lib/images/themeCard.svg', title: item.nama_kategori, subtitle: 'Communities' }));
        } else {
          console.error(`Error fetching theme items: ${themeResponse.statusText}`);
        }

        if (communityResponse.ok) {
          const communityResult = await communityResponse.json();
          communityItems = communityResult.data.map(item => ({
              imageSrc: `${import.meta.env.VITE_API_BASE_URL}/getfoto?path=${item.gambar_komunitas}`,
              communityName: item.nama_komunitas,
              tags: item.subkategori_mm_komunitas.map(sub => sub.sub_kategori.nama_subkategori),
              memberCount: item.jumlah_anggota,
              description: item.deskripsi_komunitas,
              buttonText: 'Detail',
              visibility: item.status_privasi,
              communityId: item.id
          }));
        } else {
          console.error(`Error fetching community items: ${communityResponse.statusText}`);
        }

        if (eventResponse.ok) {
          const eventResult = await eventResponse.json();
          eventItems = eventResult.data.map(item => ({
            eventId: item.id,
            imageSrc: `${import.meta.env.VITE_API_BASE_URL}/getfoto?path=${item.foto}` || 'src/lib/images/event.svg',
            eventName: item.nama_event,
            communityName: item.Komunitas.nama_komunitas,
            communityId: item.komunitas_id,
            startDate: item.tgl_mulai_kegiatan,
            formattedDateRange: formatEventDateRange(item.tgl_mulai_kegiatan, item.tgl_selesai_kegiatan)
          }));
        } else {
          console.error(`Error fetching event items: ${eventResponse.statusText}`);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        isLoading = false;
      }
    }
  });
</script>

<main>
  <Carousel items={themeItems} />

  {#if isLoading}
    <Loading message="Loading communities..." />
  {:else}
    <h2>Explore Communities</h2>
    <section class="community-section">
      {#each communityItems as community}
        <CommunityCard 
          imageSrc={community.imageSrc} 
          communityName={community.communityName} 
          tags={community.tags} 
          memberCount={community.memberCount} 
          description={community.description} 
          buttonText={community.buttonText} 
          visibility={community.visibility}
          communityId={community.communityId}
        />
      {/each}
      
      <div class="see-more">
        <button on:click={() => goto('/communities/categories/all')}>
          <div class="icon-circle">
            <img src="src/lib/images/panahkanan.svg" alt="See more" class="arrow-icon" width="24" height="24" />
          </div>
          <span>See more</span>
        </button>
      </div>
    </section>

    <h2>Community Events</h2>
    <section class="event-section"> 
      {#each eventItems as event}
        <EventCard 
          eventId={event.eventId}
          imageSrc={event.imageSrc} 
          eventName={event.eventName} 
          communityName={event.communityName} 
          startDate={event.startDate} 
          formattedDateRange={event.formattedDateRange}
          communityId={event.communityId}
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

  .community-section {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    padding-top: 20px;
    align-items: start;
  }

  .see-more {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center; /* Pusatkan secara vertikal */
    margin-top: 60px;
    }

  .see-more button {
    background: none;
    border: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    color: #333;
    padding: 0;
    outline: none;
  }

  .icon-circle {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
  }

  .arrow-icon {
    width: 24px;
    height: 24px;
  }

  .see-more span {
    font-size: 16px;
    color: #333;
    text-align: center;
  }

  .event-section {
    display: flex;
    overflow-x: auto;
    gap: 16px;
    padding-top: 20px;
  }

  .event-section::-webkit-scrollbar {
    display: none;
  }

  .event-section {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
