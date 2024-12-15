<script>
    export let message = "Loading...";
</script>

<style>
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8); /* Black background with transparency */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000; /* Ensure it's on top of other content */
    }

    .loading-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
    }

    .loading-spinner {
        border: 8px solid rgba(255, 140, 0, 0.2); /* Dark orange with transparency for the darker part */
        border-left-color: #FF9029; /* Bright orange for the moving part */
        border-radius: 50%;
        width: 80px; /* Larger size */
        height: 80px; /* Larger size */
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .loading-message {
        color: white;
        font-size: 1rem;
    }
</style>

<div class="overlay">
    <div class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-message">{message}</p>
    </div>
</div>
