<script>
    export let onClick = () => {};
</script>

<button class="delete-button" on:click={onClick}>
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M9 2a1 1 0 011-1h.586a1 1 0 01.707.293l1.414 1.414H15a1 1 0 110 2h-1v10a2 2 0 01-2 2H8a2 2 0 01-2-2V4H5a1 1 0 110-2h2.293l1.414-1.414A1 1 0 0110 1H9zm1 11a1 1 0 100 2 1 1 0 000-2zm1-4a1 1 0 11-2 0 1 1 0 012 0z" clip-rule="evenodd" />
    </svg>
    Delete
</button>

<style>
    .delete-button {
        display: flex;
        align-items: center;
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
    .delete-button svg {
        margin-right: 0.5rem;
    }
</style>
