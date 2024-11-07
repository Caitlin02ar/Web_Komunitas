<script>
    // @ts-nocheck
    import { onMount } from 'svelte';
        import TextInput from '$lib/component/TextInput.svelte';
        import TextareaInput from '$lib/component/TextareaInput.svelte';
        import RadioDescription from '$lib/component/RadioDescription.svelte';
        import cameraIcon from '$lib/images/camera.svg'; 
        import { getJwtToken, getUserId, extractIdFromUrl } from '$lib/js/utils';
        import { page } from '$app/stores'; // To access route params
    
        // Get groupId from route params
        const communityNameId = parseInt(extractIdFromUrl(window.location.href), 10);
        const userId = getUserId();
        let anggotaKomunitasOwnerId = null; // Initialize to null
    
        let groupName = '';
        let groupDescription = '';
        let selectedPrivacy = 'Public'; // Default privacy option
        let selectedFile = cameraIcon; // Default image for profile
        let fileData = null; // Placeholder for actual file data
    
        // Hardcoded values
        const maxCapacity = 100; // Max anggota subgroup
    
        let groupId = null;
        onMount(() => {
        const urlPath = window.location.pathname;
        const segments = urlPath.split('/');
        const groupIndex = segments.indexOf('CM_GroupCommunityHome') + 1;
        groupId = parseInt(segments[groupIndex], 10);
        console.log('Group ID:', groupId);
    });
        // Fetch the anggota komunitas owner ID
        async function getAnggotaKomunitas() {
            try {
                const token = getJwtToken();
                const response = await fetch(`http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityNameId}/group/${groupId}/anggota?page=0&pageSize=0`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
    
                if (!response.ok) {
                    throw new Error(`Error fetching anggota komunitas: ${response.status} ${response.statusText}`);
                }
    
                const responseData = await response.json();
                console.log('Anggota komunitas response:', responseData);
    
                const data = responseData.data;
    
                // Find the user matching the userId
                const anggotaOwner = data.find(anggota => Number(anggota.user_id) === Number(userId));
    
                if (anggotaOwner) {
                    console.log('Anggota Owner ditemukan:', anggotaOwner);
                    anggotaKomunitasOwnerId = anggotaOwner.id;
                    console.log('Anggota Komunitas Owner ID:', anggotaKomunitasOwnerId);
                } else {
                    console.error(`Anggota with user_id ${userId} not found.`);
                }
            } catch (error) {
                console.error('Error fetching anggota komunitas:', error);
                throw error;
            }
        }
    
        // Call the function to fetch anggotaKomunitasOwnerId when the component loads
        getAnggotaKomunitas();
    
        // Handle file selection (image upload)
        function handleFileSelect(event) {
            const file = event.target.files[0];
            if (file) {
                fileData = file;
                selectedFile = URL.createObjectURL(file); // Update the displayed image
            }
        }
    
        // Function to create the subgroup
        async function createGroupCommunity() {
            try {
                if (!anggotaKomunitasOwnerId) {
                    await getAnggotaKomunitas(); // Ensure the owner ID is fetched before creating the group
                }
    
                const token = getJwtToken(); // Get token for authorization
                const groupData = {
                    nama_subgroup_komunitas: groupName,
                    deskripsi: groupDescription,
                    status_privasi: selectedPrivacy,
                    anggota_group_owner_id: anggotaKomunitasOwnerId, // Owner ID
                    max_kapasitas_anggota: maxCapacity // Hardcoded to 100
                };
    
                // Log the JSON data before sending it
                console.log("Data being sent to API:", groupData);
    
                // Send API request to create the subgroup
                const response = await fetch(`http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityNameId}/group/${groupId}/subgroup`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(groupData), // Send JSON data
                });
    
                const result = await response.json();
    
                if (result.status === 200) {
                    alert('Subgroup created successfully!');
    
                    // Get the created group ID for photo upload
                    const subgroupId = result.data.subgroup.id;
    
                    // Step 2: Upload the photo if available
                    if (fileData) {
                        await uploadGroupPhoto(subgroupId);
                    }
                } else {
                    alert('Failed to create the group.');
                    console.error('Error:', result.message);
                }
            } catch (error) {
                console.error('Error creating subgroup:', error);
                alert('An error occurred while creating the group.');
            }
        }
    
        // Function to upload the group photo
        async function uploadGroupPhoto(subgroupId) {
            try {
                const token = getJwtToken(); // Get token for authorization
                const photoFormData = new FormData();
                photoFormData.append('foto', fileData);
    
                const photoResponse = await fetch(`http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityNameId}/group/${groupId}/subgroupuploadfoto/${subgroupId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: photoFormData,
                });
    
                const photoResult = await photoResponse.json();
    
                if (photoResult.status === 200) {
                    alert('Photo uploaded successfully!');
                } else {
                    console.error('Photo upload failed:', photoResult.message);
                    alert('Failed to upload the photo.');
                }
            } catch (error) {
                console.error('Error uploading photo:', error);
            }
        }
    </script>
    
    <!-- UI Layout -->
    <div class="bg-white shadow-md rounded-lg p-8">
        <div class="profile-picture-container">
            <label for="profile-upload">
                <img src={selectedFile} alt="Community Profile" class="profile-picture" />
                <div class="camera-icon-container">
                    <img src={cameraIcon} alt="Camera Icon" class="camera-icon" />
                </div>
            </label>
            <input type="file" id="profile-upload" class="hidden" accept="image/*" on:change={handleFileSelect} />
        </div>
    
        <TextInput label="Group Community Name" placeholder="Type the name of the group" bind:value={groupName} />
        <TextareaInput label="Group Community Description" placeholder="Describe the group..." bind:value={groupDescription} />
    
        <div class="form-group">
            <label class="block mb-2 font-semibold">Group Community Status Privacy</label>
            <RadioDescription 
                svgPath="/src/lib/images/public.svg" 
                label="Public" 
                description="Anyone can view and contribute" 
                name="privacy" 
                value="Public" 
                bind:selectedValue={selectedPrivacy} 
            />
            <RadioDescription 
                svgPath="/src/lib/images/private.svg" 
                label="Private" 
                description="Only approved users can view and contribute" 
                name="privacy" 
                value="Private" 
                bind:selectedValue={selectedPrivacy} 
            />
        </div>
    
        <div class="button-container">
            <button on:click={createGroupCommunity} class="button save-button">Create</button>
            <button class="button cancel-button" on:click={() => console.log('Cancelled')}>Cancel</button>
        </div>
    </div>
    
    <!-- Styling -->
    <style>
        .profile-picture-container {
            position: relative;
            width: 120px;
            height: 120px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto;
        }
    
        .profile-picture {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
        }
    
        .camera-icon-container {
            position: absolute;
            bottom: 10px;
            right: 10px;
            width: 35px;
            height: 35px;
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: background-color 0.3s;
        }
    
        .profile-picture-container:hover .camera-icon-container {
            background-color: rgba(0, 0, 0, 0.3);
        }
    
        .camera-icon {
            width: 20px;
            height: 20px;
        }
    
        .hidden {
            display: none;
        }
    
        .button-container {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 16px;
        }
    
        .button {
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            border: none;
            font-weight: 500;
            color: white;
        }
    
        .save-button {
            background-color: #56A3B2;
        }
    
        .save-button:hover {
            background-color: #3a7d8f;
    }

    .cancel-button {
        background-color: #ccc;
    }

    .cancel-button:hover {
        background-color: #a6a6a6;
    }
</style>
