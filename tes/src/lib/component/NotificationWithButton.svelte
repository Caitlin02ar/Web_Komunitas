<script>
    export let message = "";
    export let buttonText = "";
    export let buttonHref = "";
    export let svgPath = "";
</script>

<div class="notification-container">
    <div class="notification-content">
        {#if svgPath}
            <div class="icon">
                <img src={svgPath} alt="icon" class="icon-image">
            </div>
        {/if}
        <div class="message">
            {message}
        </div>
        {#if buttonHref}
            <a href={buttonHref} class="action-button">
                {buttonText}
            </a>
        {:else}
            <button class="action-button">
                {buttonText}
            </button>
        {/if}
    </div>
</div>

<style>
    .notification-container {
        display: flex;
        align-items: center;
        border: 1px solid #ccc;
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
    }
    .notification-content {
        display: flex;
        align-items: center;
        flex-grow: 1;
    }
    .icon {
        margin-right: 1rem;
    }
    .icon-image {
        width: 24px;
        height: 24px;
    }
    .message {
        flex-grow: 1;
    }
    .action-button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        text-decoration: none;
        display: flex;
        align-items: center;
    }
    .action-button:hover {
        background-color: #0056b3;
    }
</style>
