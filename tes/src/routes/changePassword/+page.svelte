<script>
    import ButtonBack from '$lib/component/ButtonBack.svelte';
    
    let oldPassword = '';
    let newPassword = '';
    let confirmPassword = '';
    let showOldPassword = false;
    let showNewPassword = false;
    let showConfirmPassword = false;

    function toggleShowOldPassword() {
        showOldPassword = !showOldPassword;
    }

    function toggleShowNewPassword() {
        showNewPassword = !showNewPassword;
    }

    function toggleShowConfirmPassword() {
        showConfirmPassword = !showConfirmPassword;
    }

    function handleChangePassword() {
        // Implementasikan logika untuk mengubah password di sini
        console.log("Password change requested");
    }
</script>

<svelte:head>
    <title>Change Password | Wave</title>
</svelte:head>

<div class="page-wrapper">
    <div class="back-button-wrapper">
        <ButtonBack />
    </div>
    <section class="change-password-section">
        <h1>Change Password</h1>
        <form on:submit|preventDefault={handleChangePassword}>
            <div class="form-group">
                <label for="oldPassword">Old Password</label>
                <div class="password-input">
                    {#if showOldPassword}
                        <input type="text" id="oldPasswordText" bind:value={oldPassword} placeholder="Old Password" required />
                    {:else}
                        <input type="password" id="oldPassword" bind:value={oldPassword} placeholder="Old Password" required />
                    {/if}
                    <button type="button" on:click={toggleShowOldPassword} class="toggle-password">
                        <img src={showOldPassword ? '/src/lib/images/eye-close.svg' : '/src/lib/images/eye-open.svg'} alt="Toggle Visibility" />
                    </button>
                </div>
            </div>
            <div class="form-group">
                <label for="newPassword">New Password</label>
                <div class="password-input">
                    {#if showNewPassword}
                        <input type="text" id="newPasswordText" bind:value={newPassword} placeholder="New Password" required />
                    {:else}
                        <input type="password" id="newPassword" bind:value={newPassword} placeholder="New Password" required />
                    {/if}
                    <button type="button" on:click={toggleShowNewPassword} class="toggle-password">
                        <img src={showNewPassword ? '/src/lib/images/eye-close.svg' : '/src/lib/images/eye-open.svg'} alt="Toggle Visibility" />
                    </button>
                </div>
            </div>
            <div class="form-group">
                <label for="confirmPassword">Confirm New Password</label>
                <div class="password-input">
                    {#if showConfirmPassword}
                        <input type="text" id="confirmPasswordText" bind:value={confirmPassword} placeholder="Confirm New Password" required />
                    {:else}
                        <input type="password" id="confirmPassword" bind:value={confirmPassword} placeholder="Confirm New Password" required />
                    {/if}
                    <button type="button" on:click={toggleShowConfirmPassword} class="toggle-password">
                        <img src={showConfirmPassword ? '/src/lib/images/eye-close.svg' : '/src/lib/images/eye-open.svg'} alt="Toggle Visibility" />
                    </button>
                </div>
            </div>
            <button type="submit" class="btn-primary">Change Password</button>
        </form>
    </section>
</div>

<style>
    .page-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 20px;
    }

    .back-button-wrapper {
        margin-bottom: 20px;
    }

    .change-password-section {
        background-color: #fff;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        width: 80%;
        max-width: 900px;
    }

    h1 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        text-align: left;
        color: #333;
        font-weight: bold; /* Bold text */
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-size: 1rem;
        color: #555;
        text-align: left;
        font-weight: bold;
    }

    .password-input {
        display: flex;
        align-items: center;
        position: relative;
        width: 50%;
    }

    input {
        width: 100%; 
        padding: 0.5rem;
        padding-right: 2.5rem; /* Space for the icon */
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
    }

    .toggle-password {
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        outline: none;
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
    }

    .toggle-password img {
        width: 20px;
        height: 20px;
    }

    .btn-primary {
        width: 50%; /* Full width button */
        padding: 0.3rem;
        font-size: 1rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
    }

    .btn-primary:hover {
        background-color: #0056b3;
    }
</style>
