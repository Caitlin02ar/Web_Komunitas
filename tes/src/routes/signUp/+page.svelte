<script>
    // @ts-nocheck
    import { onMount } from 'svelte';

    let fullName = '';
    let username = '';
    let email = '';
    let phoneNumber = '';
    let password = '';
    let confirmPassword = '';
    let gender = '';
    let birthDate = '';
    let address = '';
    let errorMessage = '';
    let usernameAvailable = true;
  
    const API_URL = import.meta.env.VITE_API_BASE_URL;

    async function checkUsernameAvailability() {
        try {
            const response = await fetch(`${API_URL}/v1/admin/users?username=${username}`, {
                method: 'GET',
            });

            const data = await response.json();

            // Assuming the API returns a boolean field `available`
            if (response.ok && !data.available) {
                usernameAvailable = false;
                errorMessage = 'Oops! Username already taken!';
            } else {
                usernameAvailable = true;
                errorMessage = '';
            }
        } catch (error) {
            console.error('Error:', error);
            errorMessage = 'Unable to check username availability';
        }
    }

    async function signUp() {
        if (password !== confirmPassword) {
            errorMessage = 'Passwords do not match';
            return;
        }

        if (!usernameAvailable) {
            errorMessage = 'Oops! Username already taken!';
            return;
        }

        try {
            const response = await fetch(`${API_URL}/v1/registrasi`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    nama_user: fullName,
                    email: email,
                    jenis_kelamin: gender,
                    no_telpon: phoneNumber,
                    password: password,
                    tanggal_lahir: birthDate,
                    alamat: address
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 500 && data.message === 'Username sudah terdaftar') {
                    usernameAvailable = false;
                    errorMessage = 'Oops! Username already taken!';
                } else {
                    errorMessage = data.message || 'An error occurred during registration';
                }
                return;
            }

            errorMessage = 'Registration successful! Redirecting to login...';

            // Redirect to login page after successful registration
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500); 
        } catch (error) {
            console.error('Error:', error);
            errorMessage = 'Network error';
        }
    }

</script>
<section class="login">
    <div class="login-form">
        <div class="container-form">
            <h2>Sign Up</h2>
            <form on:submit|preventDefault={signUp}>
                <div class="form-group">
                    <label for="full_name">Full Name</label>
                    <input type="text" id="full_name" bind:value={fullName} required />
                </div>
                <div class="form-group">
                    <label for="username">Username</label>
                    <input 
                        type="text" 
                        id="username" 
                        bind:value={username} 
                        required 
                        on:input={checkUsernameAvailability} 
                    />
                    {#if !usernameAvailable}
                        <p class="error-message">{errorMessage}</p>
                    {/if}
                </div>
                <div class="number-input">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" bind:value={email} required />
                    </div>
                    <div class="form-group">
                        <label for="phone_number">Phone Number</label>
                        <input type="tel" id="phone_number" bind:value={phoneNumber} required />
                    </div>
                </div>
                <div class="information">
                    <div class="form-group">
                        <label for="gender">Gender</label>
                        <select id="gender" bind:value={gender} required>
                            <option value="" disabled selected>Select your gender</option>
                            <option value="L">Male</option>
                            <option value="P">Female</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="birth_date">Birth Date</label>
                        <input type="date" id="birth_date" bind:value={birthDate} required />
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="address">Address</label>
                    <input type="text" id="address" bind:value={address} required />
                </div>
                <div class="password">
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" bind:value={password} required />
                    </div>
                    <div class="form-group">
                        <label for="confirm_password">Confirm Password</label>
                        <input type="password" id="confirm_password" bind:value={confirmPassword} required />
                    </div>
                </div>
                
                <button type="submit" class="btn-login">Sign Up</button>
                {#if errorMessage && usernameAvailable}
                    <p class="error-message">{errorMessage}</p>
                {/if}
                <div class="signup-link">
                    <p>Already have an account? <a href="/login">Login</a></p>
                </div>
            </form>
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
        overflow-y: hidden;
    }

    .login-form {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        padding: 1.5rem;
        width: 40%;
    }

    .password, .information, .number-input {
        display: flex;
        gap: 4px;
    }
    .login-form h2 {
        font-size: 1.25rem;
        margin-bottom: 8px;
        font-weight: 700;
    }

    .form-group {
        margin-bottom: 2px;
        width: 100%;
    }

    .container-form {
        border: 1px solid #737373;
        border-radius: 20px;
        padding: 30px;
        width: 100%;
        height: fit-content;
    }

    .form-group label {
        display: block;
        font-size: 0.875rem;
        margin-bottom: 4px;
    }

    .form-group input,
    .form-group select {
        width: 100%;
        padding: 4px;
        font-size: 13px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        margin-bottom: 4px;
    }
    
    .btn-login {
        width: 100%;
        padding: 0.5rem;
        font-size: 0.875rem;
        background-color: #191D29;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 8px;
    }

    .btn-login:hover {
        background-color: #FF9029;
    }

    .signup-link {
        margin-top: 0.75rem;
        font-size: 0.875rem;
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
        /* height: auto; */
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #282c34;
    }

    .login-image {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        color: white;
    }

    .login-image img {
        width: 70%;
        height: auto;
        margin-bottom: 1rem;
    }

    .login-image h1 {
        font-size: 1.75rem;
        font-weight: bold;
        margin-bottom: 1rem;
    }

    .error-message {
        color: white;
        background-color: red;
        padding: 0.5rem;
        margin-top: 0.5rem;
        border-radius: 4px;
        border: 1px solid darkred;
        text-align: center;
    }

    /* @media (max-width: 768px) {
        .login {
            flex-direction: column;
        }

        .login-image {
            display: none;
        }

        .login-form {
            padding: 1rem;
            max-width: 90%;
        }

        .login-form h2 {
            font-size: 1.25rem;
        }
    } */
</style>
