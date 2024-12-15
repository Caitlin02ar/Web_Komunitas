<script>
    export let href = "/";
    export let text = "Participants";
</script>

<a href={href} class="participants-button">
    <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
    </svg>
    {text}
</a>

<style>
    .participants-button {
        display: inline-flex;
        align-items: center;
        padding: 0.5rem 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        text-decoration: none;
        color: #000;
        font-weight: 500;
        margin-bottom: 0.5rem;
        background-color: #ffcc00;
    }

    .participants-button:hover {
        background-color: #e6b800;
    }

    .icon {
        width: 20px;
        height: 20px;
        margin-right: 0.5rem;
    }
</style>
