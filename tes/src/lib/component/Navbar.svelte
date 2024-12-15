<script>
	import { goto } from '$app/navigation';
    import Hamburger from './Hamburger.svelte';
    import search from '$lib/images/search.svg';
    import cart_icon from '$lib/images/cart_icon.svg';

    
    export let sidebar = false;
    export let src = '';

    // Function to handle profile click
    function goToProfile() {
        goto('/profile');
    }

    function cart(){
        goto('/cart');
    }
</script>

<header class="flex bg-[#FEFEFE] p-2 items-center text-gray-600 border-b-2">
    <div class="flex items-center">
        <Hamburger bind:open={sidebar} />
    </div>
    <div class="relative w-1/2 ml-4"> <!-- Updated to make the input longer -->
        <input type="text" placeholder="Search" class="search-input w-full p-2 rounded-full border border-gray-300 pl-10"/>
        <img src="{search}" alt="Search" class="search-icon"/>
    </div>
    <!-- <div class="flex">
       
    </div> -->
    <div class="flex items-center ml-auto"> <!-- Pushes the profile picture to the right -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="cart-user cursor-pointer" on:click={cart}>
            <img src="{cart_icon}" alt="cart" style="width: 24px; height:24px;">
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="w-8 h-8 rounded-full overflow-hidden cursor-pointer" on:click={goToProfile}>
            <img src={src || "https://via.placeholder.com/32"} alt="Profile" class="w-full h-full object-cover"/>
        </div>
    </div>
    
</header>

<style>
    .search-input {
        padding: 8px;
        border-radius: 9999px; /* Full rounded corners */
        border: 1px solid #ccc;
        width: 100%;
        padding-left: 40px; /* To make space for the icon */
        box-sizing: border-box;
    }

    .search-icon {
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
    }

    img {
        display: block;
        border-radius: 50%;
    }

    .ml-auto {
        margin-left: auto; /* Pushes the profile picture to the right */
    }

    .cursor-pointer {
        cursor: pointer;
    }
    
</style>
