<script>
    //@ts-nocheck
    import TextInput from '$lib/component/TextInput.svelte';
    import TextareaInput from '$lib/component/TextareaInput.svelte';
    import RadioDescription from '$lib/component/RadioDescription.svelte';
    import cameraIcon from '$lib/images/camera.svg'; // Ensure this path is correct
    import { onMount } from 'svelte';
    import { getJwtToken } from '$lib/js/utils';

    const communityId = 1; // Static for now, you can change this dynamically based on the route
    const groupId = 1; // Static groupId, similar to communityId
    const subgroupId = 1; // Static subgroupId, modify as per URL

    let groupName = '';
    let groupDescription = '';
    let selectedPrivacy = 'public';
    let groupEvent = {
        field_pertanyaan_1: '',
        field_pertanyaan_2: '',
        field_pertanyaan_3: '',
        eventStartDate: '', 
        eventEndDate: '',
    };

    let selectedFile = cameraIcon; // Default image
    let fileData = null;

    // Fetch the subgroup data from the API
    onMount(async () => {
        try {
            const response = await fetch(`http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityId}/group/${groupId}/subgroup/${subgroupId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getJwtToken()}`,
                    'Content-Type': 'application/json',
                }
            });

            const result = await response.json();
            if (result.status === 200) {
                const subgroupData = result.data.SubGroup;
                groupName = subgroupData.nama_subgroup_komunitas || '';
                groupDescription = subgroupData.deskripsi || '';
                selectedPrivacy = subgroupData.status_privasi ? subgroupData.status_privasi.toLowerCase() : 'public';
                selectedFile = subgroupData.foto ? `http://leap.crossnet.co.id/${subgroupData.foto}` : cameraIcon;

                // Populate additional fields
                groupEvent.field_pertanyaan_1 = subgroupData.field_jawaban_1 || '';
                groupEvent.field_pertanyaan_2 = subgroupData.field_jawaban_2 || '';
                groupEvent.field_pertanyaan_3 = subgroupData.field_jawaban_3 || '';
            } else {
                console.error('Error fetching SubGroup data:', result.message);
            }
        } catch (error) {
            console.error('Error fetching SubGroup:', error);
        }
    });

    // Handle file selection for image upload
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            fileData = file;
            selectedFile = URL.createObjectURL(file); // Update the displayed image
        }
    }

    // Format date in 'YYYY:MM:DD HH:MM:SS' format
    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}:${month}:${day} ${hours}:${minutes}:${seconds}`;
    }

// Function to update the subgroup with the desired JSON format
async function updateSubGroupCommunity() {
    try {
        // Creating the JSON object with the appropriate format
        const dataToSend = {
            nama_subgroup_komunitas: groupName, // Maps to "nama_group_komunitas" in your example
            deskripsi: groupDescription,
            status_privasi: selectedPrivacy.charAt(0).toUpperCase() + selectedPrivacy.slice(1), // Ensure proper case (Public, Private, etc.)
        };

        // Send a PUT request to update the subgroup
        const response = await fetch(`http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityId}/group/${groupId}/subgroup/update/${subgroupId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getJwtToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend) // Send the JSON object in the body
        });

        const result = await response.json();
        if (result.status === 200) {
            alert('SubGroup community updated successfully!');

            // Handle file upload if a new file is selected
            if (fileData) {
                const photoFormData = new FormData();
                photoFormData.append('foto', fileData);

                const photoResponse = await fetch(`http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityId}/groupuploadfoto/${subgroupId}`, {
                    method: 'POST',
                    body: photoFormData,
                    headers: {
                        'Authorization': `Bearer ${getJwtToken()}`
                    }
                });

                const photoResult = await photoResponse.json();
                if (photoResult.status === 200) {
                    alert('Photo uploaded successfully!');
                } else {
                    console.error('Photo upload failed:', photoResult.message);
                    alert('Failed to upload the photo.');
                }
            }
        } else {
            console.error('Failed to update SubGroup community:', result.message);
            alert('Failed to update the SubGroup. Please try again.');
        }
    } catch (error) {
        console.error('Error updating SubGroup community:', error);
        alert('An error occurred while updating the SubGroup.');
    }
}


</script>

<!-- UI for the SubGroup Edit Form -->
<div class="bg-white shadow-md rounded-lg p-8">
    <!-- Profile Image Upload Section -->
    <div class="profile-picture-container">
        <label for="profile-upload">
            <img src={selectedFile} alt="Community Profile" class="profile-picture" />
            <div class="camera-icon-container">
                <img src={cameraIcon} alt="Camera Icon" class="camera-icon" />
            </div>
        </label>
        <input type="file" id="profile-upload" class="hidden" accept="image/*" on:change={handleFileSelect} />
    </div>

    <!-- SubGroup Form Fields -->
    <TextInput label="SubGroup Community Name" placeholder="Type the name of the SubGroup" bind:value={groupName} />
    <TextareaInput label="SubGroup Community Description" placeholder="Describe the SubGroup..." bind:value={groupDescription} />

    <!-- Privacy Selection -->
    <div class="form-group">
        <label class="block mb-2 font-semibold">SubGroup Community Status Privacy</label>
        <RadioDescription 
            svgPath="/src/lib/images/public.svg" 
            label="Public" 
            description="Anyone can view and contribute" 
            name="privacy" 
            value="public" 
            bind:selectedValue={selectedPrivacy} 
        />
        <RadioDescription 
            svgPath="/src/lib/images/private.svg" 
            label="Private" 
            description="Only approved users can view and contribute" 
            name="privacy" 
            value="private" 
            bind:selectedValue={selectedPrivacy} 
        />
    </div>

    <!-- Save and Cancel Buttons -->
    <div class="button-container">
        <button on:click={updateSubGroupCommunity} class="button save-button">Update</button>
        <button class="button cancel-button" on:click={() => console.log('Cancelled')}>Cancel</button>
    </div>
</div>

<style>
    /* Add the necessary styles */
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
        transition: background-color 0.3s ease;
        color: white;
    }

    .save-button {
        background-color: #56A3B2;
    }

    .cancel-button {
        background-color: #ccc;
    }
</style>
