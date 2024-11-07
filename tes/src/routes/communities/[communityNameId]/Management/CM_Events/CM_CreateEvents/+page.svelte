<script>
    // @ts-nocheck
    import { writable } from 'svelte/store';
    import DateInput from '$lib/component/DateInput.svelte';
    import TextInput from '$lib/component/TextInput.svelte';
    import TextareaInput from '$lib/component/TextareaInput.svelte';
    import InputWithAddon from '$lib/component/InputWithAddon.svelte';
    import RadioDescription from '$lib/component/RadioDescription.svelte';
    import RadioGroup from '$lib/component/RadioGroup.svelte';
    import PopupRadio from '$lib/component/PopupRadio.svelte';
    import ButtonBack from '$lib/component/ButtonBack.svelte';
    import posterIcon from '$lib/images/image-plus.svg';
    import cameraIcon from '$lib/images/camera.svg';
    import { getJwtToken, getUserId, extractIdFromUrl } from '$lib/js/utils';
    
    let disabledRegisterEnd = false; // Deklarasi disabledRegisterEnd
    let disabledEventEnd = false; // Deklarasi disabledEventEnd
    
    const communityNameId = extractIdFromUrl(window.location.href);
    const userId = getUserId(); // Get the logged-in user ID
    
    const event = writable({
        name: '',
        description: '',
        participantQuota: '',
        registerStartDate: '',
        registerEndDate: '',
        eventStartDate: '',
        eventEndDate: '',
        startDate: '',
        location: '',
        registrationFee: '',
        field_pertanyaan_1: '', // Question 1 field
        field_pertanyaan_2: '', // Question 2 field
        field_pertanyaan_3: '', // Question 3 field
        terms: '',
        isOneDayRegistration: true,
        isOneDayEvent: true
    });
    
    let poster = null; // Variable to store the poster file
    let previewPoster = posterIcon; // Default icon preview
    let anggotaKomunitasOwnerId; // To store owner ID
    
    // Logic for event category
    let selectedEventStatus = 'OnGoing';
    let selectedPrivacy = 'public';
    let ifAdaEventCategory = '0'; // Default no category
    
    const eventStatusOptions = [
        { value: 'OnGoing', label: 'On Going' },
        { value: 'End', label: 'End' },
        { value: 'Registration', label: 'Registration' }
    ];
    
    // Fetch user data from the API to get anggota_komunitas_owner_id
    async function fetchCommunityMember() {
    try {
        const response = await fetch(`http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityNameId}/anggota?page=0&pageSize=0`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getJwtToken()}`
            }
        });
        const result = await response.json();
        
        // Debugging untuk melihat hasil
        console.log("User ID yang sedang login:", userId); // Menampilkan userId yang sedang login
        console.log("Data komunitas yang diterima dari API:", result.data); // Debug data API

        if (result.status === 200 && result.data.length > 0) {
            // Coba untuk mencari anggota komunitas dengan mencocokkan userId
            const member = result.data.find(m => Number(m.user_id) === Number(userId)); // Bandingkan dengan memastikan tipe data cocok
            
            // Logging hasil pencarian
            console.log("Anggota komunitas yang ditemukan:", member); 

            if (member) {
                anggotaKomunitasOwnerId = member.id; // Menyimpan ID anggota komunitas yang sesuai
                console.log("Anggota Komunitas Owner ID:", anggotaKomunitasOwnerId); // Debug ID anggota komunitas
            } else {
                console.error('User is not a member of the community'); // User tidak ditemukan di komunitas
            }   
        } else {
            console.error('Failed to fetch community members'); // Data tidak dapat diambil dari API
        }
    } catch (error) {
        console.error('Error fetching community member data:', error); // Error pada request
    }
}

    // Call the fetch function on mount
    fetchCommunityMember();
    
    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            poster = file;
            previewPoster = URL.createObjectURL(file); // Update the preview when a file is selected
        }
    }
    
    // Function to format dates
    function formatDateTime(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    
    // Function to format date only (YYYY-MM-DD)
    function formatDateOnly(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // Function to submit the event data
    let eventValue;
    
    event.subscribe(value => {
        eventValue = value;  // Store the current values from the event store
    });
    
    async function submitEvent() {
        try {
            if (!anggotaKomunitasOwnerId) {
                throw new Error('Cannot submit event without a valid owner ID');
            }
    
            const ifAdaEventCategory = eventValue.EventCategory && eventValue.EventCategory.length > 1 ? '1' : '0';
            const ifPublic = selectedPrivacy === 'public' ? '1' : '0';
    
            const tglMulaiPendaftaran = eventValue.registerStartDate ? formatDateTime(eventValue.registerStartDate) : null;
            const tglSelesaiPendaftaran = eventValue.registerEndDate ? formatDateTime(eventValue.registerEndDate) : null;
            const tglMulaiKegiatan = eventValue.eventStartDate ? formatDateTime(eventValue.eventStartDate) : null;
            const tglSelesaiKegiatan = eventValue.eventEndDate ? formatDateTime(eventValue.eventEndDate) : null;
    
            const eventData = {
                event: {
                    nama_event: eventValue.name,
                    deskripsi: eventValue.description,
                    tgl_mulai_pendaftaran: tglMulaiPendaftaran,
                    tgl_selesai_pendaftaran: tglSelesaiPendaftaran,
                    tgl_mulai_kegiatan: tglMulaiKegiatan,
                    tgl_selesai_kegiatan: tglSelesaiKegiatan,
                    if_public: ifPublic || '0',
                    status: selectedEventStatus,
                    lokasi_event: eventValue.location,
                    max_kapasitas_anggota: Number(eventValue.participantQuota),
                    sisa_kuota: Number(eventValue.participantQuota),
                    biaya: Number(eventValue.registrationFee),
                    if_ada_event_category: '0',
                    field_pertanyaan_1: eventValue.field_pertanyaan_1 || '',
                    field_pertanyaan_2: eventValue.field_pertanyaan_2 || '',
                    field_pertanyaan_3: eventValue.field_pertanyaan_3 || '',
                    termcondition: eventValue.terms,
                    total_kuota: 100,
                    komunitas_id: Number(communityNameId),
                    anggota_komunitas_owner_id: Number(anggotaKomunitasOwnerId) // Owner ID
                }
            };
    
            console.log("Data being sent to API:", eventData);
    
            const eventResponse = await fetch(`http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityNameId}/event`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getJwtToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            });
    
            const eventResult = await eventResponse.json();
            if (eventResult.status === 200) {
                alert('Event created successfully!');
                
                // Step 2: After the event is created, upload the poster
                const eventId = eventResult.data.event.id; // Get the created event ID
    
                // If poster exists, upload it
                if (poster) {
                    const posterFormData = new FormData();
                    posterFormData.append('foto', poster); // Append the poster file
    
                    console.log("Poster being uploaded:", poster);
    
                    const posterResponse = await fetch(`http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityNameId}/eventuploadfoto/${eventId}`, {
                        method: 'POST',
                        body: posterFormData,
                        headers: {
                            'Authorization': `Bearer ${getJwtToken()}`
                        }
                    });
    
                    const posterResult = await posterResponse.json();
                    if (posterResult.status === 200) {
                        alert('Poster uploaded successfully!');
                    } else {
                        console.error('Poster upload failed:', posterResult.message);
                    }
                }
            } else {
                console.error('Failed to create event:', eventResult.message);
            }
        } catch (error) {
            console.error('Error submitting event:', error);
        }
    }
    
    // Event categories
    const categories = [
        { title: 'VIP', quota: '20 participant', price: '2.000.000' },
        { title: 'Reguler', quota: '50 participant', price: '1.500.000' }
    ];
    
    // Function to handle cancel
    function handleCancel() {
        console.log("Cancel button clicked");
        // Logic to navigate away or reset the form
    }
    </script>
    
    <!-- HTML content for the form remains unchanged -->
    <ButtonBack href="/communities/[communityNameId]/Management/CM_Events" text="Back" />
    <div class="bg-white shadow-md rounded-lg p-8">
        <h1 class="text-2xl font-bold mb-4 text-left">Create Event</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <TextInput label="Event Name" placeholder="Type your event name" bind:value={$event.name} />
                <TextareaInput label="Event Description" placeholder="Type your event description..." bind:value={$event.description} />
                <div class="form-group">
                  <!-- svelte-ignore a11y-label-has-associated-control -->
                  <label class="block mb-2 font-semibold">Event Registration Date</label>
                  <select bind:value={$event.isOneDayRegistration} class="form-select w-full p-2 border rounded">
                    <option value={true}>One day registration date</option>
                    <option value={false}>More than one day registration date</option>
                  </select>
                </div>
                <DateInput startLabel="Start Date" endLabel="End Date" bind:startDateValue={$event.registerStartDate} bind:endDateValue={$event.registerEndDate} disabledEnd={disabledRegisterEnd} />
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="block mb-2 font-semibold">Event Date</label>
                    <select bind:value={$event.isOneDayEvent} class="form-select w-full p-2 border rounded">
                      <option value={true}>One day event date</option>
                      <option value={false}>More than one day event date</option>
                    </select>
                    <DateInput startLabel="Start Date" endLabel="End Date" bind:startDateValue={$event.eventStartDate} bind:endDateValue={$event.eventEndDate} disabledEnd={disabledEventEnd} />
                  </div>
                  <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="block mb-2 font-semibold">Event Status Privacy</label>
                    <RadioDescription 
                        svgPath="/src/lib/images/public.svg" 
                        label="Public" 
                        description="Anyone can view and contribute" 
                        name="public" 
                        value="public" 
                        bind:selectedValue={selectedPrivacy} 
                    />
                    <RadioDescription 
                        svgPath="/src/lib/images/private.svg" 
                        label="Private" 
                        description="Only approved users can view and contribute" 
                        name="private" 
                        value="private" 
                        bind:selectedValue={selectedPrivacy} 
                    />
                </div>
            </div>
            
            <div>
                <RadioGroup label="Event Status" name="eventStatus" options={eventStatusOptions} bind:selectedValue={selectedEventStatus} />
                <TextInput label="Event Location" placeholder="Type your event location" bind:value={$event.location} />
                <InputWithAddon label="Participant Quota" placeholder="Enter quota" addonRight="/pax" bind:value={$event.participantQuota} />
                <InputWithAddon label="Registration Fee" placeholder="Enter fee" addonLeft="Rp." bind:value={$event.registrationFee} />
    
                <!-- Poster Upload Section -->
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="block mb-2 font-semibold">Event Poster</label>
                    <div class="poster-container">
                        <label for="poster-upload" class="poster-preview {poster ? 'hover-enabled' : ''}">
                            <img src={previewPoster} alt="Event Poster" class="{poster ? 'poster-image' : 'icon-image'}" />
                            {#if poster}
                                <div class="camera-icon-container">
                                    <img src={cameraIcon} alt="Camera Icon" class="camera-icon" />
                                </div>
                            {/if}
                        </label>
                        <input type="file" id="poster-upload" accept="image/*" class="hidden" on:change={handleFileChange} />
                    </div>
                </div>
    
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="block mb-2 font-semibold">Event Category</label>
                    <RadioDescription 
                        svgPath="/src/lib/images/multiCategory.svg" 
                        label="More than one category" 
                        description="For events with multiple event categories (e.g., VIP, Regular)." 
                        name="miltiEventCategory" 
                        value="miltiEventCategory" 
                        bind:selectedValue={ifAdaEventCategory} 
                    />
                    <RadioDescription 
                        svgPath="/src/lib/images/noCategory.svg" 
                        label="No Event Category" 
                        description="For events with a single ticket type" 
                        name="noEventCategory" 
                        value="noEventCategory" 
                        bind:selectedValue={ifAdaEventCategory} 
                    />
                </div>
            </div>
        </div>
    
        <div class="mt-8">
            <TextareaInput label="Terms and Conditions" placeholder="Type your terms and conditions" bind:value={$event.terms} class="w-full" />
            <PopupRadio>
                <TextInput label="Question 1" placeholder="Type your question" bind:value={$event.field_pertanyaan_1} />
                <TextInput label="Question 2" placeholder="Type your question" bind:value={$event.field_pertanyaan_2} />
                <TextInput label="Question 3" placeholder="Type your question" bind:value={$event.field_pertanyaan_3} />
            </PopupRadio>
        </div>
        <div class="button-container">
            <button on:click={submitEvent} class="save-button">Save</button>
        </div>
        
    </div>
    
<style>
    .poster-container {
        position: relative;
        width: 160px;
        height: 200px;
        border: 2px dashed #cccccc;
        transition: border-color 0.3s ease;
        background-color: #f9f9f9;
        margin-bottom: 16px;
    }

    .poster-container:hover {
        border: 2px dashed #FFA959;
        background-color: rgb(242, 242, 242);
    }

    .poster-preview {
        width: 100%;
        height: 100%;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .icon-image {
        width: 40px;
        height: 40px;
        opacity: 0.7;
    }

    .icon-image:hover {
        transform: scale(1.1);
    }

    .poster-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .camera-icon-container {
        position: absolute;
        bottom: 8px;
        right: 8px;
        width: 28px;
        height: 28px;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 1;
        transition: opacity 0.3s, background-color 0.3s, width 0.3s, height 0.3s, bottom 0.3s, right 0.3s;
        border-radius: 8px;
    }

    .poster-preview:hover .camera-icon-container {
        background-color: rgba(0, 0, 0, 0.3);
        width: 100%;
        height: 100%;
        bottom: 0;
        right: 0;
        border-radius: 0px;
    }

    .camera-icon {
        width: 16px;
        height: 16px;
    }

    .hidden {
        display: none;
    }

    .mt-8 {
        margin-top: 2rem;
    }

    .w-full {
        width: 100%;
    }

    .button-container {
    display: flex;
    justify-content: flex-end; /* Align the button to the right */
    margin-top: 16px; /* Add some spacing on top */
    }

    .save-button {
        background-color: #007bff;
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        border: none;
        font-weight: 500;
        transition: background-color 0.3s ease;
    }

    .save-button:hover {
        background-color: #0056b3;
    }
</style>