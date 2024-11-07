<script>
    import Cart from '$lib/component/Cart.svelte';
    import Loading from '$lib/component/Loading.svelte'; // Import Loading component
    import { onMount } from 'svelte';

    let loading = true;
    let error = null;

    // Simulating data fetching
    onMount(() => {
        // Simulate async operation (e.g., fetching data)
        setTimeout(() => {
            // After 2 seconds, set loading to false
            loading = false;
        }, 2000);
    });
</script>

<div class="header">
    <h2>My Cart</h2>
</div>
<section>
    {#if loading}
        <Loading />
    {:else if error}
        <p>{error}</p>
    {:else}
        <Cart />
    {/if}
</section>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
    :global(html) {
        font-family: 'Inter', sans-serif;
    }
    .header {
        padding: 32px;
        padding-bottom: 0px;
    }
    .header h2 {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 16px;
    }
</style>
