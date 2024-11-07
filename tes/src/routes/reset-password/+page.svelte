<script>
    import successIcon from '$lib/images/success-icon.svg';
    import { onMount } from 'svelte';

    let token = "";
    let newPassword = "";
    let confirmPassword = "";
    // let errorMessage = "";
    let showModal = false;
    let newPasswordError = "";
    let confirmPasswordError = "";
    let passwordMatch = false;

    onMount(() => {
        const params = new URLSearchParams(window.location.search);
        // @ts-ignore
        token = params.get('token');
        // if (!token) {
        //     alert('Invalid token. Please try again.');
        // }
    });

    // Function to reset the password
    const resetPassword = async () => {
        newPasswordError = "";
        confirmPasswordError = "";

        if (newPassword === "") {
            newPasswordError = "New password cannot be empty";
            return;
        }

        if (confirmPassword === ""){
            confirmPasswordError = "Confirm password must be fill"
            return;
        }

        // Validate password and confirm password
        if (newPassword !== confirmPassword) {
            confirmPasswordError = "Passwords do not match";
            passwordMatch = true;
            return;
        }

        const body = {
            token,
            newPassword,
            confirmPassword
        };

        try {
            const apiURL = import.meta.env.VITE_API_BASE_URL + '/v1/resetpassword/' + token;
            const response = await fetch(apiURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: newPassword, password2: confirmPassword })
            });

            if (response.ok) {
                showModal = true;
            } else {
                alert('Failed to reset password. Please try again');
                newPassword = "";
                confirmPassword = "";
            }
        } catch (error) {
            alert("An error occurred. Please try again later");
        }
        if (passwordMatch){
            confirmPasswordError = "Password do not match"
        }
    };

    const closeModal = () => {
        showModal = false;
    };
</script>

<div class="form">
    <div class="image-forgot">
        <img src="src/lib/images/Forgot password.png" alt="Forgot Password">
    </div>

    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="form-forgot">
        <div class="header">
            Reset Password
        </div>
        <div class="info">
            Enter your new password
        </div>

        <div class="input-form">
            <div class="group-form">
                <input 
                    type="password" 
                    id="new-password" 
                    bind:value={newPassword} 
                    placeholder="Enter new password" 
                    class={newPasswordError || confirmPasswordError ? 'input-error' : ''}
                />
                {#if newPasswordError}
                    <small id="error-new" class="error-message">{newPasswordError}</small>
                {/if}
            </div>
            <div class="group-form">
                <input 
                    type="password" 
                    id="confirm-password" 
                    bind:value={confirmPassword} 
                    placeholder="Confirm new password" 
                    class={confirmPasswordError || confirmPasswordError ? 'input-error' : ''}
                />
                {#if confirmPasswordError}
                    <small id="error-confirm" class="error-message">{confirmPasswordError}</small>
                {/if}
            </div>
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="button" on:click={resetPassword}>
            Verification
        </div>
    </div>
</div>

<div class="modal {showModal ? 'show' : ''}">
    <div class="modal-content">
        <img src={successIcon} alt="Success" width="32" height="32" />
        <p>Password successfully reset!</p>
        <button class="close" on:click={closeModal}>Close</button>
    </div>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
    :global(html) {
        font-family: 'Inter', sans-serif;
    }
    .form {
        display: flex;
        flex-direction: column; 
        justify-content: center;
        align-items: center;
        width: 100%;
        margin: 40px 0;
        margin-left: 0px;
    }

    .form-forgot {
        border: 1px solid gray;
        padding: 20px;
        width: 90%; 
        max-width: 400px;
        border-radius: 5px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    }

    .image-forgot {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-bottom: 20px; 
        margin-left: 0px;
    }

    .image-forgot img {
        max-width: 80%;
        height: auto;
    }

    .header {
        font-size: 24px;
        font-weight: bold;
        text-align: left;
        margin-bottom: 4px;
    }

    .info {
        text-align: left;
        color: #9D9D9D;
        font-weight: 500;
    }


    input {
        width: 100%;
        padding: 12px;
        border-radius: 5px;
        border: 1px solid gray;
        font-size: 16px;
    }

    .group-form {
        display: flex;
        flex-direction: column;
        margin-top: 16px;
    }

    .button {
        margin-top: 32px;
        background-color: black;
        color: white;
        border-radius: 5px;
        padding: 12px;
        width: 100%;
        cursor: pointer;
        font-size: 16px;
        text-align: center;
        font-weight: bold;
    }

    .button:hover {
        background-color: #FF9029;
    }

    .modal {
        display: flex;
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        justify-content: center;
        align-items: center;
        visibility: hidden;
        opacity: 0;
        transition: visibility 0s, opacity 0.1s linear;
    }

    .modal.show {
        visibility: visible; 
        opacity: 1;
    }

    .modal-content {
        background-color: white;
        padding: 20px;
        border-radius: 5px;
        width: 90%; 
        max-width: 300px;
        height: auto;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .modal-content p {
        font-size: 16px;
    }

    .modal-content img {
        margin-bottom: 12px;
    }

    .close {
        background-color: red;
        color: white;
        padding: 4px;
        border-radius: 5px;
        width: 50%; 
        margin-top: 16px;
        cursor: pointer;
        font-weight: 600;
    }

    .close:hover {
        background-color: #bd0b0b;
    }

    .error-message {
        color: red;
        font-size: 12px;
    }

    .input-error {
        border-color: red;
        border-style: solid;
    }

    @media (min-width: 600px) {
        .form {
            flex-direction: row; 
        }

        .image-forgot {
            width: 50%; 
        }

        .form-forgot {
            width: 40%; 
        }
    }

    @media (min-width: 768px) {
        .header {
            font-size: 28px; 
        }

        .info {
            font-size: 14px; 
        }
    }
</style>

