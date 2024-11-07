<script>
    //@ts-nocheck
    import TextInput from '$lib/component/TextInput.svelte';
    import TextareaInput from '$lib/component/TextareaInput.svelte';
    import InputWithAddon from '$lib/component/InputWithAddon.svelte';
    import ButtonBack from '$lib/component/ButtonBack.svelte';
    import { onMount } from 'svelte';
    import { getJwtToken, extractIdFromUrl } from '$lib/js/utils';

    let eventCategoryName = '';
    let eventCategoryDescription = '';
    let eventCategoryPrice = '';
    let eventCategoryQuota = '';
    let communityNameId, eventID;

    onMount(() => {
        const pathSegments = window.location.pathname.split('/');
        eventID = pathSegments[pathSegments.indexOf('CM_EventDetail') + 1];
        communityNameId = extractIdFromUrl(window.location.href);
        console.log(`Community ID: ${communityNameId}, Event ID: ${eventID}`);
    });

    async function handleSave() {
        const token = getJwtToken();
        if (!token) {
            console.error('Authentication token not found.');
            alert('Authentication token not found.');
            return;
        }

        const payload = {
            nama_event_category: eventCategoryName,
            deskripsi: eventCategoryDescription,
            price: parseInt(eventCategoryPrice, 10),
            kuota: parseInt(eventCategoryQuota, 10),
            event_id: parseInt(eventID)
        };

        console.log('Sending payload:', payload);

        const saveUrl = `http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityNameId}/event/${eventID}/eventcategory`;

        try {
            const response = await fetch(saveUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Save Successful:', result);
                // Redirect to the event category page after successful save
                window.location.href = `http://localhost:5173/communities/${communityNameId}/Management/CM_Events/CM_EventDetail/${eventID}/CM_EventCategory`;
            } else {
                console.error('Save Failed:', await response.text());
                alert('Failed to save event category. Please try again.');
            }
        } catch (error) {
            console.error('Network or other error:', error);
        }
    }

    function handleCancel() {
        // You can navigate back or reset the form as necessary
        window.history.back();
    }
</script>

<ButtonBack href="/communities/[communityNameId]/Management/CM_Events" text="Back" />

<div class="bg-white shadow-md rounded-lg p-8">
    <h1 class="text-2xl font-bold mb-4 text-left">Add Event Category</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
            <TextInput label="Event Category Name" placeholder="Type your event category name" bind:value={eventCategoryName} />
            <TextareaInput label="Event Category Description" placeholder="Type your event category description..." bind:value={eventCategoryDescription} />
            <InputWithAddon label="Event Category Price" placeholder="Type your event category price..." bind:value={eventCategoryPrice} addonLeft="Rp." />
            <InputWithAddon label="Event Category Quota" placeholder="Enter event category quota" bind:value={eventCategoryQuota} addonRight="pax" />
        </div>
    </div>
    <div class="button-group">
        <button class="cancel-button" on:click={handleCancel}>Cancel</button>
        <button class="save-button" on:click={handleSave}>Save</button>
    </div>
</div>

<style>
    .mb-4 {
        margin-bottom: 1rem;
    }
    .rounded-lg {
        border-radius: 0.5rem;
    }
    .button-group {
        display: flex;
        justify-content: end;
        gap: 1rem;
        margin-top: 2rem;
    }
    .cancel-button, .save-button {
        padding: 0.5rem 1.5rem;
        border-radius: 0.375rem;
        font-size: 1rem;
        cursor: pointer;
    }
    .cancel-button {
        background-color: gray;
        color: white;
        border: none;
    }
    .save-button {
        background-color: #007bff;
        color: white;
        border: none;
    }
</style>
