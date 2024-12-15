<script>
  // @ts-nocheck
  export let actions = [];
  export let id; // Menerima ID dari event
  import aksi from '$lib/images/aksi.svg';
  let showMenu = false;

  function toggleMenu() {
    showMenu = !showMenu;
  }

  function closeMenu() {
    showMenu = false;
  }
</script>

<style>
  .menu {
    position: absolute;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    margin-top: 8px;
    z-index: 1000;
    right: 0;
    padding: 8px 0;
  }

  .menu-item {
    padding: 8px 12px;
    cursor: pointer;
    white-space: nowrap;
    color: black;
    display: block;
  }

  .menu-item:hover {
    background-color: #f5f5f5;
  }
</style>

<div class="relative inline-block">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <img src="{aksi}" alt="Aksi" class="cursor-pointer" on:click={toggleMenu} />
  {#if showMenu}
    <div class="menu">
      {#each actions as action}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="menu-item" on:click={() => { action.fn(id); closeMenu(); }}>{action.text}</div>
      {/each}
    </div>
  {/if}
</div>
