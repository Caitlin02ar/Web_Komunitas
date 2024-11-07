<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { get } from 'svelte/store';
  import CategoryEvent from '$lib/component/CategoryEvent.svelte';
  import { extractIdFromUrl, getJwtToken, getAnggotaKomunitasId, getUserId } from '$lib/js/utils.js';

  const base_url = import.meta.env.VITE_API_BASE_URL;

  let slug: string = '';
  let eventName: string = '';
  let eventLocation: string = '';
  let eventDate: string = '';
  let eventDescription: string = '';
  let eventTermsAndConditions: string = '';
  let imageSrc: string = '';
  let eventFound: boolean = true;
  let activeTab: string = 'description'; // default tab
  let categoryEvents: string | any[] = [];  // Store for event categories
  let isBookingEnabled = false; // Flag to check if booking should be enabled
  let biaya = 0;
  let selectedCategoryId: null = null;
  let selectedSessionId: null = null;
  let userId = getUserId();


  onMount(async () => {
    const params = get(page).params;
    slug = params.slug;

    const slugParts = slug.split('-');
    const eventId = slugParts[slugParts.length - 1];
    const communityId = extractIdFromUrl(window.location.href);
    const token = getJwtToken();

    try {
      const eventResponse = await fetch(`${base_url}/v1/users/komunitas/${communityId}/event/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!eventResponse.ok) {
        throw new Error(`HTTP error! Status: ${eventResponse.status}`);
      }

      const eventData = await eventResponse.json();

      if (eventData.status === 200 && eventData.data) {
        const event = eventData.data;
        eventName = event.nama_event;
        eventLocation = event.lokasi_event;
        eventDate = `${new Date(event.tgl_mulai_kegiatan).toLocaleDateString('id-ID')} - ${new Date(event.tgl_selesai_kegiatan).toLocaleDateString('id-ID')}`;
        eventDescription = event.deskripsi;
        eventTermsAndConditions = event.termcondition;
        imageSrc =  `${import.meta.env.VITE_API_BASE_URL}/getfoto?path=${event.foto}`;
        biaya = event.biaya;

        if (event.EventCategory && event.EventCategory.length > 0) {
          const newCategoryEventsPromises = event.EventCategory.map(async (category: { id: any; nama_event_category: any; price: any; }) => {
            const categorySessionsResponse = await fetch(`${base_url}/v1/users/komunitas/${communityId}/event/${eventId}/eventcategory/${category.id}/eventsession?page=0&pageSize=0`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });

            if (!categorySessionsResponse.ok) {
              throw new Error(`Failed to fetch sessions. Status: ${categorySessionsResponse.status}`);
            }

            const sessionsData = await categorySessionsResponse.json();

            if (sessionsData.status === 200 && sessionsData.data) {
              const sessions = sessionsData.data.map((session: { tgl_mulai: string | number | Date; tgl_selesai: string | number | Date; id: any; sisa_tiket: any; }) => {
                const startDate = new Date(session.tgl_mulai);
                const endDate = new Date(session.tgl_selesai);
                let formattedSession;
                if (startDate.toDateString() === endDate.toDateString()) {
                  formattedSession = `${startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} ${startDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
                } else {
                  formattedSession = `${startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} ${startDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} ${endDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
                }

                return {
                  idSession: session.id, // Correctly assign session id
                  dateTime: formattedSession,
                  quota: session.sisa_tiket
                };
              });

              return {
                id: category.id,
                category: category.nama_event_category,
                price: category.price,
                sessions
              };
            }
          });

          // Resolve all promises in parallel
          categoryEvents = await Promise.all(newCategoryEventsPromises);
        } else {
          // Jika tidak ada event category, langsung izinkan booking
          isBookingEnabled = true;
        }
      } else {
        eventFound = false;
      }
    } catch (error) {
      console.error('Error fetching event data:', error);
      eventFound = false;
    }
  });

  function switchTab(tab: string) {
    activeTab = tab;
  }

  async function addToCart() {
        const eventId = slug; // Ambil ID acara dari slug URL
        const anggotaKomunitasId = getAnggotaKomunitasId(); // Ambil ID anggota komunitas dari utilitas
        const token = getJwtToken(); // Ambil token JWT dari utilitas

        // Cek apakah kategori dan sesi telah dipilih
        if (!selectedCategoryId || !selectedSessionId) {
            alert('Silakan pilih kategori dan sesi acara.');
            return;
        }

        // Payload untuk dikirim ke server
        const payload = {
            event_category_id: selectedCategoryId,
            event_id: Number(eventId),
            event_session_id: selectedSessionId,
            anggota_komunitas_id: anggotaKomunitasId,
        };

        // Permintaan untuk menambahkan item ke keranjang
        try {
            const response = await fetch(`${base_url}/v1/users/user/5/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                alert('Item berhasil ditambahkan ke keranjang!');
                // Opsional: Update UI atau state jika diperlukan
            } else {
                const error = await response.json();
                alert(`Gagal menambahkan item ke keranjang: ${error.message}`);
            }
        } catch (error) {
            alert('Terjadi kesalahan saat menambahkan item ke keranjang. Silakan coba lagi.');
            console.error(error);
        }
    }

</script>


<!-- Template structure -->
{#if eventFound}
  <div class="event-details">
    <div class="top-section">
      <div class="left-column">
        <div class="event-image">
          <img src={imageSrc} alt={eventName} />
        </div>
        <div class="event-info">
          <h1>{eventName}</h1>
          <div class="event-location">
            <img src="/src/lib/images/location.svg" alt="Location" />
            <div class="event-detail-text">
              <strong>Event Location</strong>
              <p>{eventLocation}</p>
            </div>
          </div>
          <div class="event-date">
            <img src="/src/lib/images/calendar.svg" alt="Date" />
            <div class="event-detail-text">
              <strong>Event Date</strong>
              <p>{eventDate}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="right-column">
        <div class="event-description">
          <div class="tabs">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <span on:click={() => switchTab('description')} class:active={activeTab === 'description'}>Description</span>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <span on:click={() => switchTab('termsAndConditions')} class:active={activeTab === 'termsAndConditions'}>T&C</span>
          </div>
          {#if activeTab === 'description'}
            <div class="tab-content">
              <p>{eventDescription}</p>
            </div>
          {:else if activeTab === 'termsAndConditions'}
            <div class="tab-content">
              <p>{eventTermsAndConditions}</p>
            </div>
          {/if}
        </div>
      </div>
    </div>
    <div class="bottom-section">
      {#if categoryEvents.length > 0}
        <div class="event-category">
          <h2>Kategori Acara</h2>
          <!-- Loop over category events and pass data to CategoryEvent component -->
          {#each categoryEvents as categoryEvent}
            <CategoryEvent 
            id={categoryEvent.id} 
            category={categoryEvent.category} 
            price={categoryEvent.price} 
            eventSessions={categoryEvent.sessions} />
          {/each}
        </div>
      {:else}
      <div class="category-event">
        <div class="header">
          <span>{eventName}</span>
        </div>
        <div class="footer">
          <span class="price">Rp {biaya.toLocaleString('id-ID')}</span>
          <button class="add-to-cart" on:click={addToCart} disabled={!isBookingEnabled}>Add to Cart</button>
        </div>
      </div>
      {/if}
    </div>
  </div>
{:else}
  <p>Event not found. Please check the URL or go back to the events page.</p>
{/if}

<!-- Add your CSS styles for page layout -->
<style lang="css">
  .event-details {
    display: flex;
    flex-direction: column;
    padding: 20px;
    width: 100%;
  }

  .top-section {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .bottom-section {
    width: 100%;
  }

  .left-column {
    display: flex;
    flex-direction: row;
    width: 100%;
    margin-bottom: 20px;
  }

  .right-column {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .event-image {
    max-width: 250px;
    margin-right: 20px;
  }

  .event-image img {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }

  .event-info {
    flex: 1;
  }

  .event-info h1 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    font-weight: bold;
  }

  .event-info div {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
  }

  .event-info img {
    margin-right: 10px;
    width: 20px;
    height: 20px;
  }

  .event-detail-text {
    display: flex;
    flex-direction: column;
  }

  .event-description {
    background-color: #F9F5EC;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    width: 100%;
  }

  .tabs {
    display: flex;
    margin-bottom: 10px;
    border-bottom: 2px solid #ccc;
  }

  .tabs span {
    flex: 1;
    padding: 10px;
    cursor: pointer;
    font-size: 1rem;
    text-align: center;
    border-bottom: 4px solid transparent;
    transition: border-bottom 0.2s ease-in-out;
  }

  .tabs span.active {
    border-bottom: 4px solid #2C8395;
    font-weight: bold;
  }

  .tab-content {
    padding-top: 10px;
  }

  .event-category {
    background-color: #f0f0f0;
    padding: 20px;
    border-radius: 8px;
    width: 100%;
    margin-bottom: 20px;
  }

  .category-event {
  background-color: #fff;
  border-radius: 8px;
  padding: 1rem 1rem 0.5rem 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-weight: bold;
  margin-bottom: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  font-weight: bold;
  margin-bottom: 10px; /* Adding some margin */
}

.footer {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  font-weight: bold;
  margin-top: 10px; /* Adding margin at the top */
}

.price {
  color: #ff6600;
  font-size: 1.25rem;
  font-weight: bold;
}

.add-to-cart {
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

.add-to-cart:hover {
  background-color: #0056b3;
}

.add-to-cart:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

  @media (min-width: 768px) {
    .top-section {
      flex-direction: row;
    }

    .left-column {
      flex: 1;
      margin-bottom: 0;
      padding-right: 20px;
    }

    .right-column {
      flex: 1;
      padding-left: 20px;
    }

    .event-description {
      margin-bottom: 20px;
    }
  }
</style>
