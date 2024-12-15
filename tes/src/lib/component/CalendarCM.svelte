<script lang="ts">
    //@ts-nocheck
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import Modal from './Modal.svelte';
    import editIcon from '$lib/images/edit.svg';
    import deleteIcon from '$lib/images/delete.svg';
    import deleteModalIcon from '$lib/images/deleteO-merah.svg';
    import { getJwtToken, extractIdFromUrl } from '$lib/js/utils';

    let communityNameId = extractIdFromUrl(window.location.href);
    export let events = [];
    export let schedules = [];
    export let groups = [];
    export let subgroups = {};
    export let groupSchedule = [];
    let currentMonth = writable(new Date());
    let selectedDate = writable(new Date());
    let showCreateModal = false;
    let showEditModal = false;
    let showDeleteModal = false;
    let editEventData = null;
    let deleteEventData = null;

    let groupOptions = [
        { group: 'LEAP 2024', subgroups: ['UI/UX', 'Backend'] },
        { group: 'LEAP 2025', subgroups: ['Frontend', 'Data Science'] },
    ];
    let selectedGroups = [];
    let selectedSubgroups = [];
    let openGroup = false;
    let openSubgroup = false;
    let selectedTags = [];
    let selectedSubTags = [];

    const daysOfWeek = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];


    let eventName = writable('');
    let eventDescription = writable('');
    let eventStartDate = writable('');
    let eventEndDate = writable('');

// Function to create an event and save it for each selected group
async function createEventAPI(eventData) {
    try {
        const token = getJwtToken();
        // console.log("Event data", eventData);
        // Loop through selectedGroups and create an event for each group
        for (const groupId of selectedGroups) {
            const apiUrl = `http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityNameId}/group/${groupId}/schedule`;

            // Send POST request with event data
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData), // Send the event data as JSON
            });

            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`Error for group ${groupId}: ${response.statusText}`);
            }

            // Parse the response (assuming the backend sends a response in JSON format)
            const data = await response.json();

            // Handle success (log data, update UI, etc.)
            console.log(`Event created for group ${groupId}:`, data);

            // Optionally update local state (for example, if you want to show the newly created event)
            events.push(data); // Assuming 'events' is your store that holds the list of events
        }

        // Close the modal after all groups are processed
        showCreateModal = false;
    } catch (error) {
        // Handle errors
        console.error('Error creating event:', error);
        alert('Failed to create event. Please try again.');
    }
}

// Menangani pengiriman data dari form
async function handleSaveEvent() {
    const eventData = {
        nama_schedule: $eventName,
        deskripsi: $eventDescription,
        tgl_mulai: $eventStartDate,
        tgl_selesai: $eventEndDate,
    };

    // Mengirim data ke API untuk setiap grup yang dipilih
    await createEventAPI(eventData);
}

    function getDaysInMonth(date) {
        const month = date.getMonth();
        const year = date.getFullYear();
        return new Date(year, month + 1, 0).getDate();
    }

    function getStartDayOfWeek(date) {
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        return (start.getDay() + 6) % 7;
    }

    function prevMonth() {
        currentMonth.update(date => new Date(date.getFullYear(), date.getMonth() - 1, 1));
    }

    function nextMonth() {
        currentMonth.update(date => new Date(date.getFullYear(), date.getMonth() + 1, 1));
    }

    function selectDate(date) {
        selectedDate.set(date);
    }

    function hasEvent(date) {
        return events.some(event => new Date(event.date).toDateString() === date.toDateString());
    }

    function isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    function getEventsForMonth(date) {
    const month = date.getMonth();
    const year = date.getFullYear();
    
    const monthEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });
    
    const monthSchedules = schedules.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate.getMonth() === month && scheduleDate.getFullYear() === year;
    });

    const monthGroupSchedules = groupSchedule.filter(groupSchedule => {
        const groupDate = new Date(groupSchedule.tgl_mulai);
        return groupDate.getMonth() === month && groupDate.getFullYear() === year;
    });
    const combinedEvents = [...monthEvents, ...monthSchedules, ...monthGroupSchedules];
    console.log("Combined Events for Month:", combinedEvents);
    return combinedEvents;
    }

    let daysInMonth;
    let startDay;
    let eventsForMonth = [];
    console.log("Event for Month", eventsForMonth)
    $: {
        daysInMonth = getDaysInMonth($currentMonth);
        startDay = getStartDayOfWeek($currentMonth);
        eventsForMonth = getEventsForMonth($currentMonth);
    }

    function createEvent() {
        showCreateModal = true;
    }
    $: allEvents = [...events, ...schedules];
    function editEvent(event) {

            editEventData = event;
            showEditModal = true;
        }

    function openDeleteModal(event) {
        deleteEventData = event;
        showDeleteModal = true;
    }

    function confirmDeleteEvent() {
        events = events.filter(e => e !== deleteEventData);
        showDeleteModal = false;
        deleteEventData = null;
    }

    function toggleGroup(group) {
        const index = selectedGroups.indexOf(group.id);
        if (index > -1) {
            selectedGroups = selectedGroups.filter(g => g !== group.id);
            selectedTags = selectedTags.filter(tag => tag !== group.name);
            selectedSubgroups = selectedSubgroups.filter(subgroup =>
                !subgroups[group.id]?.some(sg => sg.id === subgroup)
            );
        } else {
            selectedGroups = [...selectedGroups, group.id];
            selectedTags.push(group.name);
        }
        updateSelectedTags();
    }

    onMount(() => {
    const storedGroups = localStorage.getItem('selectedGroups');
    if (storedGroups) {
        selectedGroups = JSON.parse(storedGroups);
    }
});

    function toggleSubgroup(subgroup, groupId) {
        const index = selectedSubgroups.indexOf(subgroup.id);
        if (index > -1) {
            selectedSubgroups = selectedSubgroups.filter(sg => sg !== subgroup.id);
            selectedSubTags = selectedSubTags.filter(tag => tag !== subgroup.name);
        } else {
            selectedSubgroups = [...selectedSubgroups, subgroup.id];
            selectedSubTags.push(subgroup.name);
        }
        updateSelectedTags();
    }

    function updateSelectedTags() {
        selectedTags = groups.filter(g => selectedGroups.includes(g.id)).map(g => g.name);
        selectedSubTags = Object.values(subgroups).flat().filter(sg => selectedSubgroups.includes(sg.id)).map(sg => sg.name);
    }

    function removeTag(tag) {
        const group = groups.find(g => g.name === tag);
        const subgroup = Object.values(subgroups).flat().find(sg => sg.name === tag);
        if (group) {
            selectedGroups = selectedGroups.filter(g => g !== group.id);
            selectedTags = selectedTags.filter(t => t !== tag);
            selectedSubgroups = selectedSubgroups.filter(subgroup =>
                !subgroups[group.id]?.some(sg => sg.id === subgroup)
            );
            selectedSubTags = selectedSubTags.filter(subtag =>
                !subgroups[group.id]?.some(sg => sg.name === subtag)
            );
        } else if (subgroup) {
            selectedSubgroups = selectedSubgroups.filter(sg => sg !== subgroup.id);
            selectedSubTags = selectedSubTags.filter(subtag => subtag !== tag);
        }
    }

    onMount(() => {
        selectDate(new Date());
    });
</script>

<div class="calendar-container">
    <div class="calendar">
        <div class="header">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <span class="arrow" on:click={prevMonth}>&#8249;</span>
            <h2>
                {$currentMonth.toLocaleDateString('en-US', { month: 'long' })} 
                <span class="year">{$currentMonth.getFullYear()}</span>
            </h2>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <span class="arrow" on:click={nextMonth}>&#8250;</span>
        </div>
        <div class="days-of-week">
            {#each daysOfWeek as day}
                <div>{day}</div>
            {/each}
        </div>
        <div class="days">
            {#each Array(startDay) as _, i}
                <div class="day empty"></div>
            {/each}
            {#each Array(daysInMonth) as _, i}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div 
                    class="day 
                        {isToday(new Date($currentMonth.getFullYear(), $currentMonth.getMonth(), i + 1)) ? 'today' : ''} 
                        {hasEvent(new Date($currentMonth.getFullYear(), $currentMonth.getMonth(), i + 1)) ? 'event' : ''} 
                        {new Date($currentMonth.getFullYear(), $currentMonth.getMonth(), i + 1).toDateString() === $selectedDate.toDateString() ? 'selected' : ''}" 
                    on:click={() => selectDate(new Date($currentMonth.getFullYear(), $currentMonth.getMonth(), i + 1))}>
                    {i + 1}
                </div>
            {/each}
        </div>
    </div>

    <div class="events-container">
        <div class="events-list">
            <h3>Events & Schedules</h3>
            {#each eventsForMonth as event}
                <div class="event">
                    <div class="event-date">{new Date(event.date || event.dateEvent).getDate()}</div>
                    <div class="event-details">
                        <div class="event-title">{event.title || event.nama_schedule}</div>
                        <div class="event-time">{event.time || 
                            (new Date(event.tgl_mulai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })) + 
                            ' - ' + 
                            (new Date(event.tgl_selesai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB')}</div>
                    </div>
                    <div class="event-actions">
                        <button class="edit-button" on:click={() => editEvent(event)}>
                            <img src={editIcon} alt="Edit" />
                        </button>
                        <button class="delete-button" on:click={() => openDeleteModal(event)}>
                            <img src={deleteIcon} alt="Delete" />
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    <div class="create-button-container">
        <button class="create-button" on:click={createEvent}>Create</button>
    </div>
</div>
</div>

<Modal show={showCreateModal} title="Create Group Community Event" onClose={() => (showCreateModal = false)}>
    <form>
        <div class="form-group">
            <div class="form-input">
                <label for="group-community-event" id="label">Group Community Event Name</label>
                <input type="text" id="group-community-event" bind:value={$eventName}>
            </div>

            <div class="from-group">
                <div class="form-input">
                    <label for="group-community-description">Group Community Description</label>
                    <input type="text" id="group-community-description" bind:value={$eventDescription}>
                </div>
            </div>

            <div class="group-date">
                <div class="form-input">
                    <label for="start-date" id="label">Event Start Date</label>
                    <input id="start-date" type="datetime-local" bind:value={$eventStartDate}/>
                </div>

                <div class="form-input">
                    <label for="end-date" id="label">Event End Date</label>
                    <input id="end-date" type="datetime-local" bind:value={$eventEndDate}/>
                </div>
            </div>

            <div class="dropdown-form">
                <div class="input-dropdown">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Choose group community to join this event</label>
                    <div class="selected-tags">
                        {#each selectedTags as tag}
                            <div class="tag">
                                {tag}
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <span class="remove-tag" on:click={() => removeTag(tag)}>✖</span>
                            </div>
                        {/each}
                    </div>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div class="dropdown {openGroup ? 'open' : ''}">
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div class="dropdown-button" on:click={() => (openGroup = !openGroup)}>
                            <p>Choose group community</p>
                        </div>
                        <div class="dropdown-content">
                            {#each groups as group}
                                <div class="checkbox-container">
                                    <input 
                                        type="checkbox" 
                                        id={group.name} 
                                        checked={selectedGroups.includes(group.id)} 
                                        on:change={() => toggleGroup(group)} />
                                    <label for={group.name}>{group.name}</label>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
                <div class="input-dropdown">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Choose subgroup community to join this event</label>
                    <div class="selected-tags">
                        {#each selectedSubTags as tag}
                            <div class="tag">
                                {tag}
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <span class="remove-tag" on:click={() => removeTag(tag)}>✖</span>
                            </div>
                        {/each}
                    </div>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div class="dropdown {openSubgroup ? 'open' : ''}">
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div class="dropdown-button" on:click={() => (openSubgroup = !openSubgroup)}>
                            <p>Choose subgroup community</p>
                        </div>
                        <div class="dropdown-content">
                            {#if selectedGroups.length === 0}
                                <div class="warning-message">Please, choose the group first</div>
                            {:else}
                                {#each selectedGroups as groupId}
                                    <div class="group-name">
                                        <strong>{groups.find(g => g.id === groupId)?.name}</strong>
                                    </div>
                                    {#each subgroups[groupId] as subgroup}
                                        <div class="checkbox-container">
                                            <input
                                                type="checkbox"
                                                id={subgroup.name}
                                                on:change={() => toggleSubgroup(subgroup, groupId)}
                                                checked={selectedSubgroups.includes(subgroup.id)}
                                            />
                                            <label for={subgroup.name}>{subgroup.name}</label>
                                        </div>
                                    {/each}
                                {/each}
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        <div class="btn-save">
            <button type="button" on:click={handleSaveEvent}>Save</button>
        </div>
    </form>
</Modal>

<Modal show={showEditModal} title="Edit Group Community Event" onClose={() => (showEditModal = false)}>
    <form>
        <div class="form-group">
            <div class="form-input">
                <label for="group-community-event" id="label">Group Community Event Name</label>
                <input type="text" id="group-community-event">
            </div>

            <div class="group-date">
                <div class="form-input">
                    <label for="start-date" id="label">Event Start Date</label>
                    <input id="start-date" type="datetime-local" />
                </div>

                <div class="form-input">
                    <label for="end-date" id="label">Event End Date</label>
                    <input id="end-date" type="datetime-local" />
                </div>
            </div>

           
            <div class="dropdown-form">
                <div class="input-dropdown">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Choose group community to join this event</label>
                    <div class="selected-tags">
                        {#each selectedTags as tag}
                            <div class="tag">
                                {tag}
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <span class="remove-tag" on:click={() => removeTag(tag)}>✖</span>
                            </div>
                        {/each}
                    </div>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div class="dropdown {openGroup ? 'open' : ''}">
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div class="dropdown-button" on:click={() => (openGroup = !openGroup)}>
                            <p>Choose group community</p>
                        </div>
                        <div class="dropdown-content">
                            {#each groups as group}
                                <div class="checkbox-container">
                                    <input 
                                        type="checkbox" 
                                        id={group.name} 
                                        checked={selectedGroups.includes(group.id)} 
                                        on:change={() => toggleGroup(group)} />
                                    <label for={group.name}>{group.name}</label>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
                <div class="input-dropdown">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Choose subgroup community to join this event</label>
                    <div class="selected-tags">
                        {#each selectedSubTags as tag}
                            <div class="tag">
                                {tag}
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <span class="remove-tag" on:click={() => removeTag(tag)}>✖</span>
                            </div>
                        {/each}
                    </div>
                    <div class="dropdown {openSubgroup ? 'open' : ''}">
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <div class="dropdown-button" on:click={() => (openSubgroup = !openSubgroup)}>
                            <p>Choose subgroup community</p>
                        </div>
                        <div class="dropdown-content">
                            {#if selectedGroups.length === 0}
                                <div class="warning-message">Please, choose the group first</div>
                            {:else}
                                {#each selectedGroups as groupId}
                                    <div class="group-name">
                                        <strong>{groups.find(g => g.id === groupId)?.name}</strong>
                                    </div>
                                    {#each subgroups[groupId] as subgroup}
                                        <div class="checkbox-container">
                                            <input
                                                type="checkbox"
                                                id={subgroup.name}
                                                on:change={() => toggleSubgroup(subgroup, groupId)}
                                                checked={selectedSubgroups.includes(subgroup.id)}
                                            />
                                            <label for={subgroup.name}>{subgroup.name}</label>
                                        </div>
                                    {/each}
                                {/each}
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        <div class="btn-save">
            <button>Save</button>
        </div>
    </form>
</Modal>

<Modal show={showDeleteModal} title="Delete Event" onClose={() => (showDeleteModal = false)}>
    <div class="delete-modal-content">
        <div class="icon-container">
            <img src={deleteModalIcon} alt="Delete Icon" class="delete-icon">
        </div>
        <h2 class="delete-title">Delete Event</h2>
        <p class="delete-description">Are you sure you want to delete this event?</p>
        <p class="delete-warning">*This action cannot be undone</p>
        <div class="modal-actions">
            <button class="cancel-btn" on:click={() => (showDeleteModal = false)}>Cancel</button>
            <button class="delete-btn" on:click={confirmDeleteEvent}>Yes, delete</button>
        </div>
    </div>
</Modal>

<style>
    .calendar-container {
        display: flex;
        gap: 32px;
        align-items: flex-start;
    }

    .calendar {
        flex: 1;
        border: 1px solid #ddd;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        background-color: white;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }

    .header h2 {
        font-size: 1.25rem;
        font-weight: bold;
    }

    .header .year {
        font-weight: normal;
    }

    .arrow {
        cursor: pointer;
        font-size: 1.5rem;
    }

    .days-of-week {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        justify-items: center;
        margin-top: 8px;
        font-size: 0.75rem;
        color: #555;
    }

    .days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        justify-items: center;
        gap: 4px;
        margin-top: 8px;
    }

    .day {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        position: relative;
        font-size: 0.875rem;
    }

    .day.today {
        border: 2px solid #000;
    }

    .day.event {
        background-color: #7AB2B2;
        color: white;
    }

    .day.selected {
        background-color: #007bff;
        color: white;
    }

    .day.empty {
        visibility: hidden;
    }

    .events-container {
        display: flex;
        flex-direction: column;
        flex: 1;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        background-color: white;
        height: 500px;
    }

    .events-list {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 12px 12px 0 0;
        margin-bottom: 0;
    }

    .event {
        padding: 8px;
        background-color: #7AB2B2;
        border-radius: 8px;
        margin-bottom: 8px;
        color: white;
        display: flex;
        justify-content: space-between;
    }

    .event .event-date {
        font-weight: bold;
    }

    .event .event-details {
        font-size: 0.9rem;
        text-align: right;
    }

    .events-list h3 {
        margin-bottom: 16px;
    }

    .create-button-container {
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 0 0 12px 12px;
        background-color: white;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .create-button {
        padding: 8px 16px;
        background-color: #AAD0D8;
        color: white;
        border: none;
        border-radius: 45px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: bold;
        text-align: center;
    }

    .create-button:hover {
        background-color: #56A3B2;
    }

    .form-group {
        width: 100%;
    }

    .form-input {
      display: flex;
      flex-direction: column;
    }
    .group-date{
      display: flex;
      gap: 12px;
    }

    .group-date .form-input {
      width: 50%;
      display: flex;
      justify-content: space-between;
    }

    .form-group input {
        /* width: 100%; */
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 14px;
    }

    .dropdown {
        margin-top: 4px;
        position: relative;
        width: 100%;
        display: inline-block;
    }

    .dropdown-button {
        background-color: #fff;
        border: 1px solid #ccc;
        padding: 8px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        border-radius: 4px;
        font-size: 14px;
    }

    .dropdown-content {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background-color: #fff;
        border: 1px solid #ccc;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 1;
        border-radius: 4px;
        display: none;
        margin-top: 4px;
    }

    .dropdown.open .dropdown-content {
        display: block;
    }

    #label {
        font-weight: 600;
        margin-top: 4px;
        margin-bottom: 4px;
    }
    

    .checkbox-container {
      display: flex;
      gap: 4px;
      align-items: center;
      margin-left: 4px;
      padding: 4px;
    }

    .warning-message {
    color: red;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    justify-content: center;
    font-style: italic;
    margin-top: 4px;
    margin-bottom: 4px;
    }

    .selected-tags {
        display: flex;
        gap: 4px;
    }
    .tag {
        border: 1px solid #ccc;
        border-radius: 6px;
        margin-top: 4px;
        width: fit-content;
        padding: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
    }
    
    .tag span{
        margin-right: 4px;
        cursor: pointer;
    }
    .tag:hover{
        background-color: #007bff;
        color: white;
    } 

    .form-group {
        flex-grow: 1;
        overflow-y: auto;
        padding-bottom: 8px; /* Jarak dengan tombol */
    }

    .btn-save {
        display: flex;
        justify-content: center;
        margin-top:4px;
        padding: 8px;
        background-color: #007bff;
        border-radius:6px;
        position: sticky;
        bottom: 0;
        color:white;
    }

    .btn-save:hover{
        background-color:#006BDF;
    }

    .event-actions {
      display: flex;
      gap: 8px;
      align-items: center;
  }

  .edit-button, .delete-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
  }

  .edit-button {
      background-color: #28a745; /* Green background */
  }

  .delete-button {
      background-color: #dc3545; /* Red background */
  }

  .edit-button img, .delete-button img {
      width: 16px;
      height: 16px;
      filter: brightness(0) invert(1); /* Make icon white */
  }

  .edit-button:hover {
      background-color: #218838;
  }

  .delete-button:hover {
      background-color: #c82333;
  }

  .delete-modal-content {
  text-align: center;
  padding: 20px;
}

.icon-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.delete-icon {
  width: 60px;
  height: 60px;
}

.delete-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.delete-description {
  font-size: 1rem;
  margin-bottom: 8px;
}

.delete-warning {
  color: red;
  font-style: italic;
  margin-bottom: 16px;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.cancel-btn {
  background-color: #BDBDBD;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.delete-btn {
  background-color: white;
  color: red;
  border: 2px solid red;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #FFEEEE;
}

.cancel-btn:hover {
  background-color: #A0A0A0;
}
</style>
