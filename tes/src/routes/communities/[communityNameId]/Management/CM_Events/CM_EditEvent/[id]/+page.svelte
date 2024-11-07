<script>
    // @ts-nocheck
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import DateInput from '$lib/component/DateInput.svelte';
    import TextInput from '$lib/component/TextInput.svelte';
    import TextareaInput from '$lib/component/TextareaInput.svelte';
    import InputWithAddon from '$lib/component/InputWithAddon.svelte';
    import RadioDescription from '$lib/component/RadioDescription.svelte';
    import PopupRadio from '$lib/component/PopupRadio.svelte';
    import RadioGroup from '$lib/component/RadioGroup.svelte';
    import ButtonBack from '$lib/component/ButtonBack.svelte';
    import successIcon from '$lib/images/success-icon.svg';
    import posterIcon from '$lib/images/image-plus.svg';
    import cameraIcon from '$lib/images/camera.svg';
    import { getJwtToken } from '$lib/js/utils';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation'; // For navigation

    let eventId = $page.params.id; // Get event ID from the route parameters
    let communityNameId = $page.params.communityNameId; // Get communityNameId from the route parameters
    const token = getJwtToken();

    const event = writable({
        name: '',
        description: '',
        participantQuota: '',
        registerStartDate: '',
        registerEndDate: '',
        eventStartDate: '',
        eventEndDate: '',
        location: '',
        registrationFee: '',
        field_pertanyaan_1: '',
        field_pertanyaan_2: '',
        field_pertanyaan_3: '',
        terms: '',
        isOneDayRegistration: true,
        isOneDayEvent: true
    });

    let poster = null;
    let previewPoster = posterIcon;

    $: disabledRegisterEnd = $event.isOneDayRegistration;
    $: disabledEventEnd = $event.isOneDayEvent;

    let selectedEventStatus = 'OnGoing';
    let selectedPrivacy = 'public';
    let ifAdaEventCategory = '0';

    const eventStatusOptions = [
        { value: 'OnGoing', label: 'On Going' },
        { value: 'End', label: 'End' },
        { value: 'Registration', label: 'Registration' }
    ];

    // Variables for success modal
    let showSuccess = false;
    let successMessage = '';

    // Fetch Event Data (GET)
    async function fetchEventData() {
        try {
            const response = await fetch(`http://leap.crossnet.co.id:3010/api/v1/users/komunitas/1/event/${eventId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.status === 200) {
                event.set({
                    name: data.data.nama_event,
                    description: data.data.deskripsi,
                    participantQuota: data.data.total_kuota,
                    registerStartDate: new Date(data.data.tgl_mulai_pendaftaran).toISOString().slice(0, 16),
                    registerEndDate: new Date(data.data.tgl_selesai_pendaftaran).toISOString().slice(0, 16),
                    eventStartDate: new Date(data.data.tgl_mulai_kegiatan).toISOString().slice(0, 16),
                    eventEndDate: new Date(data.data.tgl_selesai_kegiatan).toISOString().slice(0, 16),
                    location: data.data.lokasi_event,
                    registrationFee: data.data.biaya,
                    field_pertanyaan_1: data.data.field_pertanyaan_1,
                    field_pertanyaan_2: data.data.field_pertanyaan_2,
                    field_pertanyaan_3: data.data.field_pertanyaan_3,
                    terms: data.data.termcondition,
                    isOneDayRegistration: data.data.tgl_mulai_pendaftaran === data.data.tgl_selesai_pendaftaran,
                    isOneDayEvent: data.data.tgl_mulai_kegiatan === data.data.tgl_selesai_kegiatan
                });

                // Set the following values based on the API response
                selectedEventStatus = data.data.status; // Set event status
                selectedPrivacy = data.data.if_public === '1' ? 'public' : 'private'; // Set privacy status
                ifAdaEventCategory = data.data.if_ada_event_category; // Set event category

                // Fetch poster image
                previewPoster = `http://leap.crossnet.co.id:3010/getfoto?path=${data.data.foto}`;
            }
        } catch (error) {
            console.error('Error fetching event data:', error);
        }
    }

    onMount(() => {
        fetchEventData(); // Fetch event data on component mount
    });

    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            poster = file;
            previewPoster = URL.createObjectURL(file);
        }
    }

    let eventValue;
    event.subscribe(value => {
        eventValue = value;
    });

    // Update Event (PUT)
    async function updateEvent() {
        try {
            const ifPublic = selectedPrivacy === 'public' ? '1' : '0';

            const eventData = {
                nama_event: eventValue.name,
                deskripsi: eventValue.description,
                tgl_mulai_pendaftaran: eventValue.registerStartDate,
                tgl_selesai_pendaftaran: eventValue.registerEndDate,
                tgl_mulai_kegiatan: eventValue.eventStartDate,
                tgl_selesai_kegiatan: eventValue.eventEndDate,
                if_public: ifPublic,
                status: selectedEventStatus,
                lokasi_event: eventValue.location,
                total_kuota: Number(eventValue.participantQuota),
                sisa_kuota: Number(eventValue.participantQuota),
                biaya: Number(eventValue.registrationFee),
                if_ada_event_category: ifAdaEventCategory,
                field_pertanyaan_1: eventValue.field_pertanyaan_1,
                field_pertanyaan_2: eventValue.field_pertanyaan_2,
                field_pertanyaan_3: eventValue.field_pertanyaan_3,
                termcondition: eventValue.terms
            };

            const eventResponse = await fetch(`http://leap.crossnet.co.id:3010/api/v1/users/komunitas/1/event/update/${eventId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            });

            const eventResult = await eventResponse.json();
            if (eventResult.status === 200) {
                showSuccessModal("Successfully Edit Event Information");

                // Poster upload
                if (poster) {
                    const posterFormData = new FormData();
                    posterFormData.append('foto', poster);

                    const posterResponse = await fetch(`http://leap.crossnet.co.id:3010/api/v1/users/komunitas/1/eventuploadfoto/${eventId}`, {
                        method: 'POST',
                        body: posterFormData,
                        headers: {
                            'Authorization': `Bearer ${token}`
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
                console.error('Failed to update event:', eventResult.message);
            }
        } catch (error) {
            console.error('Error updating event:', error);
        }
    }

    // Function to show success modal and redirect
    function showSuccessModal(message) {
        successMessage = message;
        showSuccess = true;
        setTimeout(() => {
            showSuccess = false;
            goto(`/communities/${communityNameId}/Management/CM_Events`);
        }, 3000); // Close the modal and navigate after 3 seconds
    }
</script>

<!-- Success Modal Component -->
{#if showSuccess}
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
            <div class="flex justify-center mb-4">
                <img src={successIcon} alt="Success" width="50" height="50" />
            </div>
            <div class="text-center">
                <p class="text-lg font-semibold">{successMessage}</p>
            </div>
        </div>
    </div>
{/if}

<!-- UI for Edit Event remains similar to Create Event -->
<ButtonBack href={`/communities/${communityNameId}/Management/CM_Events`} text="Back" />
<div class="bg-white shadow-md rounded-lg p-8">
    <h1 class="text-2xl font-bold mb-4 text-left">Edit Event</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
            <TextInput label="Event Name" placeholder="Type your event name" bind:value={$event.name} />
            <TextareaInput label="Event Description" placeholder="Type your event description..." bind:value={$event.description} />
            <div class="form-group">
                <label class="block mb-2 font-semibold">Event Registration Date</label>
                <select bind:value={$event.isOneDayRegistration} class="form-select w-full p-2 border rounded">
                    <option value={true}>One day registration date</option>
                    <option value={false}>More than one day registration date</option>
                </select>
            </div>
            <DateInput startLabel="Start Date" endLabel="End Date" bind:startDateValue={$event.registerStartDate} bind:endDateValue={$event.registerEndDate} disabledEnd={disabledRegisterEnd} />
            <div class="form-group">
                <label class="block mb-2 font-semibold">Event Date</label>
                <select bind:value={$event.isOneDayEvent} class="form-select w-full p-2 border rounded">
                    <option value={true}>One day event date</option>
                    <option value={false}>More than one day event date</option>
                </select>
                <DateInput startLabel="Start Date" endLabel="End Date" bind:startDateValue={$event.eventStartDate} bind:endDateValue={$event.eventEndDate} disabledEnd={disabledEventEnd} />
            </div>
            <div class="form-group">
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
            <TextareaInput label="Terms and Conditions" placeholder="Type your terms and conditions" bind:value={$event.terms} />
            <!-- Poster Upload -->
            <div class="form-group">
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
                <label class="block mb-2 font-semibold">Event Category</label>
                <RadioDescription 
                    svgPath="/src/lib/images/multiCategory.svg" 
                    label="More than one category" 
                    description="For events with multiple event categories (e.g., VIP, Regular)." 
                    name="miltiEventCategory" 
                    value="1" 
                    bind:selectedValue={ifAdaEventCategory} 
                />
                <RadioDescription 
                    svgPath="/src/lib/images/noCategory.svg" 
                    label="No Event Category" 
                    description="For events with a single ticket type" 
                    name="noEventCategory" 
                    value="0" 
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
        <button on:click={updateEvent} class="save-button">Save</button>
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
