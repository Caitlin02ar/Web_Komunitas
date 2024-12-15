<script>
    // @ts-nocheck
    import { writable } from 'svelte/store';
    import Modal from './Modal.svelte';
    import edit from '$lib/images/edit.svg';
    import delete_icon from '$lib/images/delete.svg';

    let sessions = writable([]);
    let showAddSessionModal = writable(false);
    let showEditSessionModal = writable(false);
    let isEditMode = writable(false);
    let sessionToEdit = writable({ startDateTime: '', endDateTime: '', quota: '' });
    let sessionIndexToEdit = null;

    // Function to open the Add Session modal
    function addSession() {
        sessionToEdit.set({ startDateTime: '', endDateTime: '', quota: '' });
        isEditMode.set(false);
        showAddSessionModal.set(true);
        console.log('Add session modal opened');  // Debugging
    }

    // Function to open the Edit Session modal
    function editSession(index) {
        sessions.update(allSessions => {
            sessionToEdit.set({ ...allSessions[index] });
            sessionIndexToEdit = index;
            isEditMode.set(true);
            showEditSessionModal.set(true);
            console.log('Edit session modal opened', $showEditSessionModal);  // Debugging
            return allSessions;
        });
    }

    // Function to save the session (both add and edit)
    function saveSession() {
        sessionToEdit.subscribe(currentEdit => {
            sessions.update(allSessions => {
                if ($isEditMode) {
                    allSessions[sessionIndexToEdit] = currentEdit;
                } else {
                    allSessions.push(currentEdit);
                }
                return allSessions;
            });
        });
        closeModal();
    }

    // Function to delete a session
    function deleteSession(index) {
        sessions.update(allSessions => allSessions.filter((_, i) => i !== index));
    }

    // Function to close the modal
    function closeModal() {
        showAddSessionModal.set(false);
        showEditSessionModal.set(false);
        console.log('Modal closed');  // Debugging
    }
</script>

<!-- Displaying the list of sessions -->
<div class="relative mt-8">
    <h2 class="text-xl font-semibold mb-4">Event Category Session</h2>
    <button class="add-session-button absolute top-0 right-0" on:click={addSession}>Add Session</button>

    {#each $sessions as session, index}
        <div class="session-container mb-4">
            <h3 class="font-semibold mb-2">Session {index + 1}</h3>
            <div class="flex items-center justify-between p-4 border rounded-lg bg-gray-100">
                <div class="session-info">
                    <div>Session Start: {session.startDateTime}</div>
                    <div>Session End: {session.endDateTime}</div>
                    <div>Session Quota: {session.quota}</div>
                </div>
                <div class="flex items-center gap-2">
                    <button class="edit-button" on:click={() => editSession(index)}>
                        <img src="{edit}" alt="Edit" />
                    </button>
                    <button class="delete-button" on:click={() => deleteSession(index)}>
                        <img src="{delete_icon}" alt="Delete" />
                    </button>
                </div>
            </div>
        </div>
    {/each}
</div>

<!-- Modal for Adding Session -->
{#if $showAddSessionModal}
    <Modal show={$showAddSessionModal} onClose={closeModal}>
        <div class="modal-content">
            <h2>Add Session</h2>
            <label for="startDateTime">Event Category Session Start</label>
            <input type="datetime-local" id="startDateTime" bind:value={$sessionToEdit.startDateTime} />
    
            <label for="endDateTime">Event Category Session End</label>
            <input type="datetime-local" id="endDateTime" bind:value={$sessionToEdit.endDateTime} />
    
            <label for="quota">Event Quota</label>
            <input type="number" id="quota" bind:value={$sessionToEdit.quota} />
            <div class="modal-buttons">
                <button class="cancel-button" on:click={closeModal}>Cancel</button>
                <button class="save-button" on:click={saveSession}>Save</button>
            </div>
        </div>
    </Modal>
{/if}

<!-- Modal for Editing Session -->
{#if $showEditSessionModal}
    <Modal show={$showEditSessionModal} onClose={closeModal}>
        <div class="modal-content">
            <h2>Edit Session</h2>
            <label for="startDateTime">Event Category Session Start</label>
            <input type="datetime-local" id="startDateTime" bind:value={$sessionToEdit.startDateTime} />
    
            <label for="endDateTime">Event Category Session End</label>
            <input type="datetime-local" id="endDateTime" bind:value={$sessionToEdit.endDateTime} />
    
            <label for="quota">Event Quota</label>
            <input type="number" id="quota" bind:value={$sessionToEdit.quota} />
            <div class="modal-buttons">
                <button class="cancel-button" on:click={closeModal}>Cancel</button>
                <button class="save-button" on:click={saveSession}>Save</button>
            </div>
        </div>
    </Modal>
{/if}


<style>
    .relative {
        position: relative;
    }
    .absolute {
        position: absolute;
    }
    .top-0 {
        top: 0;
    }
    .right-0 {
        right: 0;
    }
    .mt-8 {
        margin-top: 2rem;
    }
    .mb-4 {
        margin-bottom: 1rem;
    }
    .add-session-button {
        background-color: #00A7D0;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        cursor: pointer;
        font-weight: 600;
    }
    .add-session-button:hover {
        background-color: #007bff;
    }
    .session-container {
        padding: 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        background-color: #f7fafc;
    }
    .session-info {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .edit-button, .delete-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 8px;
        cursor: pointer;
    }
    .edit-button {
        background-color: #3b82f6;
    }
    .delete-button {
        background-color: #ef4444;
    }
    .edit-button img, .delete-button img {
        width: 20px;
        height: 20px;
    }
    .modal-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 400px;
        margin: auto;
    }
    .modal-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1.5rem;
    }
    .cancel-button {
        background-color: #e2e8f0;
        color: #4a5568;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        border: none;
    }
    .save-button {
        background-color: #007bff;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        border: none;
    }
</style>
