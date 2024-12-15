<script>
    export let title = '';
    export let description = '';
    export let visible = false;
    export let bgColor = 'bg-green-100'; // Default background color
    export let icon = ''; // Icon path
    export let onClose = () => {};
</script>

<div class={`fixed top-5 right-5 max-w-sm w-full shadow-lg rounded-lg border ${bgColor}`} class:hidden={!visible}>
    <div class="flex items-start p-4">
        <!-- Adjusted icon size and position -->
        <img src={icon} alt="Icon" class="w-11 h-11 mr-3 transform translate-y-3">
        <div class="flex-1">
            <p class="text-lg font-bold text-gray-800">{title}</p>
            <p class="text-sm text-gray-600">{description}</p>
        </div>
        <button on:click={onClose} class="ml-4 text-gray-500 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
</div>

<style>
    .hidden {
        display: none;
    }
</style>
