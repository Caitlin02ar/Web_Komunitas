<script>
    export let numberOfDays = 1;

    /**
     * @type {Array<{ startDate: string, endDate: string }>}
     */
    let dates = [{ startDate: '', endDate: '' }];
    let tempNumberOfDays = numberOfDays;

    function applyNumberOfDays() {
        const newNumberOfDays = tempNumberOfDays;
        const currentNumberOfDays = dates.length;

        if (newNumberOfDays > currentNumberOfDays) {
            // Add new rows while preserving existing data
            for (let i = currentNumberOfDays; i < newNumberOfDays; i++) {
                dates = [...dates, { startDate: '', endDate: '' }];
            }
        } else if (newNumberOfDays < currentNumberOfDays) {
            // Remove rows from the end while preserving existing data
            dates = dates.slice(0, newNumberOfDays);
        }

        numberOfDays = newNumberOfDays;
    }
</script>

<div>
    <div class="flex items-center mb-4">
        <span>Number Of Days:</span>
        <input type="number" class="form-input1 mx-2" placeholder="____" bind:value={tempNumberOfDays} min="1" />
        <span>days</span>
        <button class="ok-button" on:click={applyNumberOfDays}>OK</button>
    </div>
    
    <!-- Container to allow scrolling -->
    <div class="dates-container">
        <div class="grid grid-cols-2 gap-4">
            {#each dates as date, index}
                <div>
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="block mb-2 ">Start Date</label>
                    <input type="datetime-local" class="form-input" bind:value={date.startDate}>
                </div>
                <div>
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="block mb-2 ">End Date</label>
                    <input type="datetime-local" class="form-input" bind:value={date.endDate}>
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    .form-input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 0.375rem;
    }
    .form-input1 {
        width: auto;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 0.375rem;
    }
    .ok-button {
        padding: 0.5rem 1rem;
        margin-left: 0.5rem;
        border: none;
        background-color: #4CAF50;
        color: white;
        border-radius: 0.375rem;
        cursor: pointer;
    }
    .ok-button:hover {
        background-color: #45a049;
    }
    .flex {
        display: flex;
        align-items: center;
    }
    .mx-2 {
        margin-left: 0.5rem;
        margin-right: 0.5rem;
    }
    /* New styles for scrollable container */
    .dates-container {
        max-height: 358px; /* You can adjust this height as needed */
        overflow-y: auto;
        border: 1px solid #ccc;
        padding: 10px;
        border-radius: 0.375rem;
    }
</style>
