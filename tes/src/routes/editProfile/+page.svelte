<script>
    import { onMount } from 'svelte';
    import { getJwtToken, getUserId } from '$lib/js/utils';
    import ButtonBack from '$lib/component/ButtonBack.svelte';
    import { goto } from '$app/navigation';

    let name = '';
    let username = '';
    let email = '';
    let phoneNumber = '';
    let dateOfBirth = ''; // YYYY-MM-DD format for input[type="date"]
    let profilePicture = 'https://via.placeholder.com/150'; // Default profile picture
    let address = '';
    let gender = '';
    let newProfilePicture = null; // To hold the new profile picture file
    let isSaving = false; // State to manage loading status

    onMount(async () => {
        await fetchUserData();
    });

    async function fetchUserData() {
        const token = getJwtToken();
        const userId = getUserId();

        if (token && userId) {
            try {
                const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/user/${userId}`;
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 200) {
                        name = data.data.nama_user;
                        username = data.data.username;
                        email = data.data.email;
                        phoneNumber = data.data.no_telpon;
                        dateOfBirth = data.data.tanggal_lahir.split('T')[0];
                        profilePicture = `${import.meta.env.VITE_API_BASE_URL}/getfoto?path=${data.data.foto_profile}`;
                        address = data.data.alamat;
                        gender = data.data.jenis_kelamin === 'P' ? 'Female' : 'Male';
                    }
                } else {
                    console.error('Failed to fetch user data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        } else {
            console.error('No token or user ID available');
        }
    }

    function handleChangePhoto() {
        document.getElementById('fileInput').click();
    }

    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            newProfilePicture = file;
            profilePicture = URL.createObjectURL(file); // Update the preview
        }
    }

    async function handleSaveChanges() {
        if (isSaving) return; // Prevent multiple clicks

        isSaving = true;
        const token = getJwtToken();
        const userId = getUserId();

        if (newProfilePicture) {
            try {
                const uploadUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/useruploadfoto/${userId}`;
                const formData = new FormData();
                formData.append('foto', newProfilePicture);

                const uploadResponse = await fetch(uploadUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (!uploadResponse.ok) {
                    throw new Error('Failed to upload profile picture');
                }

                console.log('Profile picture uploaded successfully');
            } catch (error) {
                console.error('Error uploading profile picture:', error);
                isSaving = false;
                return;
            }
        }

        const updatedData = {
            nama_user: name,
            username: username,
            email: email,
            no_telpon: phoneNumber,
            tanggal_lahir: dateOfBirth,
            alamat: address,
            jenis_kelamin: gender === 'Female' ? 'P' : 'L',
        };

        try {
            const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/users/update/${userId}`;
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                console.log('Profile updated successfully');
                goto('/profile');  // Navigate to profile page after successful update
            } else {
                console.error('Failed to update profile:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            isSaving = false; // Reset loading state
        }
    }
</script>

<div class="page-wrapper">
    <div class="back-button-wrapper">
        <ButtonBack />
    </div>
    <section class="edit-profile-section">
        <h1>Edit Profile</h1>
        <form on:submit|preventDefault={handleSaveChanges}>
            <div class="form-content">
                <div class="profile-picture">
                    <img src={profilePicture} alt="Profile Picture" />
                    <button type="button" class="change-photo" on:click={handleChangePhoto}>Change Photo</button>
                    <input id="fileInput" type="file" accept="image/*" on:change={handleFileChange} style="display: none;" />
                </div>
                <div class="form-fields">
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" id="name" bind:value={name} placeholder="Name" required />
                    </div>
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" bind:value={username} placeholder="Username" required />
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" bind:value={email} placeholder="email@gmail.com" required />
                    </div>
                    <div class="form-group">
                        <label for="phoneNumber">Phone Number</label>
                        <input type="tel" id="phoneNumber" bind:value={phoneNumber} placeholder="Phone Number" required />
                    </div>
                    <div class="form-group">
                        <label for="dateOfBirth">Date of Birth</label>
                        <input type="date" id="dateOfBirth" bind:value={dateOfBirth} required />
                    </div>
                    <div class="form-group">
                        <label for="address">Address</label>
                        <input type="text" id="address" bind:value={address} placeholder="Address" required />
                    </div>
                    <div class="form-group">
                        <label for="gender">Gender</label>
                        <select id="gender" bind:value={gender} required>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <button type="submit" class="btn-primary" disabled={isSaving}>
                        {#if isSaving}
                            Saving...
                        {:else}
                            Save Changes
                        {/if}
                    </button>
                </div>
            </div>
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

    .edit-profile-section {
        background-color: #fff;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 900px;
    }

    h1 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        text-align: left;
        color: #333;
        font-weight: bold;
    }

    .form-content {
        display: flex;
        align-items: flex-start;
    }

    .profile-picture {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 2rem;
    }

    .profile-picture img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        margin-bottom: 1rem;
    }

    .change-photo {
        background-color: #FF9C41;
        color: white;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
    }

    .change-photo:hover {
        background-color: #e88b3a;
    }

    .form-fields {
        flex-grow: 1;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    label {
        margin-bottom: 0.5rem;
        font-size: 1rem;
        color: #555;
        text-align: left;
        font-weight: bold;
    }

    input,
    select {
        width: 100%;
        padding: 0.5rem;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
    }

    .btn-primary {
        width: 100%;
        padding: 0.3rem;
        font-size: 1rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
    }

    .btn-primary:hover {
        background-color: #0056b3;
    }
</style>
