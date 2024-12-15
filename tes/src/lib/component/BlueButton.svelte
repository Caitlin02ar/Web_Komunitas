<!-- src/lib/component/OrangeButton.svelte -->
<script>
    export let text = '';
    export let onClick = () => {};
    export let href = ''; // Add href as a prop
  </script>
  
  <style>
    .blue-button {
      background-color: #7AB2B2;
      color: white;
      border-radius: 0.25rem;
      padding: 0.5rem 1rem;
      transition: background-color 0.3s;
    }
  
    .blue-button:hover {
      background-color: #679a9a;
    }
  </style>
  
  {#if href}
    <a class="blue-button" href={href}>
      {text}
    </a>
  {:else}
    <button class="blue-button" on:click={onClick}>
      {text}
    </button>
  {/if}
  