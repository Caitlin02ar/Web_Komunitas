<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { page } from '$app/stores';
  import { extractIdFromUrl, getUserId, getJwtToken, getAnggotaKomunitasId } from '$lib/js/utils.js';

  // Define props with types and default values
  export let category: string;
  export let price: number;
  export let id: number;
  export let label_harga_kategori_event: string = 'Default Price Label';
  export let label_tgl_waktu_kategori_event: string = 'Default Date/Time Label';
  export let eventSessions: Array<{ idSession: number; dateTime: string; quota: number }> = [];

  let showDetails = false;
  let selectedSession = writable('');
  let selectedSessionId = writable<number | null>(null);
  let isBookingEnabled = writable(false);
  let eventId: string;

  const base_url = import.meta.env.VITE_API_BASE_URL;
  let cart: any[] = [];

  function toggleDetails() {
    showDetails = !showDetails;
    if (!showDetails) {
      selectedSession.set('');
      selectedSessionId.set(null);
      isBookingEnabled.set(false);
    } else if (eventSessions.length === 0) {
      showDetails = false; // Prevent opening if no sessions
    }
  }

  function selectSession(session: { dateTime: string; quota: number; idSession: number }) {
    selectedSession.set(session.dateTime);
    selectedSessionId.set(session.idSession);
    isBookingEnabled.set(session.quota > 0);
  }

  // Reactive statement to update the session id and booking status
  $: selectedSession.subscribe((session) => {
    const selected = eventSessions.find(s => s.dateTime === session);
    if (selected) {
      selectedSessionId.set(selected.idSession);
      isBookingEnabled.set(selected.quota > 0);
    }
  });

  onMount(async () => {
  const params = $page.params;
  const eventSlug = params.slug;
  const slugParts = eventSlug.split('-');
  eventId = slugParts[slugParts.length - 1];

  console.log('Event ID:', eventId);

  if (eventSessions.length > 0) {
    toggleDetails();
  }

  // Fetch cart data when the component mounts
  await fetchCartData();

  // Log props for debugging
  console.log('Props:', { category, price, id, label_harga_kategori_event, label_tgl_waktu_kategori_event, eventSessions });
});

  async function fetchCartData(){
    const userId = getUserId();
    const token = getJwtToken();
    if(!token){
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`${base_url}/v1/users/user/${userId}/cart?page=0&pageSize=0`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if(!response.ok){
        throw new Error('Network response was not ok');
      }

      const jsonResponse = await response.json();
      cart = jsonResponse.data; // Simpan data cart ke dalam state
      console.log("Data cart:", cart);    
    } catch(error){
      console.error('Error fetching cart data', error);
    }
  }

  async function addToCart() {
  try {
    const komunitasId = extractIdFromUrl(window.location.href);
    if (!komunitasId) {
      console.error('Failed to extract komunitasId from URL');
      return;
    }

    const userId = getUserId();
    const token = getJwtToken();
    const selectedSessionIdValue = $selectedSessionId;

    const anggotaKomunitasId = await getAnggotaKomunitasId(komunitasId, userId);

    const selectedEventCategory = id; // Use the ID passed from props
    const categoryExists = cart.some(item => item.event_category_id === selectedEventCategory);

    if (categoryExists) {
      console.log('Category already exists in cart');
      alert("Event Category sudah ada di cart");
      return; // Prevent adding if category already exists
    }

    const payload = {
      event_category_id: selectedEventCategory, // Use the correct category ID
      event_id: Number(eventId), // Ensure eventId is defined correctly
      event_session_id: selectedSessionIdValue || null,
      anggota_komunitas_id: anggotaKomunitasId,
    };

    console.log('Event Category ID:', id);
    console.log('Payload:', payload);

    const response = await fetch(`${base_url}/v1/users/user/${userId}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': ' application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.log('Failed to add to cart', response.status, response.statusText);
      console.log(payload);
    } else {
      alert('Added to cart successfully!');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="category-event">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="header" on:click={eventSessions.length > 0 ? toggleDetails : null} style="cursor: {eventSessions.length > 0 ? 'pointer' : 'default'}">
    <span>{category}</span>
    {#if eventSessions.length > 0}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        class="arrow-icon"
        class:rotated={showDetails}
      >
        <path fill="none" stroke="black" stroke-width="2" d="M6 9l6 6 6-6" />
      </svg>
    {/if}
  </div>

  {#if eventSessions.length > 0 && showDetails}
    <div class="details-content">
      <div class="sessions">
        {#each eventSessions as session}
          <button
            class="session-button"
            class:selected={$selectedSession === session.dateTime}
            disabled={session.quota === 0}
            on:click={() => selectSession(session)}
            style="background-color: {label_tgl_waktu_kategori_event}; border: 1px solid {label_tgl_waktu_kategori_event};"
          >
            {session.dateTime} (Available: {session.quota})
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <div class="footer">
    <span class="price" style="color: {label_harga_kategori_event};">Rp {price.toLocaleString('id-ID')}</span>
    <button class="book-ticket" on:click={addToCart} disabled={eventSessions.length > 0 && !$isBookingEnabled}>Add to Cart</button>
  </div>
</div>


<style>
  .category-event {
    background-color: #fff;
    border-radius: 8px;
    padding: 1rem 1rem 0.5rem 1rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-weight: bold;
    margin-bottom: 20px; /* Adding margin to the container */
  }

  .header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    font-weight: bold;
    margin-bottom: 10px; /* Adding some margin */
  }

  .arrow-icon {
    transition: transform 0.3s ease;
  }

  .arrow-icon.rotated {
    transform: rotate(180deg);
  }

  /* hr {
    width: 100%;
    margin: 1rem 0;
    border: none;
    border-top: 1px solid #ccc;
  } */

  .footer {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    font-weight: bold;
    margin-top: 10px; /* Adding margin at the top */
  }

  .price {
    font-size: 1.25rem;
    font-weight: bold;
  }

  .session-button, .book-ticket {
    background-color: #007bff;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease; /* Adding transition for color */
    font-weight: bold;
    margin-top: 10px; /* Adding margin to session buttons */
  }

  .session-button:hover, .book-ticket:hover {
    background-color: #0056b3;
  }

  /* .session-button.disabled {
    background-color: #ddd;
    cursor: not-allowed;
  } */

  /* Initially set the font color to black, and switch to orange when selected */
  .session-button {
    color: black;
    background-color: white; /* Background white by default */
  }

  .session-button.selected {
    color: white; /* When selected, change to orange */
    font-weight: bold;
    background-color: #ff9029;
  }

  .session-button.selected:hover {
    background-color: #ff7f00;
  }

  .book-ticket:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .details-content {
    width: 100%;
    margin-top: 10px; /* Adding margin to details content */
  }

  .sessions {
    margin: 1rem 0;
    font-weight: bold;
  }

  .session-button {
    padding: 0.5rem 1rem;
    margin: 0.25rem;
    cursor: pointer;
    border-radius: 4px;
    font-weight: bold;
  }

  .session-button:not(.disabled):hover {
    background-color: #FFD8B5;
    color: black;
  }
</style>
