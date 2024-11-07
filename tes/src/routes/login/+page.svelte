<script>
    // @ts-nocheck
    import Loading from '$lib/component/Loading.svelte';

    let username = '';
    let password = '';
    let errorMessage = '';
    let isLoading = false; // State untuk loading spinner

    function handleSubmit(event) {
        event.preventDefault(); // Mencegah submit default

        isLoading = true;
        event.target.submit();
    }
</script>

<svelte:head>
    <title>Login | Wave</title>
</svelte:head>

<section class="login">
    {#if isLoading}
        <Loading message="Logging in..." /> <!-- Display the loading component when isLoading is true -->
    {/if}
    <div class="login-form">
        <div class="buat-border">
            <h2>Sign In</h2>
            <form method="POST" on:submit={handleSubmit}>
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" bind:value={username} required />
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" bind:value={password} required />
                </div>
                <div class="form-options">
                    <a href="/forgot">Forgot Password?</a>
                </div>
                <button type="submit" class="btn-login">Login</button>
                <div class="signup-link">
                    <p>Don't have an account? <a href="/signUp">Sign Up</a></p>
                </div>
            </form>
            {#if errorMessage}
                <p style="color: red;">{errorMessage}</p>
            {/if}
        </div>
    </div>
    <div class="side-image">
        <div class="login-image">
            <h1>Together on Every Wave</h1>
            <img src="src/lib/images/Login-Signup.png" alt="Login Illustration" />
        </div>
    </div>
</section>

<style>
    .login {
        display: flex;
        height: 100vh;
        position: relative; /* Required for the overlay to work */
    }

    .login-form {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        padding: 2rem;
        width: 50%;
    }

    .login-form h2 {
        font-size: 150%;
        margin-bottom: 2rem;
    }

    .form-group {
        margin-bottom: 1rem;
        width: 100%;
    }

    .buat-border {
        border: 1px solid #737373;
        border-radius: 30px;
        padding: 50px;
        width: 50%;
        height: auto;
    }

    .form-group label {
        display: block;
        font-size: 100%;
        margin-bottom: 0.5rem;
    }

    .form-group input {
        width: 100%;
        padding: 0.5rem;
        font-size: 100%;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .form-options {
        display: flex;
        width: 100%;
        margin-bottom: 1rem;
    }

    .form-options a {
        color: #737373;
        opacity: 70%;
        text-decoration: none;
        font-size: 100%;
    }

    .form-options a:hover {
        text-decoration: underline;
    }

    .btn-login {
        width: 100%;
        padding: 0.75rem;
        font-size: 100%;
        background-color: #191D29;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .btn-login:hover {
        background-color: #FF9029;
    }

    .signup-link {
        margin-top: 1rem;
    }

    .signup-link p {
        font-size: 100%;
    }

    .signup-link a {
        color: #007bff;
        text-decoration: none;
    }

    .signup-link a:hover {
        text-decoration: underline;
    }

    .side-image {
        width: 50%;
        height: 100%;
    }

    .login-image {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        background-color: #282c34;
        color: white;
        height: 100%;
    }

    .login-image img {
        width: 80%;
        margin-bottom: 1rem;
    }

    .login-image h1 {
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 1rem;
    }

    @media (max-width: 768px) {
        .login {
            flex-direction: column;
        }

        .login-image {
            padding: 1rem;
        }

        .login-form {
            padding: 1rem;
            max-width: 90%;
        }

        .login-image {
            display: none;
        }

        .login-form h2 {
            font-size: 1.5rem;
        }
    }

    
</style> 
