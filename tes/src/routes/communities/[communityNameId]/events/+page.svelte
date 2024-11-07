<script lang="ts">
    import { onMount } from 'svelte';
    import EventCard from '$lib/component/EventCard.svelte';
    import Loading from '$lib/component/Loading.svelte'; // Import Loading component
    import { getJwtToken, extractIdFromUrl } from '$lib/js/utils';

    let eventItems = [];
    let loading = true;
    let error = null;

    function formatDateRange(startDateStr, endDateStr) {
        const startDate = new Date(startDateStr);
        const endDate = endDateStr ? new Date(endDateStr) : null;
        const dateFormatter = new Intl.DateTimeFormat('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const timeFormatter = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' });
        const formattedStartDate = dateFormatter.format(startDate);
        const formattedStartTime = timeFormatter.format(startDate);

        if (!endDate) {
            return `${formattedStartDate}, ${formattedStartTime}`;
        }

        const formattedEndDate = dateFormatter.format(endDate);
        const formattedEndTime = timeFormatter.format(endDate);
        return startDate.toDateString() === endDate.toDateString() ?
            `${formattedStartDate}, ${formattedStartTime} - ${formattedEndTime}` :
            `${formattedStartDate}, ${formattedStartTime} - ${formattedEndDate}, ${formattedEndTime}`;
    }

    async function fetchEvents() {
    const token = getJwtToken();
    const komunitas = extractIdFromUrl(window.location.href);
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${komunitas}/event?page=0&pageSize=0`;

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
            eventItems = result.data.map(event => ({
                imageSrc: `${import.meta.env.VITE_API_BASE_URL}/${event.foto}`,
                eventId: event.id,
                eventName: event.nama_event,
                communityName: '',
                formattedDateRange: formatDateRange(event.tgl_mulai_kegiatan, event.tgl_selesai_kegiatan),
            }));
        } else {
            const errorResult = await response.json(); // Assuming error details are in the body
            error = errorResult.message || "Failed to fetch events"; // Use server-provided message or a default one
        }
    } catch (err) {
        console.error('Fetch Error:', err);
        error = err.message || "Network error";
    } finally {
        loading = false;
    }
}


    onMount(() => {
        fetchEvents();
    });
</script>

<main>
    {#if loading}
        <Loading /> <!-- Use the Loading component -->
    {/if}

    {#if error}
        <p>{error}</p>
    {/if}

    {#if !loading && !error && eventItems.length === 0}
        <p>No ongoing events are currently available in this community.</p> <!-- Custom no-event message -->
    {/if}

    {#if !loading && !error && eventItems.length > 0}
        <section class="event-section">
            {#each eventItems as event}
                <EventCard 
                    imageSrc={event.imageSrc} 
                    eventId={event.eventId} 
                    eventName={event.eventName} 
                    communityName={event.communityName} 
                    formattedDateRange={event.formattedDateRange}
                />
            {/each}
        </section>
    {/if}
</main>

<style>
    main {
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
