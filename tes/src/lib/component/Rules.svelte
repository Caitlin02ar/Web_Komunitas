<script lang="ts">
  export let title: string;
  export let content: string;
  export let previewLength: number = 50; // Jumlah karakter yang ditampilkan dalam preview

  let isOpen = false;

  function toggle() {
    isOpen = !isOpen;
  }
</script>

<div class="rule">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="rule-title" on:click={toggle}>
    <span>{title}</span>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      class:rotated={isOpen}
      style="transition: transform 0.3s ease;"
    >
      <path fill="none" stroke="black" stroke-width="2" d="M6 9l6 6 6-6" />
    </svg>
  </div>
  <div class="rule-content">
    {#if isOpen}
      <p>{content}</p>
    {:else}
      <p>{content.substring(0, previewLength)}{content.length > previewLength ? '...' : ''}</p>
    {/if}
  </div>
</div>

<style>
  .rule {
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #f9f9f9;
    padding: 8px;
    margin-bottom: 8px;
    cursor: pointer;
    width: 100%; /* Memastikan lebar tetap */
    box-sizing: border-box;
  }

  .rule-title {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    align-items: center; /* Vertically align text and icon */
  }

  .rule-content {
    margin-top: 8px;
    font-size: 0.9rem;
    color: #555;
  }

  .rule-content p {
    margin: 0;
    white-space: normal;
    word-wrap: break-word;
  }

  .rotated {
    transform: rotate(180deg); /* Rotate the arrow when content is expanded */
  }
</style>
