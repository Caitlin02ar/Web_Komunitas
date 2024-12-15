<script>
    // @ts-nocheck
    import { onMount } from 'svelte';

    export let buttons = [];
    export let activeIndex = 0;

    // When the component is mounted, find the active tab based on the URL
    onMount(() => {
        const currentUrl = window.location.href;

        // Dynamically find the button based on partial href match in the current URL
        const matchedButtonIndex = buttons.findIndex(button => currentUrl.includes(button.href.split('/').pop()));
        if (matchedButtonIndex !== -1) {
            activeIndex = matchedButtonIndex;
        }
    });

    function setActive(index) {
        activeIndex = index;
        window.location.href = buttons[index].href; // Navigate to the selected tab.
    }
</script>

<div class="tab-container">
    {#each buttons as button, index}
        <button
            class:active={index === activeIndex}
            class="tab-button"
            on:click={() => setActive(index)}
        >
            <!-- svelte-ignore a11y-missing-attribute -->
            <a>{button.text}</a> <!-- Prevent using anchor's href directly for better control of navigation. -->
        </button>
    {/each}
</div>

<style>
    .tab-container {
        display: flex;
        flex-wrap: wrap;
        border: 1px solid #C6D8DB;
        border-radius: 40px;
        padding: 0.5rem;
        max-width: 100%; 
    }
    .tab-button {
        flex: 1;
        margin: 0.2rem;
        padding: 0.5rem 1rem;
        border: 1px solid #C6D8DB;
        border-radius: 40px;
        background: none;
        cursor: pointer;
        text-align: center;
        transition: background 0.3s;
        height: 2.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        white-space: nowrap; 
    }
    .tab-button a {
        text-decoration: none;
        color: inherit;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .tab-button.active {
        background-color: #C6D8DB;
    }
    @media (max-width: 600px) {
        .tab-container {
            flex-direction: column;
            align-items: stretch; 
        }
        .tab-button {
            width: 100%; 
            margin: 0.5rem 0;
        }
    }
</style>
