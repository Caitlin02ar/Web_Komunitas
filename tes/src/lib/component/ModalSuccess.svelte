<script>
    import { afterUpdate } from 'svelte';
    import successIcon from '$lib/images/success-icon.svg';
    export let show = false;
    export let successMessage = '';

    function close() {
        show = false;
    }

    $: if (show) {
        setTimeout(() => {
            close();
        }, 3000);
    }
</script>

{#if show}
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
            <div class="flex justify-center mb-4">
                <img src={successIcon} alt="Success" width="50" height="50" />
            </div>
            <div class="text-center">
                <p class="text-lg font-semibold">{successMessage}</p>
            </div>
        </div>
    </div>
{/if}

<!-- <style>
  .modal-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
  }
  .modal-content {
    background: white;
    padding: 1rem;
    border-radius: 0.375rem;
    max-width: 90%;
    width: 500px;
  }
</style> -->
