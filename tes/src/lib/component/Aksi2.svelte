<script>
    /**
     * @typedef {Object} Action
     * @property {string} text - The text to display for the action.
     * @property {function} onClick - The function to call when the action is clicked.
     */

    /**
     * @type {Action[]}
     */
    export let actions = [];
    let showMenu = false;
    import aksi2 from '$lib/images/aksi2.svg';

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
        right: 0; /* Align to the right */
        padding: 8px 0; /* Add padding to the menu */
    }
    
    .menu-item {
        padding: 8px 12px;
        cursor: pointer;
        white-space: nowrap; /* Prevent text wrapping */
        color: black; /* Ensure text color is black */
        display: block; /* Ensure items are block elements */
    }
    
    .menu-item:hover {
        background-color: #f5f5f5;
    }
</style>

<div class="relative inline-block">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<img src="{aksi2}" alt="Aksi" class="cursor-pointer" on:click={toggleMenu} />
    {#if showMenu}
        <div class="menu">
            {#each actions as action}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class="menu-item" on:click={() => { closeMenu(); action.onClick(); }}>{action.text}</div>
            {/each}
        </div>
    {/if}
</div>
