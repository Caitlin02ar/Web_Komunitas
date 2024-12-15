<script>
  // @ts-nocheck

  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  export let events = [];
  let currentMonth = writable(new Date());
  let selectedDate = writable(new Date());

  const daysOfWeek = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

  function getDaysInMonth(date) {
    const month = date.getMonth();
    const year = date.getFullYear();
    return new Date(year, month + 1, 0).getDate();
  }

  function getStartDayOfWeek(date) {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    return (start.getDay() + 6) % 7; // adjust for starting from Monday
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
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });
  }

  let daysInMonth;
  let startDay;
  let eventsForMonth = [];
  $: {
    daysInMonth = getDaysInMonth($currentMonth);
    startDay = getStartDayOfWeek($currentMonth);
    eventsForMonth = getEventsForMonth($currentMonth);
  }

  onMount(() => {
    selectDate(new Date());
  });

  function createEvent() {
    // Implement the logic to handle the creation of a new event
    console.log("Create event clicked");
  }
</script>

<div class="calendar-container">
  <div class="calendar">
    <div class="header">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <span class="arrow" on:click={prevMonth}>&#8249;</span> <!-- Left Arrow -->
      <h2>
        {$currentMonth.toLocaleDateString('en-US', { month: 'long' })} 
        <span class="year">{$currentMonth.getFullYear()}</span> <!-- Year styled separately -->
      </h2>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <span class="arrow" on:click={nextMonth}>&#8250;</span> <!-- Right Arrow -->
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

  <!-- Events for the selected month -->
  <div class="events-container">
    <div class="events-list">
      <h3>Events</h3>
      {#each eventsForMonth as event}
        <div class="event">
          <div class="event-date">{new Date(event.date).getDate()}</div>
          <div class="event-details">
            <div class="event-title">{event.title}</div>
            <div class="event-time">{event.time}</div>
          </div>
        </div>
      {/each}
    </div>
    <!-- Container for the Create button -->
    <div class="create-button-container">
      <button class="create-button" on:click={createEvent}>Create</button>
    </div>
  </div>
</div>

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
    border-radius: 12px; /* Border radius for the entire container */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background-color: white;
    height: 500px; /* Fixed height for the container */
  }

  .events-list {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    border: 1px solid #ddd;
    border-radius: 12px 12px 0 0; /* Border radius only at the top */
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

  /* Container for the Create button */
  .create-button-container {
    padding: 16px;
    border: 1px solid #ddd;
    border-radius: 0 0 12px 12px; /* Border radius only at the bottom */
    background-color: white;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  /* Styles for the Create button */
  .create-button {
    padding: 8px 16px;
    background-color: #AAD0D8; /* Color for the Create button */
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
</style>
