<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';
    import { getUserId, getJwtToken } from '$lib/js/utils';

    export let onToggleCardCart: () => {};
    export let event: any;
    export let EventSession;
    export let showCard = false;
    export let showCategory = false;
    export let event_category_id;
    export let item: any;
    export let onOpenDeleteModal;

    const base_url = import.meta.env.VITE_API_BASE_URL;
    const userId = getUserId();
    const dispatch = createEventDispatcher();

    let loadingCart = true;
    let komunitas: any = {};
    let selectedCategories: Set<number> = new Set();
    let selectedCategoriesList: string[] = [];
    let selectedRadio: number | null = null;
    let showDeleteModal = false;
    let cartIdToDelete: number | null = null;
    let selectedCartId: number | null = null;

    async function fetchKomunitas(komunitas_id: number) {
        const token = getJwtToken();
        if (!token) {
            console.error('No token found');
            return;
        }
        try {
            const response = await fetch(`${base_url}/v1/users/komunitas/${komunitas_id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const jsonResponse = await response.json();
            komunitas = jsonResponse.data;
        } catch (error) {
            console.error('Error fetching komunitas:', error);
        }
    }

    onMount(() => {
        if (event && event.komunitas_id) {
            fetchKomunitas(event.komunitas_id);
        }
        console.log("Eventssss", event);
    });

    function openCard() {
        showCategory = !showCategory;
        showCard = !showCard;
        if (onToggleCardCart) {
            onToggleCardCart();
        }
    }

    function handleSelect() {
        if (selectedRadio === event.id) {
            selectedRadio = null;
            selectedCartId = null;
        } else {
            selectedRadio = event.id;
            selectedCartId = item.id;
        }
        // dispatch('select', { event, cartId: selectedCartId, selectedCategories: selectedCategoriesList });
        const selectedCategories = item.event_category_id 
        ? event.EventCategory.filter((cat: { id: any; }) => cat.id === item.event_category_id).map((cat: { nama_event_category: any; }) => cat.nama_event_category) 
        : [];
        dispatch('select', { 
            event, 
            cartId: selectedCartId,
            selectedCategories // Ambil kategori yang sudah dipilih dari item
        });
        console.log("categories", selectedCategories);
    }

    function toggleCategory() {
        showCategory = !showCategory;
        showCard = showCategory;
    }

    function toggleCheckbox(categoryId: number, categoryName: string) {
        if (selectedCategories.has(categoryId)) {
            selectedCategories.delete(categoryId);
            selectedCategoriesList = selectedCategoriesList.filter(name => name !== categoryName);
        } else {
            selectedCategories.add(categoryId);
            selectedCategoriesList.push(categoryName);
        }

        selectedCategoriesList = Array.from(selectedCategories).map(id => {
            const category = event.EventCategory.find((cat: { id: number }) => cat.id === id);
            return category ? category.nama_event_category : null;
        }).filter(Boolean);

        console.log("Selected categories", selectedCategoriesList);
        dispatch('updateCategories', selectedCategoriesList);
    }

    function openDeleteModal(cartId: number | null) {
        cartIdToDelete = cartId;
        showDeleteModal = true;
    }

    function confirmDeleteEvent() {
        if (cartIdToDelete !== null) {
            dispatch('delete', { cartId: cartIdToDelete });
            cartIdToDelete = null;
            showDeleteModal = false;
        }
    }

    function cancelDelete() {
        showDeleteModal = false;
    }
</script>

{#if komunitas.nama_komunitas}
    <h3>{komunitas.nama_komunitas}</h3>
{/if}

<div class="main-card">
    <div class="information">
        <div class="radio-event">
            <input type="radio" name="event" value={event.id} on:change={handleSelect} checked={selectedRadio === event.id}>
        </div>
        <div class="gambar-event">
            <img src={event.foto} alt="Event Poster" />
        </div>
        <div class="info-event">
            <p class="title-event">{event.nama_event || 'Nama Event Tidak Tersedia'}</p>
            <p class="event-time">Tanggal: {event.tgl_mulai_kegiatan ? new Date(event.tgl_mulai_kegiatan).toLocaleDateString() : 'Tanggal Tidak Tersedia'} - {event.tgl_selesai_kegiatan ? new Date(event.tgl_selesai_kegiatan).toLocaleDateString() : 'Tanggal Tidak Tersedia'}</p>
            <p>Lokasi: {event.lokasi_event || 'Lokasi Tidak Tersedia'}</p>
            <p>Biaya: {event.biaya || 'Biaya Tidak Tersedia'}</p>
        </div>

        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="bottom-card" style="background-color: red;">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="btn-action" on:click={() => onOpenDeleteModal(item.id)}>
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 7H20M10 11V17M14 11V17M5 7L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 7M9 7V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                </svg>
                <span>Delete</span>
            </div>
        </div>
    </div>

    <div class="list-category">
        <p>Kategori Event:</p>
        <div class="kategori-event">
            {#if event.EventCategory && event.EventCategory.length > 0}
                {#each event.EventCategory as category}
                    {#if category.id === event_category_id}
                        <div class="category-cardList">
                            <div class="category">
                                <!-- svelte-ignore a11y-label-has-associated-control -->
                                <label class="label_info">Category Name:</label>
                                <p>{category.nama_event_category}</p>
                            </div>
                            <div class="info">
                                <!-- svelte-ignore a11y-label-has-associated-control -->
                                <label class="label_info">Event Category Price:</label>
                                <p>{category.price}</p>
                            </div>
                            <hr>
                            <p class="label_info">Session Info</p>
                            <div class="category-session">
                                {#if EventSession}
                                    <div class="session-info">
                                        <p>Nama Sesi: {EventSession.nama_event_session || 'Nama Sesi Tidak Tersedia'}</p>
                                        <p>Deskripsi: {EventSession.deskripsi || 'Tidak ada deskripsi'}</p>
                                        <p>Tanggal Mulai: {EventSession.tgl_mulai ? new Date(EventSession.tgl_mulai).toLocaleDateString() : 'Tanggal Tidak Tersedia'}</p>
                                        <p>Tanggal Selesai: {EventSession.tgl_selesai ? new Date(EventSession.tgl_selesai).toLocaleDateString() : 'Tanggal Tidak Tersedia'}</p>
                                    </div>
                                {:else}
                                    <p>Tidak ada data sesi yang tersedia</p>
                                {/if}
                            </div>
                        </div>
                    {/if}
                {/each}
            {:else}
                <p>No event category</p>
            {/if}
        </div>
    </div>
</div>

<style>
    .kategori-event {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }
    
    .category-cardList {
        border: 1px solid #ccc;
        padding: 6px;
        width: 100%;
        border-radius: 5px;
        padding-top: 4px;
    }

    .information {
        display: flex;
        align-items: center;
        padding: 12px;
    }

    .info{
        display: flex;
    }

    .main-card {
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-bottom: 8px;
        position: relative;
        display: flex;
        flex-direction: column;
    }

    img {
        width: 72px;
        height: 72px;
    }

    .radio-event {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 12px;
    }

    .info-event {
        margin-left: 8px;
        flex-grow: 1;
    }

    .title-event {
        font-weight: 600;
        display: flex;
        justify-content: space-between;
    }

    .list-category {
        display: flex;
        align-items: left;
        gap: 6px;
        flex-direction: column;
        padding: 8px;
    }

    .session-info {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between; 
    }

    .session-info p {
        width: 50%;
        margin: 0 0 10px;
    }
    .label_info{
        font-weight: 600;
        margin-right: 4px;

    }
    .category {
        display: flex;
    }
    .bottom-card {
        display: flex;
        align-items: center;
    }
    .btn-action {
        position: absolute;
        right: 12px;
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 4px;
        padding-right: 6px;
        border-radius: 5px;
    }
    .btn-action:hover{
        background-color: #ececec;
    }
    .btn-action svg {
        color: #dc3545;
    }
    .btn-action span {
        font-weight: 600;
        color: #dc3545;
    }
</style>
