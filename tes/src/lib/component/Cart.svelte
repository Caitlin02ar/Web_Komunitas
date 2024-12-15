<script lang="ts">
    // @ts-nocheck
    import { getJwtToken, getUserId } from "$lib/js/utils"; 
    import CardCart from "./CardCart.svelte"; 
    import { goto } from  '$app/navigation';
    import ModalDelete from './ModalDelete.svelte' 
    const base_url = import.meta.env.VITE_API_BASE_URL; 
    let cartItems = []; 
    let groupedCartItems = {}; 
    let communities = {}; 
    let events = {}; 
    const userId = getUserId();
    console.log("User  ID from getUser Id:", userId, "Type:", typeof userId);

    let selectedCategoriesList = [];
    let showCard = false;
    let selectedEvent = null;
    let showDeleteModal = false;
    let itemToDelete = null;

    let selectedCartId: number | null = null; // Tambahkan variabel untuk menyimpan ID cart yang dipilih


    function openDeleteModal(cartId) {
        console.log("Opening delete modal for cart ID:", cartId);
        itemToDelete = cartId;
        showDeleteModal = true;
        console.log("Show delete modal", showDeleteModal);
    }
    async function deleteCartItem(cartId) {
    console.log("Attempting to delete cart item with cartId:", cartId);
    
    const token = getJwtToken();
    
    try {
        const response = await fetch(`${base_url}/v1/users/user/${userId}/cart/delete/${cartId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Gagal menghapus item cart');
        }

        // After successful deletion, remove the item from cartItems
        cartItems = cartItems.filter(item => item.id !== cartId);
        console.log('Item cart berhasil dihapus');
        window.location.reload();

    } catch (error) {
        console.error('Error saat menghapus item cart:', error);
    }
}

    function handleDeleteEvent(event) {
    const { cartId } = event.detail;
    console.log("Cart ID", cartId);
    console.log("Deleting item with cart ID:", cartId);

    openDeleteModal(cartId);
}

    
    function closeDeleteModal() {
        showDeleteModal = false;
        itemToDelete = null;
    }
    function confirmDelete() {
    console.log("Confirming delete for item ID:", itemToDelete);
    if (onConfirm) {
        onConfirm();
    }
}

function handleEventSelect(eventData) {
    selectedEvent = eventData.event; // Ambil data event
    console.log("selected event", selectedEvent);
    selectedCategoriesList = eventData.selectedCategories; // Ambil kategori yang dipilih dari item
    selectedCartId = eventData.cartId; // Ambil cartId
    console.log("Selected Cart ID", selectedCartId);
    console.log("categories selected", selectedCategoriesList);

    fetchCartByIdSummary(selectedCartId);
}

    function openCard() {
        console.log("Card toggled");
        showCard = !showCard;
    }

    async function fetchKomunitasByEventId(event_komunitas_id) {
        const token = getJwtToken(); 

        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch(`${base_url}/v1/users/komunitas/${event_komunitas_id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const jsonResponse = await response.json();
            return jsonResponse.data?.Komunitas || null; 
        } catch (error) {
            console.error('Error fetching komunitas data:', error);
            return null; 
        }
    }

    async function fetchEventById(event_id, event_komunitas_id) {
        const token = getJwtToken(); 
        

        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch(`${base_url}/v1/users/komunitas/${event_komunitas_id}/event/${event_id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const jsonResponse = await response.json();
            const eventData = jsonResponse.data || {};

            console.log("Data komunitas by event ID", eventData);

            const eventCategories = eventData.EventCategory || []; 

            const categoryNames = eventCategories.map(category => category.nama_event_category);

            console.log("CategoryName", categoryNames);

            if (eventData.foto) {
                eventData.foto = `${base_url}/getfoto?path=${eventData.foto}`;
            }
            return {
                ...eventData, 
                categoryNames 
            };

        } catch (error) {
            console.error('Error fetching event data:', error);
            return null; 
        }
    }

    async function fetchEventSession(event_komunitas_id, event_id, event_category_id, event_session_id) {
    const token = getJwtToken();

    if (!token) {
        console.error('No token found');
        return;
    }

    try {
        const response = await fetch(`${base_url}/v1/users/komunitas/${event_komunitas_id}/event/${event_id}/eventcategory/${event_category_id}/eventsession/${event_session_id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const jsonResponse = await response.json();
        const eventSessionData = jsonResponse.data || {};
        console.log(`Event session data for event ${event_id}:`, eventSessionData);

        return eventSessionData; 
    } catch (error) {
        console.error('Error fetching event session data:', error);
        return null;
    }
}

async function fetchCartData() {
    const token = getJwtToken(); 

    if (!token) {
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

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const jsonResponse = await response.json();
        cartItems = jsonResponse.data || [];
        console.log("cart items", cartItems);

        // Array untuk menyimpan item yang akan ditampilkan
        const filteredCartItems = [];

        for (const item of cartItems) {
            if (item.event_komunitas_id) {
                // Ambil komunitas dan event seperti sebelumnya
                if (!communities[item.event_komunitas_id]) {
                    const komunitas = await fetchKomunitasByEventId(item.event_komunitas_id);
                    if (komunitas) {
                        communities[item.event_komunitas_id] = komunitas; 
                    }
                }

                const event = await fetchEventById(item.event_id, item.event_komunitas_id);
                if (event) {
                    events[item.event_id] = event;

                    // event category Id
                    if (!item.event_category_id && event.category_id) {
                        item.event_category_id = event.category_id;
                    }
                }

                // Panggil checkPeserta untuk mendapatkan data peserta
                const pesertaData = await checkPeserta(item.event_komunitas_id, item.event_id);
                const user_id = Number(getUserId(), 10);
                
                // Cek apakah user ID ada di data peserta
                const userIsParticipant = pesertaData && pesertaData.some(peserta => {
                    return peserta.user_id === user_id;
                });

                // Jika user ID tidak ada di peserta, tambahkan item ke filteredCartItems
                if (!userIsParticipant) {
                    filteredCartItems.push(item);
                }
            }
        }

        // Update cartItems dengan item yang sudah difilter
        cartItems = filteredCartItems;

        // Mengelompokkan filteredCartItems berdasarkan event_komunitas_id
        const groupedFilteredCartItems = {};
        for (const item of filteredCartItems) {
            if (!groupedFilteredCartItems[item.event_komunitas_id]) {
                groupedFilteredCartItems[item.event_komunitas_id] = {
                    komunitas: communities[item.event_komunitas_id],
                    items: []
                };
            }
            groupedFilteredCartItems[item.event_komunitas_id].items.push(item);
        }

        // Update groupedCartItems dengan hasil pengelompokan
        groupedCartItems = groupedFilteredCartItems;

        console.log('Filtered Cart Items:', cartItems);
        console.log('Grouped Filtered Cart Items:', groupedCartItems);
        console.log('Fetched Events:', events);
    } catch (error) {
        console.error('Error fetching cart data:', error);
    }
}

        async function fetchCartItemById(cartId) {
        const token = getJwtToken(); 

        if (!token) {
            console.error('No token found');
            return null;
        }

        console.log('Fetching cart item with ID:', cartId); // Log ID cart yang sedang diambil

        try {
            const response = await fetch(`${base_url}/v1/users/user/${userId}/cart/${cartId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cart item');
            }

            const jsonResponse = await response.json();
            console.log('Fetched cart item:', jsonResponse.data); // Log data cart item yang diterima

            return jsonResponse.data || null; 
        } catch (error) {
            console.error('Error fetching cart item:', error);
            return null;
        }
    }

    async function checkPeserta(event_komunitas_id, event_id) {
    const token = getJwtToken();
    if (!token) {
        console.error('No token found');
        return null;
    }

    try {
        const response = await fetch(`${base_url}/v1/users/komunitas/${event_komunitas_id}/event/${event_id}/peserta?page=0&pageSize=0`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const jsonResponse = await response.json();
        const dataPeserta = jsonResponse.data || {};
        if (Array.isArray(dataPeserta)) {
        // Iterasi melalui setiap peserta
        dataPeserta.forEach(peserta => {
            console.log("User  ID peserta:", peserta.user_id);
        });
        console.log("data peserta", dataPeserta);
    } else {
        console.error("Data peserta tidak valid atau bukan array");
    }
        return dataPeserta; // Kembalikan data peserta jika diperlukan
    } catch (error) {
        console.log('Error fetching data peserta');
        return null;
    }
}

    async function handleCheckOut() {
    console.log('Selected Event:', selectedEvent);
    console.log('Selected Categories List:', selectedCategoriesList);
    console.log('Selected Cart ID:', selectedCartId);

    // Check if at least the event and cart ID are present
    if (selectedEvent && selectedCartId) {
        const cartItem = await fetchCartItemById(selectedCartId);
        if (!cartItem) {
            console.error('Cart item not found');
            return;
        }

        // Optionally save selected categories if they exist
        if (selectedCategoriesList.length > 0) {
            localStorage.setItem('selectedCategories', JSON.stringify(selectedCategoriesList));
        }

        // Save cart item to localStorage
        localStorage.setItem('cartItem', JSON.stringify(cartItem));
        goto('/booking');
    } else {
        console.error('Data tidak valid untuk disimpan di localStorage');
    }
}


let selectedEventDetails = null;

let selectedCartItem = null;
async function fetchCartByIdSummary(cartId){
    const cartItem = await fetchCartItemById(cartId);
    if(cartItem){
        selectedCartItem = cartItem;
        console.log("Selected Cart item", selectedCartItem);
        console.log( cartItem.event_komunitas_id);
        selectedEventDetails = await fetchEventById(cartItem.event_id, cartItem.event_komunitas_id);
    } else {
        console.error("Cart item not found");
    }
}


    function clearLocalStorage(){
        localStorage.removeItem('selectedEvent');
        localStorage.removeItem('selectedCategories');
        localStorage.removeItem('completeCategories');
        localStorage.removeItem('cartItem');
        localStorage.removeItem('selectedCartIds');
    }

    (async () => {
        await fetchCartData(); 
    })();
</script>

<!-- <button on:click={clearLocalStorage}>Clear</button> -->

<ModalDelete
    isOpen={showDeleteModal}
    headerText="Konfirmasi Hapus"
    bodyText="Apakah Anda yakin ingin menghapus item ini?"
    onClose={closeDeleteModal}
    onConfirm={() => {
        deleteCartItem(itemToDelete);
        closeDeleteModal();
    }}
/>

<div class="main-container">
    <div class="container">
        {#if cartItems.length === 0}
            <p>Tidak ada item dalam cart.</p>
        {:else}
            {#each Object.entries(groupedCartItems) as [komunitas_id, komunitasData]}
                <div class="community-card">
                    <h3 class="nama-komunitas">{komunitasData.komunitas.nama_komunitas}</h3>
                    <hr class="line">
                    <div class="events-list">
                        {#if komunitasData.items.length === 0}
                            <p>Tidak ada event untuk komunitas ini.</p>
                        {:else}
                            {#each komunitasData.items as item}
                                {#if events[item.event_id]}
                                    <CardCart event={events[item.event_id]} 
                                    item={item}
                                    onOpenDeleteModal={openDeleteModal}
                                    EventSession={item.event_session}
                                    event_category_id={item.event_category_id}
                                    onToggleCardCart={openCard}
                                    on:select={e => handleEventSelect(e.detail)}
                                    on:updateCategories={e => selectedCategoriesList = e.detail}
                                    />
                                {:else}
                                    <p>Loading event details...</p>
                                {/if}
                            {/each}
                        {/if}
                    </div>
                </div>
            {/each}
        {/if}
    </div>

    <div class="summary">
        <h3 class="summar-header">Summary</h3>
        <div class="container-sum">
            <div class="card-summary">
                {#if selectedEvent}
                    <div class="event-photo">
                        <!-- svelte-ignore a11y-img-redundant-alt -->
                        <img src={selectedEvent.foto} alt="Event Photo" />
                    </div>
                    <div class="summary-info">
                        <p class="event-name">{selectedEvent.nama_event}</p>
                        <p>Event Date: {selectedEvent.tgl_mulai_kegiatan ? new Date(selectedEvent.tgl_mulai_kegiatan).toLocaleDateString() : 'Tanggal Tidak Tersedia'}</p>
                        <p>Lokasi: {selectedEvent.lokasi_event || 'Lokasi Tidak Tersedia'}</p>
                    </div>
                {:else}
                    <p class="not_selected">Belum ada item yang dipilih.</p>
                {/if}
            </div>
    
            <div class="category-selected">
                <p>Kategori Dipilih:</p>
                {#if selectedCategoriesList.length > 0}
                    <ul>
                        {#each selectedCategoriesList as category}
                            <li>{category}</li>
                        {/each}
                    </ul>
                {:else}
                    <p>Tidak ada kategori yang dipilih.</p>
                {/if}
            </div>
        </div>

    
        <div class="button-checkout">
            <button on:click={handleCheckOut}>Checkout</button>
        </div>
    </div>
</div>


<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
    :global(html) {
        font-family: 'Inter', sans-serif;
    }
    .main-container {
        display: flex;
        justify-content: space-between; 
        padding: 32px;
        padding-top: 0px;
    }
    .nama-komunitas {
        font-weight: 600;
    }
    .line{
        margin-bottom: 8px;
        background-color: black;
    }
    .container {
        width: 60%;
        padding-right: 16px; 
    }

    .summary {
    width: 50%;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 16px;
    height: 300px;
    /* overflow-y: auto; */
    position: sticky;
    }
    .summar-header {
        font-weight: 600;
        font-size: 20px;
        margin-bottom: 4px;
    }

    .container-sum {
        background-color: rgb(237, 235, 235);
        padding: 8px;
        border-radius: 5px;
    }
    .card-summary {
        display: flex;
    }
    .event-photo {
        width: 95px;
        height: 110px;
        border: 1px solid #ccc;
    }
    .summary-info {
        margin-left: 8px;
        display: flex;
        flex-direction: column;
    }
    .event-name {
        font-weight: 600;
    }
    .button-checkout {
        background-color: #007AFF;
        color: white;
        font-weight: 500;
        padding: 4px;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 25%;
        margin: 4px;
        margin-left: 0;
    }
    .button-checkout:hover {
        background-color: #0063CE;
    }
    .button-checkout button:focus{
        outline: none;
    }
    .community-card {
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 16px;
    padding: 16px;
    background-color: #f9f9f9;
}
.not_selected {
    color: #dc3545;
    font-weight: 500;
    font-style: italic;
}

@media (max-width: 1040px) {
        .summary {
            width: 100%;
            margin-top: 16px;
        }
        .button-checkout {
            width: 100%; 
        }
    }
    @media (max-width: 768px) {
        .main-container {
            flex-direction: column;
            padding: 16px;
        }
        .container {
            width: 100%;
            padding-right: 0;
        }
        .summary {
            margin-top: 16px;
        }
    }

    @media (max-width: 480px) {
        .event-photo {
            width: 70px; 
            height: 80px;
        }
    }
</style>
