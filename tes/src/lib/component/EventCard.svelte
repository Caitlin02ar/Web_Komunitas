<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';  // Correct import for $page

  export let imageSrc: string = '';
  export let eventId: string = ''; 
  export let eventName: string = '';
  export let communityName: string = '';
  export let communityId: string = '';
  export let formattedDateRange: string = ''; 

  const toUrlFriendly = (name: string): string => {
    return encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'));
  };

  const navigateToEvent = () => {
    const urlFriendlyEventName = toUrlFriendly(eventName);
    const eventPathSegment = `${urlFriendlyEventName}-${eventId}`;
    let basePath = $page.url.pathname;

    // Check if the current path includes 'communities'
    if (!basePath.includes('communities')) {
      // Build path from community details if not already in a community-specific URL
      const urlFriendlyCommunityNameId = toUrlFriendly(`${communityName.replace(/\s+/g, '-').toLowerCase()}-${communityId}`);
      basePath = `/communities/${urlFriendlyCommunityNameId}/events`;
    }

    const fullPath = `${basePath}/${eventPathSegment}`;
    goto(fullPath);
  };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="card" on:click={navigateToEvent} data-event-id={eventId}>
  <img src={imageSrc} alt={eventName} class="card-image" />
  <div class="overlay">
    <div class="text">
      <h2>{eventName}</h2>
      <p>{communityName}</p>
      <p>{formattedDateRange}</p>
    </div>
  </div>
</div>


<style>
  .card {
    position: relative;
    width: 100%;
    max-width: 300px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .card:hover {
    transform: translateY(-5px);
  }

  .card-image {
    width: 100%;
    height: 220px; /* Increased height */
    object-fit: cover; /* Ensure the image covers the area without distortion */
  }

  .overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, #000, rgba(0, 0, 0, 0));
    overflow: hidden;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 10px;
  }

  .text {
    color: white;
    text-align: left;
    width: 100%;
    padding-left: 10px;
  }

  .text h2 {
    margin: 0;
    font-size: 1rem;
    font-weight: bold;
  }

  .text p {
    margin: 0;
    font-size: 0.75rem;
    font-weight: normal;
  }
</style>
