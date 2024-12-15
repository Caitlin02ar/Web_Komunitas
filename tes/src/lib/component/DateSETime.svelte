<script>
    export let dateLabel = "Session Date";
    export let startTimeLabel = "Session Start Time";
    export let endTimeLabel = "Session End Time";
    export let datePlaceholder = "Select date";
    export let startTimePlaceholder = "00:00";
    export let endTimePlaceholder = "00:00";
  
    export let dateValue = "";
    export let startTimeValue = "";
    export let endTimeValue = "";
</script>
  
<div class="session-container">
    <div class="input-group">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>{dateLabel}</label>
        <input type="date" bind:value={dateValue} placeholder={datePlaceholder} />
    </div>
  
    <div class="input-group">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>{startTimeLabel}</label>
        <input type="time" bind:value={startTimeValue} placeholder={startTimePlaceholder} />
    </div>
  
    <div class="input-group">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>{endTimeLabel}</label>
        <input type="time" bind:value={endTimeValue} placeholder={endTimePlaceholder} />
    </div>
</div>
  
<style>
    .session-container {
        display: flex;
        gap: 16px;
        align-items: center;
    }
  
    .input-group {
        display: flex;
        flex-direction: column;
    }
  
    label {
        font-weight: 600;
        margin-bottom: 4px;
    }
  
    input[type="date"],
    input[type="time"] {
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        width: 100%;
    }
</style>
