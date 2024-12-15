<script>
  import { createEventDispatcher } from 'svelte';

  export let open = false;
  export let title = '';
  export let content = '';
  export let buttonText = 'Request Join';
  // export let komunitasId = '';

  const dispatch = createEventDispatcher();

  function requestJoin() {
    console.log("Request Join Button Clicked"); // Debug log
    dispatch('requestJoin');
    closeModal();
  }

  function closeModal() {
    console.log("Closing Modal"); // Debug log
    open = false;
    dispatch('close');
  }

  $: console.log("Modal open state:", open); // Debug log
</script>

{#if open}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-overlay" on:click={closeModal}>
    <div class="modal-content" on:click|stopPropagation>
      <div class="modal-header">
        <button class="close-button" on:click={closeModal}>
          &#10005;
        </button>
        <h2 class="modal-title">{title}</h2>
      </div>
      <div class="modal-body">
        <p>{content}</p>
      </div>
      <div class="modal-footer">
        <button class="request-button" on:click={requestJoin}>{buttonText}</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1100;
  }

  .modal-content {
    background: white;
    border-radius: 8px;
    padding: 10px 20px 20px 20px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
    max-width: 400px;
    width: 100%;
    text-align: center;
    z-index: 1101;
  }

  .modal-header {
    display: flex;
    justify-content: center;
    position: relative;
  }

  .modal-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin: 0;
    padding-top: 30px;
  }

  .close-button {
    position: absolute;
    top: 0;
    right: 0;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    outline: none;
  }

  .modal-body {
    margin-top: 16px;
    font-size: 1rem;
    font-weight: 500;
  }

  .modal-footer {
    margin-top: 32px;
    display: flex;
    justify-content: center;
  }

  .request-button {
    background-color: #FFA959;
    color: white;
    border: none;
    border-radius: 50px;
    padding: 8px 24px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .request-button:hover {
    background-color: #FF9029;
  }
</style>
