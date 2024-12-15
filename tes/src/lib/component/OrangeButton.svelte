<!-- src/lib/component/OrangeButton.svelte -->
<script>
    export let text = '';
    export let onClick = () => {};
    export let href = ''; // Add href as a prop
  </script>
  
  <style>
    .orange-button {
      background-color: #FF9029;
      color: white;
      border-radius: 0.25rem;
      padding: 0.5rem 1rem;
      transition: background-color 0.3s;
    }
  
    .orange-button:hover {
      background-color: #FA7D09;
    }
  </style>
  
  {#if href}
    <a class="orange-button" href={href}>
      {text}
    </a>
  {:else}
    <button class="orange-button" on:click={onClick}>
      {text}
    </button>
  {/if}
  