<script>
    export let isOpen = false;
    export let headerText = '';
    export let bodyText = '';
    export let onClose = () => {};
    export let onConfirm = () => {};

    function closeModal() {
        if (onClose) {
            onClose();
        }
    }

    function confirmDelete() {
        if (onConfirm) {
            onConfirm();
        }
    }
</script>

{#if isOpen}
    <div class="modal">
        <div class="modal-content">
            <h2>{headerText}</h2>
            <p>{bodyText}</p>
            <div class="actions">
                <button class="cancel-button" on:click={closeModal}>Cancel</button>
                <button class="delete-button" on:click={confirmDelete}>Yes, delete</button>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    }
    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        text-align: center;
    }
    .actions {
        display: flex;
        justify-content: space-between;
        margin-top: 1rem;
    }
    .cancel-button {
        background-color: #ccc;
        color: #333;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
    }
    .cancel-button:hover {
        background-color: #bbb;
    }
    .delete-button {
        background-color: #dc3545;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
    }
    .delete-button:hover {
        background-color: #c82333;
    }
</style>
