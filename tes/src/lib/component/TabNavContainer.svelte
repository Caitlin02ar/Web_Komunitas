<script>
  // @ts-nocheck
  export let tabs = [];
  let activeIndex = 0;

  function setActive(index) {
    activeIndex = index;
    tabs[index].action(); // Call the action instead of using href
  }
</script>

<div class="tab-container">
  {#each tabs as tab, index}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class:active={index === activeIndex}
      class="tab-button"
      on:click={() => setActive(index)}
    >
      {tab.text}
    </div>
  {/each}
</div>

<style>
  .tab-container {
    display: flex;
    gap: 1rem;
    border-bottom: 1px solid #e5e5e5;
  }

  .tab-button {
    padding: 0.5rem 1rem;
    text-decoration: none;
    color: #333;
    position: relative;
    font-size: 1rem;
    cursor: pointer;
  }

  .tab-button.active {
    font-weight: bold;
    color: #000;
  }

  .tab-button.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 3px;
    background-color: orange;
    border-radius: 2px;
  }
</style>
