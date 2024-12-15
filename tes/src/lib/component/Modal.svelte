<script>
  export let show = false;
  export let title = '';
  export let onClose = () => {};
  import close_icon from '$lib/images/silang-hitam.svg';

  function close() {
    onClose();
  }
</script>

{#if show}
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white rounded-lg shadow-lg modal-container p-4 relative">
      <div class="flex justify-between items-center border-b pb-2 mb-2">
        <h2 class="text-xl font-bold">{title}</h2>
        <button class="ml-4" on:click={close} aria-label="Close">
          <img src="{close_icon}" alt="Close" class="w-4 h-4" />
        </button>
      </div>
      <div>
        <slot></slot>
      </div>
    </div>
  </div>
{/if}

<style>
  .fixed {
    position: fixed;
  }

  .inset-0 {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .bg-black {
    background-color: rgba(0, 0, 0, 0.5);
  }

  .z-50 {
    z-index: 50;
  }

  .relative {
    position: relative;
  }

  .bg-white {
    background-color: white;
  }

  .rounded-lg {
    border-radius: 0.5rem;
  }

  .shadow-lg {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  .p-4 {
    padding: 1rem;
  }

  .border-b {
    border-bottom-width: 1px;
  }

  .pb-2 {
    padding-bottom: 0.5rem;
  }

  .text-xl {
    font-size: 1.25rem;
  }

  .font-bold {
    font-weight: 700;
  }

  .flex {
    display: flex;
  }

  .justify-between {
    justify-content: space-between;
  }

  .items-center {
    align-items: center;
  }

  .ml-4 {
    margin-left: 1rem;
  }

  .modal-container {
    max-width: 500px; 
    width: 100%;
    
  }
</style>
