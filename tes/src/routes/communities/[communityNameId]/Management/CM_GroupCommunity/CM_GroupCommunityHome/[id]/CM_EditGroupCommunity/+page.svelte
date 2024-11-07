<script>
    //@ts-nocheck
    import TextInput from '$lib/component/TextInput.svelte';
    import TextareaInput from '$lib/component/TextareaInput.svelte';
    import RadioDescription from '$lib/component/RadioDescription.svelte';
    import cameraIcon from '$lib/images/camera.svg';
    import { onMount } from 'svelte';
    import { getJwtToken, extractIdFromUrl } from '$lib/js/utils';
    
    // Extract communityNameId and groupId from the URL
    const communityNameId = parseInt(extractIdFromUrl(window.location.href), 10);
    const groupId = parseInt(window.location.href.split('/CM_GroupCommunityHome/')[1], 10);
    
    let groupName = '';
    let groupDescription = '';
    let selectedPrivacy = 'Public';
    let groupEvent = {
        field_pertanyaan_1: '',
        field_pertanyaan_2: '',
        field_pertanyaan_3: '',
        isOneDayEvent: true,
    };
    const startDateFormatted = formatDate(groupEvent.eventStartDate);
const endDateFormatted = formatDate(groupEvent.eventEndDate);

    let selectedFile = cameraIcon;
    let fileData = null;
    
    // Fetch the group community data from the API
    onMount(async () => {
        try {
            const response = await fetch(`http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityNameId}/group/${groupId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getJwtToken()}`,
                    'Content-Type': 'application/json',
                }
            });
            const result = await response.json();
            
            if (result.status === 200) {
                const groupData = result.data.GroupKomunitas;
                groupName = groupData.nama_group_komunitas;
                groupDescription = groupData.deskripsi;
                selectedPrivacy = groupData.status_privasi || 'Public';
                groupEvent.eventStartDate = groupData.start_date || '';
                groupEvent.eventEndDate = groupData.end_date || '';
                selectedFile = groupData.foto ? `${import.meta.env.VITE_API_BASE_URL}/getfoto?path=${groupData.foto}` : cameraIcon;
            } else {
                console.error('Error fetching group community data:', result.message);
            }
        } catch (error) {
            console.error('Error fetching group community:', error);
        }
    });
    
    // Handle file selection for image upload
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            fileData = file;
            selectedFile = URL.createObjectURL(file);
        }
    }
    
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

    
    // Function to update group community
    async function updateGroupCommunity() {
    try {
        const startDateFormatted = formatDate(groupEvent.eventStartDate);
        const endDateFormatted = formatDate(groupEvent.eventEndDate);

        // Creating the JSON object with the appropriate format
        const dataToSend = {
            nama_group_komunitas: groupName,
            deskripsi: groupDescription,
            status_privasi: selectedPrivacy,
            field_pertanyaan_1: groupEvent.field_pertanyaan_1,
            field_pertanyaan_2: groupEvent.field_pertanyaan_2,
            field_pertanyaan_3: groupEvent.field_pertanyaan_3,
            start_date: startDateFormatted,
            end_date: endDateFormatted,
        };

        console.log('Sending data to API:', dataToSend);

        // Sending a PUT request to update the group community
        const response = await fetch(`http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityNameId}/group/update/${groupId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getJwtToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend)
        });

        const result = await response.json();
        if (result.status === 200) {
            alert('Group community updated successfully!');

            // Handle file upload if a new file is selected
            if (fileData) {
                const photoFormData = new FormData();
                photoFormData.append('foto', fileData);

                const photoResponse = await fetch(`http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityNameId}/groupuploadfoto/${groupId}`, {
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
            console.error('Failed to update group community:', result.message);
            alert('Failed to update the group. Please try again.');
        }
    } catch (error) {
        console.error('Error updating group community:', error);
        alert('An error occurred while updating the group.');
    }
}
    </script>
    
    <!-- UI and form fields remain the same -->
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
    
        <!-- Group Community Form Fields -->
        <TextInput label="Group Community Name" placeholder="Type the name of the group" bind:value={groupName} />
        <TextareaInput label="Group Community Description" placeholder="Describe the group..." bind:value={groupDescription} />
    
        <!-- Privacy Selection -->
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
    
        <!-- Period Time Section -->
        <div class="form-section">
            <h2>Group Community Period Time</h2>
            <div class="date-input-container">
                <div class="form-group-date">
                    <label for="start-date">Group Community Start Date</label>
                    <input id="start-date" type="datetime-local" bind:value={groupEvent.eventStartDate} />
                </div>
                <div class="form-group-date">
                    <label for="end-date">Group Community End Date</label>
                    <input id="end-date" type="datetime-local" bind:value={groupEvent.eventEndDate} />
                </div>
            </div>
        </div>
    
        <!-- Additional Questions Section -->
        <div class="form-section">
            <h2>Group Community Additional Question</h2>
            <div class="question-container">
                <TextInput label="Question 1" placeholder="Type your question" bind:value={groupEvent.field_pertanyaan_1} />
                <TextInput label="Question 2" placeholder="Type your question" bind:value={groupEvent.field_pertanyaan_2} />
                <TextInput label="Question 3" placeholder="Type your question" bind:value={groupEvent.field_pertanyaan_3} />
            </div>
        </div>
    
        <!-- Save and Cancel Buttons -->
        <div class="button-container">
            <button on:click={updateGroupCommunity} class="button save-button">Update</button>
            <button class="button cancel-button" on:click={() => console.log('Cancelled')}>Cancel</button>
        </div>
    </div>
    

<style>
    .profile-picture-container {
        position: relative;
        width: 120px;
        height: 120px;
        cursor: pointer;
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
        opacity: 1;
        transition: opacity 0.3s, background-color 0.3s;
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
        transition: background-color 0.3s ease;
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

    .date-input-container {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .form-group-date {
        flex: 1;
    }

    .form-group-date input {
        width: 100%;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    .form-section {
        margin-bottom: 2rem;
    }

    .form-section h2 {
        font-size: 1.25rem;
        margin-bottom: 1rem;
        font-weight: bold;
    }

    .question-container {
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        margin-top: 1rem;
    }

    @media (max-width: 768px) {
        .date-input-container {
            flex-direction: column;
        }
        
        .form-group-date {
            margin-bottom: 1rem;
        }

        .button-container {
            flex-direction: column;
            width: 100%;
            gap: 10px;
        }

        .save-button, .cancel-button {
            width: 100%;
        }
    }
</style>
