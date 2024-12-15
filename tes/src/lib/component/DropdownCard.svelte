<script>
    //@ts-nocheck
    import { getJwtToken } from '$lib/js/utils';
    import editIcon from '$lib/images/edit.svg';
    import deleteIcon from '$lib/images/delete.svg';
    import deleteIconModal from '$lib/images/deleteO-merah.svg';
    import arrowIcon from '$lib/images/panah-biru.svg';
    import Modal from './Modal.svelte';


    export let title = '';
    export let quota = '';  
    export let price = '';  
    export let id = '';  
    export let sessions = []; // Added to receive session date and time data
    let showContent = false;
    let showDeleteConfirmModal = false;
    let selectedTicketCount = null;

    function toggleContent() {
        showContent = !showContent;
    }

    function navigateToEdit() {
        window.location.href = `${window.location.origin}${window.location.pathname}/CM_EditEventCategory/${id}`;
    }

    function confirmDelete() {
        showDeleteConfirmModal = true;
    }

    function closeDeleteModal() {
        showDeleteConfirmModal = false;
    }

    async function deleteEventCategory() {
        const token = getJwtToken();
        if (!token) {
            console.error('Authentication token not found.');
            alert('Authentication token not found.');
            return;
        }

        try {
            const deleteUrl = `http://leap.crossnet.co.id:3010/api/v1/users/komunitas/1/event/1/eventcategory/delete/${id}`;
            const response = await fetch(deleteUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Delete Successful:', result);
                alert('Event Category deleted successfully!');
                window.location.reload();
            } else {
                console.error('Delete Failed:', await response.text());
                alert('Delete failed. Please try again.');
            }
        } catch (error) {
            console.error('Network or other error:', error);
        }

        closeDeleteModal();
    }

    function showTicketCount(session) {
        selectedTicketCount = `Remaining Tickets: ${session.sisa_tiket}`;
    }
</script>

<div class="card">
    <div class="card-header">
        <h3 class="title">{title}</h3>
        <button on:click={toggleContent} class="dropdown-toggle">
            <svg
                class="icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                class:rotated={showContent}
                style="transition: transform 0.3s ease;"
            >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
        </button>
    </div>
    <div class="card-info">
        <p class="quota"><strong>Quota:</strong> {quota}</p>
        <a href={`${window.location.origin}${window.location.pathname}/CM_EventSession/${id}`} class="event-category-session">
            Event Category Session
            <img src={arrowIcon} alt="Arrow" class="icon-arrow" />
        </a>        
    </div>
    {#if showContent}
    <div class="separator"></div>
    <div class="card-body">
        <p class="event-datetime"><strong>Event DateTime:</strong></p>
        <div class="dates-times">
            {#each sessions as session}
                <button class="session-button" on:click={() => showTicketCount(session)}>
                    {session.datetime}
                </button>
            {/each}
        </div>
        {#if selectedTicketCount}
            <p class="ticket-count">{selectedTicketCount}</p>
        {/if}
    </div>
    {/if}
    <div class="footer-separator"></div> <!-- Line above Event Category Price -->
    <div class="card-footer">
        <p class="price-label">Event Category Price: <span class="price">{price}</span></p>
        <div class="button-group">
            <button class="edit-button" on:click={navigateToEdit}>
                <img src={editIcon} alt="Edit" />
                Edit
            </button>
            <button class="delete-button" on:click={confirmDelete}>
                <img src={deleteIcon} alt="Delete" />
                Delete
            </button>
        </div>
    </div>
</div>

<Modal title="Delete Event Category" bind:show={showDeleteConfirmModal} onClose={() => showDeleteConfirmModal = false}>
    <div class="delete-modal-content">
        <div class="icon-container">
            <img src={deleteIconModal} alt="Delete Icon" class="delete-icon">
        </div>
        <h2 class="delete-title">Delete Event Category</h2>
        <p class="delete-description">Are you sure you want to delete this event category?</p>
        <p class="delete-warning">*This action cannot be undone</p>
        <div class="modal-actions">
            <button class="cancel-btn" on:click={() => showDeleteConfirmModal = false}>Cancel</button>
            <button class="delete-btn" on:click={deleteEventCategory}>Yes, delete</button>
        </div>
    </div>
</Modal>

<style>
    .card {
        border: 1px solid #E0E0E0;
        border-radius: 8px;
        margin-bottom: 1rem;
        background-color: white;
        overflow: hidden;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 1rem;
        background-color: white;
    }

    .title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: bold;
        color: #333;
    }

    .card-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 1rem;
        background-color: white;
        font-size: 0.9rem;
    }

    .quota {
        color: #666;
        margin: 0;
        font-weight: bold;
    }

    .dropdown-toggle {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
    }

    .dropdown-toggle:focus {
        outline: none;
    }

    .icon {
        width: 16px;
        height: 16px;
    }

    .icon.rotated {
        transform: rotate(180deg);
    }

    .icon-arrow {
        margin-left: 4px;
        width: 12px;
        height: 12px;
    }

    .event-category-session {
        display: flex;
        align-items: center;
        color: #007BFF;
        text-decoration: none;
        font-size: 0.85rem;
    }

    .event-category-session:hover {
        text-decoration: underline;
    }

    .separator {
        border-top: 1px solid #E0E0E0;
        margin: 0 1rem;
    }

    .footer-separator {
        border-top: 1px solid #E0E0E0;
        margin: 0 1rem;
    }

    .card-body {
        padding: 1rem;
        background-color: white;
    }

    .event-datetime {
        font-size: 1rem;
        font-weight: bold;
        color: #333;
        margin-bottom: 10px;
    }

    .dates-times {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .session-button {
        background-color: white;
        border: 1px solid #FF9029;
        padding: 10px 15px;
        border-radius: 8px;
        font-size: 0.875rem;
        color: #333;
        text-align: center;
        min-width: 120px;
        cursor: pointer;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        font-weight: bold;
    }

    .session-button:hover {
        background-color: #FFF4E5;
    }

    /* .quota-left {
        color: #333;
        font-size: 1rem;
        font-weight: bold;
    }

    .quota-left-value {
        color: #FF9029;
        font-weight: bold;
    } */

    .card-footer {
        padding: 0.5rem 1rem;
        background-color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .price-label {
        font-size: 1.1rem;
        font-weight: 600;
    }

    .price {
        color: #FF9029;
        font-weight: 600;
    }

    .button-group {
        display: flex;
        gap: 0.5rem;
    }

    .edit-button {
        background-color: #007BFF;
        color: white;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
        transition: background-color 0.2s ease;
    }

    .edit-button:hover {
        background-color: #0056b3;
    }

    .delete-button {
        padding: 4px 8px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 4px;
        transition: background-color 0.2s ease;
    }

    .delete-button {
        background-color: #EA4036;
        color: white;
        border: none;
    }

    .delete-button:hover {
        background-color: #d32f2f;
    }

    .delete-modal-content {
        text-align: center;
        padding: 20px;
    }

    .icon-container {
        display: flex;
        justify-content: center;
        margin-bottom: 16px;
    }

    .delete-icon {
        width: 60px;
        height: 60px;
    }

    .delete-title {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 8px;
    }

    .delete-description {
        font-size: 1rem;
        margin-bottom: 8px;
    }

    .delete-warning {
        color: red;
        font-style: italic;
        margin-bottom: 16px;
    }

    .modal-actions {
        display: flex;
        justify-content: center;
        gap: 16px;
    }

    .cancel-btn, .delete-btn {
        padding: 8px 16px;
        border-radius: 8px;
        cursor: pointer;
    }

    .cancel-btn {
        background-color: #BDBDBD;
        color: white;
    }

    .cancel-btn:hover {
        background-color: #A0A0A0;
    }

    .delete-btn {
        background-color: white;
        color: red;
        border: 2px solid red;
    }

    .delete-btn:hover {
        background-color: #FFEEEE;
    }    

    .ticket-count {
        margin-top: 1rem;
        font-size: 0.9rem;
        color: #FF9029;
        font-weight: bold;
    }
</style>
