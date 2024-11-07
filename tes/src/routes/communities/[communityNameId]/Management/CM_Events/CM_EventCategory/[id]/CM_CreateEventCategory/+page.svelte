<script>
    // @ts-nocheck
    import TextInput from '$lib/component/TextInput.svelte';
    import TextareaInput from '$lib/component/TextareaInput.svelte';
    import ButtonBack from '$lib/component/ButtonBack.svelte';
    import AddSession from '$lib/component/AddSession.svelte';

    let eventCategoryName = '';
    let eventCategoryDescription = '';
    let eventCategoryPrice = '';
    let termsAndConditions = '';

    let sessions = [];
    let showAddSessionModal = false;
    let sessionToEdit = null;
    let isEditMode = false;

    function addSession() {
        sessionToEdit = { date: '', startTime: '', endTime: '' };
        isEditMode = false;
        showAddSessionModal = true;
    }

    function editSession(index) {
        sessionToEdit = { ...sessions[index] };
        isEditMode = true;
        showAddSessionModal = true;
    }

    function deleteSession(index) {
        sessions.splice(index, 1);
    }

    function saveSession(session) {
        if (isEditMode) {
            const index = sessions.findIndex((s) => s === sessionToEdit);
            sessions[index] = session;
        } else {
            sessions.push(session);
        }
        closeModal();
    }

    function closeModal() {
        showAddSessionModal = false;
    }
</script>

<ButtonBack href="/communities/[communityNameId]/Management/CM_Events" text="Back" />

<div class="bg-white shadow-md rounded-lg p-8">
    <h1 class="text-2xl font-bold mb-4 text-left">Add Event Category</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
            <TextInput label="Event Category Name" placeholder="Type your event category name" bind:value={eventCategoryName} />
            <TextareaInput label="Event Category Description" placeholder="Type your event category description..." bind:value={eventCategoryDescription} />
            <TextInput label="Event Category Price" placeholder="Type your event category price..." bind:value={eventCategoryPrice} prefix="Rp." />
        </div>
        <div>
            <TextareaInput label="Terms and Conditions" placeholder="Type your event category terms and conditions" bind:value={termsAndConditions} />
        </div>
    </div>

    <div class="bg-white border border-orange-400 text-orange-700 p-4 rounded-lg mt-8">
        <img src="/src/lib/images/Warning-Kuning.svg" alt="Warning" class="inline mr-2">
        <p class="inline">You can add sessions (date and time) for this event category</p>
    </div>

    <div class="mt-8 relative">
        {#each sessions as session, index}
            <div class="mb-4">
                <h3 class="font-semibold mb-2">Session {index + 1}</h3>
                <div class="flex items-center justify-between p-4 border rounded-lg bg-gray-100">
                    <div class="session-info">
                        <div>Session Date: {session.date}</div>
                        <div>Session Start Time: {session.startTime}</div>
                        <div>Session End Time: {session.endTime}</div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button class="edit-button" on:click={() => editSession(index)}>
                            <img src="/src/lib/images/edit.svg" alt="Edit" />
                        </button>
                        <button class="delete-button" on:click={() => deleteSession(index)}>
                            <img src="/src/lib/images/delete.svg" alt="Delete" />
                        </button>
                    </div>
                </div>
            </div>
        {/each}
    </div>

    <AddSession
        show={showAddSessionModal}
        session={sessionToEdit}
        onClose={closeModal}
        onSave={saveSession}
        isEditMode={isEditMode}
    />
</div>

<style>
    .mt-8 {
        margin-top: 2rem;
    }

    .w-full {
        width: 100%;
    }

    .flex-1 {
        flex: 1;
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

    .bg-gray-100 {
        background-color: #f7fafc;
    }

    .p-4 {
        padding: 1rem;
    }

    .mb-4 {
        margin-bottom: 1rem;
    }

    .rounded-lg {
        border-radius: 0.5rem;
    }

    .border {
        border: 1px solid #e2e8f0;
    }

    .edit-button, .delete-button, .add-session-button {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        font-weight: 500;
        border-radius: 0.375rem;
        cursor: pointer;
    }

    .edit-button {
        background-color: #3b82f6;
        color: white;
        border: none;
    }

    .edit-button:hover {
        background-color: #2563eb;
    }

    .delete-button {
        background-color: #ef4444;
        color: white;
        border: none;
    }

    .delete-button:hover {
        background-color: #dc2626;
    }

    .add-session-button {
        background-color: #00A7D0;
        color: white;
        border: none;
        margin-bottom: 1rem;
    }

    .add-session-button:hover {
        background-color: #007bff;
    }

    h3.font-semibold {
        font-weight: 600;
    }

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

    .session-info {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
</style>
