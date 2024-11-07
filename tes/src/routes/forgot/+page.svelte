<script>
    let email = "";

    async function resetPassword() {
        if (!email) {
            alert("Please enter your Email");
            return;
        }
    try {
        const apiURL = import.meta.env.VITE_API_BASE_URL + '/v1/forgotpassword';
        const response = await fetch(apiURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email })
            });
            if (response.ok) {
                // Jika berhasil, berikan pesan sukses
                alert("A reset link has been sent to your email.");
            } else {
                // Jika gagal, tampilkan pesan error
                alert("Failed to send reset email. Please try again.");
            }
        } catch (error) {
            alert("An error occurred. Please try again later.");
        }
    }

</script>
<style>
    .form-forgot {
        border: 1px solid gray;
        padding: 20px;
        width: 40%;
        border-radius: 5px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Tambahkan shadow untuk memberikan depth */
    }
    .form {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin: 40px 0;
        margin-left: 0px;
    }
    .image-forgot {
        width: 50%;
        display: flex;
        justify-content: center;
    }
    .image-forgot img {
        max-width: 80%; /* Membuat gambar lebih besar */
        height: auto;
    }
    .header-form {
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 4px;
        text-align: left;
    }
    .info {
        text-align: left;
        margin-bottom: 24px;
        margin-top: 0px;
        color: #9D9D9D;
        font-weight: 500;
    }
    .input-form {
        margin-top: 24px;
    }
    .input-form input {
        width: 100%; /* Membuat input 100% dari div */
        padding: 12px;
        border-radius: 5px;
        border: 1px solid gray;
        font-size: 16px;
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

    .back-to-login {
        margin-top: 20px;
        text-align: center;
    }
    .back-to-login a {
        text-decoration: none;
        color: black;
    }
    .back-to-login a:hover {
        text-decoration: underline;
    }
    @media (max-width: 768px) {
        
        .image-forgot {
            display: none;
        }
        .form-forgot {
            width: 90%;
        }
    }
</style>

<section>
    <div class="form">
        <div class="image-forgot">
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img src="src\lib\images\Forgot password.png" alt="Forgot password image">
        </div>

        <div class="form-forgot">
            <div class="header-form">
                Forgot Password
            </div>
            <div class="info">
                Enter your email to reset it
            </div>

            <div class="input-form">
                <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    bind:value={email} 
                    placeholder="Email">
            </div>

            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="button" on:click={resetPassword}>
                Confirm
            </div>

            <div class="back-to-login">
                <a href="/login">← Back to login page</a>
            </div>
        </div>
    </div>
</section>
