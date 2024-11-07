<script>
    //@ts-nocheck
    import TextInput from '$lib/component/TextInput.svelte';
    import TextareaInput from '$lib/component/TextareaInput.svelte';
    import RadioDescription from '$lib/component/RadioDescription.svelte';
    import cameraIcon from '$lib/images/camera.svg';
    import { getJwtToken, getUserId, extractIdFromUrl } from '$lib/js/utils';

    const communityNameId = parseInt(extractIdFromUrl(window.location.href), 10);
    const userId = getUserId();
    let anggotaKomunitasOwnerId = null;
    console.log("Userid", userId);

    let groupName = '';
    let groupDescription = '';
    let hasAdditionalQuestions = false;
    let hasPeriodTime = false;
    let selectedPrivacy = 'Public';

    let groupEvent = {
        field_pertanyaan_1: '',
        field_pertanyaan_2: '',
        field_pertanyaan_3: '',
        isOneDayEvent: true,
        eventStartDate: '',
        eventEndDate: '',
    };

    let selectedFile = cameraIcon;
    let fileData = null;

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

    // Pastikan userId didefinisikan dengan benar

    async function getAnggotaKomunitas() {
    try {
        const token = getJwtToken();
        const response = await fetch(`http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityNameId}/anggota?page=0&pageSize=0`, {
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

        // Log seluruh data yang diterima
        console.log('Data yang diterima:', data);

        // Log semua user_id untuk memeriksa apakah semuanya benar
        data.forEach(anggota => {
            console.log(`ID Anggota: ${anggota.id}, User ID: ${anggota.user_id}`);
        });

        // Coba lakukan pencarian
        const anggotaOwner = data.find(anggota => Number(anggota.user_id) === Number(userId));

        if (anggotaOwner) {
            console.log('Anggota Owner ditemukan:', anggotaOwner);
            anggotaKomunitasOwnerId = anggotaOwner.id;
            console.log('Anggota Komunitas Owner ID:', anggotaKomunitasOwnerId);
        } else {
            console.error(`Anggota with user_id ${userId} not found.`);
        }

        return data;

    } catch (error) {
        console.error('Error fetching anggota komunitas:', error);
        throw error;
    }
}

getAnggotaKomunitas(); // Panggil fungsi untuk mendapatkan anggotaKomunitasOwnerId berdasarkan user_id



    async function createGroupCommunity() {
    try {
        const startDateFormatted = formatDate(groupEvent.eventStartDate);
        const endDateFormatted = formatDate(groupEvent.eventEndDate);

        // Data non-file dikirim sebagai JSON
        const groupData = {
            nama_group_komunitas: groupName,
            deskripsi: groupDescription,
            status_privasi: selectedPrivacy,
            anggota_owner_id: anggotaKomunitasOwnerId,
            max_kapasitas_anggota: 30,
            komunitas_id: communityNameId,
            field_pertanyaan_1: groupEvent.field_pertanyaan_1,
            field_pertanyaan_2: groupEvent.field_pertanyaan_2,
            field_pertanyaan_3: groupEvent.field_pertanyaan_3,
            ada_periode: hasPeriodTime ? '1' : '0',
            start_date: startDateFormatted,
            end_date: endDateFormatted
        };

        // Mengirim data sebagai JSON
        const response = await fetch(`http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityNameId}/group`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getJwtToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(groupData) // kirim JSON
        });
        console.log("Data", groupData);

        const result = await response.json();
        if (result.status === 200) {
            alert('Group community created successfully!');
            
            const groupId = result.data.group.id;

            // Jika ada file yang dipilih, kirimkan file
            if (fileData) {
                const photoFormData = new FormData();
                photoFormData.append('foto', fileData); // pastikan fileData adalah tipe File atau Blob

                const photoResponse = await fetch(`http://leap.crossnet.co.id:3010/api/v1/users/komunitas/1/groupuploadfoto/${groupId}`, {
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
            console.error('Failed to create group community:', result.message);
            alert('Failed to create the group. Please try again.');
        }
    } catch (error) {
        console.error('Error creating group community:', error);
        alert('An error occurred while creating the group.');
    }
}

</script>

<div class="createeventcontainer">
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

    <div class="form-section">
        <h2>Group Community Period Time</h2>
        <label class="block mb-2 font-semibold">Do you have period time of Group Community?</label>
        <label>
            <input type="radio" name="periodTime" value="yes" bind:group={hasPeriodTime} /> Yes
        </label>
        <label>
            <input type="radio" name="periodTime" value="no" bind:group={hasPeriodTime} /> No
        </label>

        {#if hasPeriodTime}
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
        {/if}
    </div>

    <div class="form-section">
        <h2>Group Community Additional Question</h2>
        <label class="block mb-2 font-semibold">Do you need to add more fields/questions for event registration?</label>
        <label>
            <input type="radio" name="additionalQuestions" value="yes" bind:group={hasAdditionalQuestions} /> Yes
        </label>
        <label>
            <input type="radio" name="additionalQuestions" value="no" bind:group={hasAdditionalQuestions} /> No
        </label>

        {#if hasAdditionalQuestions}
        <div class="question-container">
            <TextInput label="Question 1" placeholder="Type your question" bind:value={groupEvent.field_pertanyaan_1} />
            <TextInput label="Question 2" placeholder="Type your question" bind:value={groupEvent.field_pertanyaan_2} />
            <TextInput label="Question 3" placeholder="Type your question" bind:value={groupEvent.field_pertanyaan_3} />
        </div>
        {/if}
    </div>

    <div class="button-container">
        <button on:click={createGroupCommunity} class="button save-button">Create</button>
        <button class="button cancel-button" on:click={() => console.log('Cancelled')}>Cancel</button>
    </div>
</div>
</div>
<style>
    .createeventcontainer{
        margin: 5px;
        font-family: Arial, sans-serif;
        display: flex;
        width: 840px;
    }
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

    /* Scrollable and responsive section */
    .bg-white {
        max-width: 100%;
        overflow-x: hidden;
        overflow-y: auto;
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

        .bg-white {
            padding: 10px;
        }
    }
</style>
