<script>
    // @ts-nocheck
    import ButtonBack from '$lib/component/ButtonBack.svelte';
    import { onMount } from 'svelte';
    import { getJwtToken, extractIdFromUrl } from '$lib/js/utils';  
    import { page } from '$app/stores';

    let eventCategoryDetails = [];
    let sessions = [];
    let showAddSessionModal = false;
    let showDeleteConfirmModal = false;
    let isEditMode = false;

    let sessionToEdit = {
        name: '',
        startDate: '',
        endDate: '',
        description: '',
        quota: ''
    };

    let newSession = {
        name: '',
        startDate: '',
        endDate: '',
        description: '',
        quota: ''
    };

    let activeSession = { ...newSession }; // Used to bind the form inputs
    let sessionToDelete = null;  // Store session to delete temporarily

    let communityId;
    let eventId;
    let categoryId;

    // Format function for correct date-time format
    function formatToLocalDateTime(date) {
        return new Date(date).toLocaleString("sv-SE", { hour12: false }).replace("T", " ");
    }

    onMount(() => {
        const urlPath = $page.url.pathname;
        
        // Tetap menggunakan extractIdFromUrl untuk communityId
        communityId = extractIdFromUrl(urlPath, 'communities');

        // Split the URL path to get eventId and categoryId directly
        const pathParts = urlPath.split('/');

        // eventId diambil dari elemen ke-6 dan categoryId diambil dari elemen ke-9
        eventId = pathParts[6];
        categoryId = pathParts[9];

        console.log('Event ID:', eventId, 'Category ID:', categoryId);
        
        // Fetch the data
        fetchEventCategory();
        fetchSessions();
    });

    async function fetchEventCategory() {
        const token = getJwtToken();
        if (!token) {
            console.error('Authentication token not found.');
            return;
        }

        try {
            const response = await fetch(`http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityId}/event/${eventId}/eventcategory/${categoryId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                eventCategoryDetails = [
                    { label: 'Event Category Name', value: data.data.nama_event_category },
                    { label: 'Event Category Description', value: data.data.deskripsi },
                    { label: 'Event Category Price', value: `Rp. ${data.data.price.toLocaleString()}` },
                    { label: 'Event Category Quota', value: `${data.data.kuota} tickets` }
                ];
            } else {
                console.error('Failed to fetch event category details.');
            }
        } catch (error) {
            console.error('Network or server error:', error);
        }
    }

    async function fetchSessions() {
        const token = getJwtToken();
        if (!token) {
            console.error('Authentication token not found.');
            return;
        }

        try {
            const response = await fetch(`http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityId}/event/${eventId}/eventcategory/${categoryId}/eventsession?page=0&pageSize=0`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                sessions = data.data.map(session => ({
                    id: session.id,
                    name: session.nama_event_session,
                    description: session.deskripsi,
                    remainingTickets: session.sisa_tiket,
                    startDate: new Date(session.tgl_mulai).toISOString().slice(0, 16),
                    endDate: new Date(session.tgl_selesai).toISOString().slice(0, 16),
                    quota: session.sisa_tiket
                }));
            } else {
                console.error('Failed to fetch sessions:', data.message);
            }
        } catch (error) {
            console.error('Network or server error:', error);
        }
    }

    async function createSession(newSession) {
        const token = getJwtToken();
        if (!token) {
            console.error('Authentication token not found.');
            return;
        }

        try {
            const response = await fetch(`http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityId}/event/${eventId}/eventcategory/${categoryId}/eventsession`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nama_event_session: newSession.name,
                    deskripsi: newSession.description,
                    sisa_tiket: newSession.quota,
                    tgl_mulai: formatToLocalDateTime(newSession.startDate), 
                    tgl_selesai: formatToLocalDateTime(newSession.endDate)
                })
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Session created successfully', data);
                fetchSessions(); // Fetch the updated list of sessions
            } else {
                console.error('Failed to create session:', data.message);
            }
        } catch (error) {
            console.error('Network or server error:', error);
        }
    }

    async function updateSession(sessionToUpdate) {
        const token = getJwtToken();
        if (!token) {
            console.error('Authentication token not found.');
            return;
        }

        try {
            const response = await fetch(`http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityId}/event/${eventId}/eventcategory/${categoryId}/eventsession/update/${sessionToUpdate.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nama_event_session: sessionToUpdate.name,
                    deskripsi: sessionToUpdate.description,
                    sisa_tiket: sessionToUpdate.quota,
                    tgl_mulai: formatToLocalDateTime(sessionToUpdate.startDate),
                    tgl_selesai: formatToLocalDateTime(sessionToUpdate.endDate)
                })
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Session updated successfully', data);
                fetchSessions(); // Fetch the updated list of sessions
            } else {
                console.error('Failed to update session:', data.message);
            }
        } catch (error) {
            console.error('Network or server error:', error);
        }
    }

    // Function to handle session deletion after confirmation
    async function confirmDeleteSession() {
        if (!sessionToDelete) return;

        const token = getJwtToken();
        if (!token) {
            console.error('Authentication token not found.');
            return;
        }

        try {
            const response = await fetch(`http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityId}/event/${eventId}/eventcategory/${categoryId}/eventsession/delete/${sessionToDelete}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Session deleted successfully', data);
                fetchSessions(); // Fetch the updated list of sessions
                sessionToDelete = null; // Reset after deletion
                closeDeleteModal();
            } else {
                console.error('Failed to delete session:', data.message);
            }
        } catch (error) {
            console.error('Network or server error:', error);
        }
    }

    // Function to open delete modal and set session to delete
    function deleteSession(id) {
        sessionToDelete = id;
        showDeleteConfirmModal = true;
    }

    function closeDeleteModal() {
        showDeleteConfirmModal = false;
        sessionToDelete = null;
    }

    function editSession(index) {
        sessionToEdit = { ...sessions[index] };
        activeSession = sessionToEdit;
        isEditMode = true;
        showAddSessionModal = true;
    }

    function addSession() {
        if (isEditMode) {
            updateSession(activeSession);
        } else {
            createSession(activeSession);
        }
        closeModal();
    }

    function closeModal() {
        activeSession = { ...newSession }; // Reset to new session object
        showAddSessionModal = false;
    }

    function openModal() {
        activeSession = { ...newSession }; // Initialize with a new session object
        isEditMode = false;
        showAddSessionModal = true;
    }
</script>

<!-- HTML Template dan Modal yang sama seperti sebelumnya -->


<ButtonBack href="/communities/[communityNameId]/Management/CM_Events" text="Back" />
<h1 class="text-2xl font-bold mb-4 text-left">Event Category Detail</h1>

<table class="detail-table w-full mb-8">
    {#each eventCategoryDetails as detail}
        <tr>
            <td class="label font-semibold">{detail.label}</td>
            <td class="value">{detail.value}</td>
        </tr>
    {/each}
</table>

<!-- Session List -->
<div class="bg-white shadow-md rounded-lg p-8">
    <div class="bg-white border border-orange-400 text-orange-700 p-4 rounded-lg mt-8">
        <img src="/src/lib/images/Warning-Kuning.svg" alt="Warning" class="inline mr-2">
        <p class="inline">You can add sessions (date and time) for this event category</p>
    </div>

    <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Event Category Session</h1>
        <button class="add-session-button" on:click={openModal}>Add Session</button>
    </div>

    <div class="text-lg mb-6">
        <p>📅 Date Event: 25 Januari 2025 12:30 PM - 27 Januari 2025 13:30 PM</p>
    </div>

    <div class="mt-8 relative">
        {#each sessions as session, index}
            <div class="mb-4">
                <h3 class="font-semibold mb-2">Session {index + 1}</h3>
                <div class="flex items-center justify-between p-4 border rounded-lg bg-gray-100">
                    <div class="session-info">
                        <div>Session Name: {session.name}</div>
                        <div>Session Start Time: {session.startDate}</div>
                        <div>Session End Time: {session.endDate}</div>
                        <div>Description: {session.description}</div>
                        <div>Quota: {session.quota}</div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button class="edit-button" on:click={() => editSession(index)}>
                            <img src="/src/lib/images/edit.svg" alt="Edit" />
                        </button>
                        <button class="delete-button" on:click={() => deleteSession(session.id)}>
                            <img src="/src/lib/images/delete.svg" alt="Delete" />
                        </button>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>

<!-- Add/Edit Session Modal -->
{#if showAddSessionModal}
    <div class="modal">
        <div class="modal-content">
            <h2>{isEditMode ? 'Edit Session' : 'Add Session'}</h2>

            <label for="sessionName">Session Name</label>
            <input type="text" id="sessionName" bind:value={activeSession.name} />

            <label for="startDate">Start Date</label>
            <input type="datetime-local" id="startDate" bind:value={activeSession.startDate} />

            <label for="endDate">End Date</label>
            <input type="datetime-local" id="endDate" bind:value={activeSession.endDate} />

            <label for="description">Description</label>
            <input type="text" id="description" bind:value={activeSession.description} />

            <label for="quota">Quota</label>
            <input type="number" id="quota" bind:value={activeSession.quota} />

            <div class="button-group">
                <button class="cancel-button" on:click={closeModal}>Cancel</button>
                <button class="save-button" on:click={addSession}>Save</button>
            </div>
        </div>
    </div>
{/if}

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirmModal}
    <div class="modal">
        <div class="modal-content">
            <h2 class="text-red-600"><img src="/src/lib/images/trash-icon.svg" alt="Trash" /> Delete Session</h2>
            <p>Are you sure you want to delete this event session? <br /> <strong>This action cannot be undone.</strong></p>
            
            <div class="button-group">
                <button class="cancel-button" on:click={closeDeleteModal}>Cancel</button>
                <button class="delete-confirm-button" on:click={confirmDeleteSession}>Yes, delete</button>
            </div>
        </div>
    </div>
{/if}

<style>
    .detail-table {
        width: 100%;
        margin-bottom: 1.5rem;
        border-collapse: collapse;
    }

    .detail-table td {
        padding: 1rem;
        border: 1px solid #e2e2e2;
    }

    .detail-table .label {
        font-weight: bold;
        background-color: #f9f9f9;
    }

    .value {
        background-color: #fff;
        color: #666;
    }

    .shadow-md {
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .rounded-lg {
        border-radius: 8px;
    }

    .p-8 {
        padding: 2rem;
    }

    .mb-8 {
        margin-bottom: 2rem;
    }

    .mt-8 {
        margin-top: 2rem;
    }

    .bg-white {
        background-color: #ffffff;
    }

    .border {
        border: 1px solid #ddd;
    }

    .text-orange-700 {
        color: #c05621;
    }

    .flex {
        display: flex;
    }

    .items-center {
        align-items: center;
    }

    .justify-between {
        justify-content: space-between;
    }

    .gap-2 {
        gap: 0.5rem;
    }

    .edit-button, .delete-button, .add-session-button {
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 500;
        border: none;
        transition: background-color 0.2s;
    }

    .edit-button {
        background-color: #4f46e5;
        color: white;
        display: flex;
        align-items: center;
        padding: 0.25rem 0.5rem;
    }

    .edit-button:hover {
        background-color: #4338ca;
    }

    .delete-button {
        background-color: #e11d48;
        color: white;
        display: flex;
        align-items: center;
        padding: 0.25rem 0.5rem;
    }

    .delete-button:hover {
        background-color: #be123c;
    }

    .add-session-button {
        background-color: #059669;
        color: white;
        margin-bottom: 1rem;
    }

    .add-session-button:hover {
        background-color: #047857;
    }

    .font-semibold {
        font-weight: 600;
    }

    .session-info {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    img {
        vertical-align: middle;
    }

    .button-group {
        display: flex;
        justify-content: end;
        gap: 1rem;
        margin-top: 2rem;
    }

    .cancel-button, .save-button, .delete-confirm-button {
        padding: 0.5rem 1.5rem;
        border-radius: 0.375rem;
        font-size: 1rem;
        cursor: pointer;
    }

    .cancel-button {
        background-color: gray;
        color: white;
        border: none;
    }

    .save-button {
        background-color: #007bff;
        color: white;
        border: none;
    }

    .delete-confirm-button {
        background-color: red;
        color: white;
        border: none;
    }

    /* Modal Styles */
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        max-width: 500px;
        width: 100%;
    }

    .modal-content h2 {
        margin-bottom: 1rem;
        font-size: 1.5rem;
        font-weight: 600;
    }

    .modal-content label {
        font-weight: 500;
        margin-bottom: 0.5rem;
        display: block;
    }

    .modal-content input {
        width: 100%;
        padding: 0.5rem;
        margin-bottom: 1rem;
        border: 1px solid #ddd;
        border-radius: 0.375rem;
    }

    .modal-content .button-group {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
    }
</style>
