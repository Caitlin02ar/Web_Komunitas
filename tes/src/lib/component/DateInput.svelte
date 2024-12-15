<script>
    export let startLabel = 'Start Date';
    export let endLabel = 'End Date';
    export let startDateValue = '';
    // export let startTimeValue = '';
    export let endDateValue = '';
    // export let endTimeValue = '';
    export let disabledEnd = false;

    /**
     * @param {string} str - The date string in the format YYYY-MM-DD
     * @returns {Date} - The Date object
     */
    function convertToDate(str) {
        const split = str.split('-');
        return new Date(+split[0], +split[1] - 1, +split[2]);
    }

    /**
     * @param {number|string} x - The number or string to pad
     * @param {number} len - The length to pad to
     * @returns {string} - The padded string
     */
    function pad(x, len) {
        x = String(x);
        while (x.length < len) x = `0${x}`;
        return x;
    }

    const tomorrow = new Date(Date.now() + 86400000);
    $: startDate = convertToDate(startDateValue);
    $: endDate = convertToDate(endDateValue);
</script>

<div class="form-group">
    <div class="grid grid-cols-2 gap-4">
        <div>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>{startLabel}</label>
            <div class="flex">
                <input type="datetime-local" class="form-input w-full p-2 border rounded" bind:value={startDateValue} />
                <!-- <input type="time" class="form-input time-input p-2 border rounded" bind:value={startTimeValue} /> -->
            </div>
        </div>
        <div>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>{endLabel}</label>
            <div class="flex">
                <input type="datetime-local" class="form-input w-full p-2 border rounded" bind:value={endDateValue} disabled={disabledEnd} />
                <!-- <input type="datetime-local" class="form-input time-input p-2 border rounded" bind:value={endTimeValue} disabled={disabledEnd} /> -->
            </div>
        </div>
    </div>
</div>

<style>
    .form-group {
        margin-bottom: 1rem;
    }
    .form-input {
        margin-top: 0.5rem;
    }
    .grid {
        display: grid;
    }
    .flex {
        display: flex;
        gap: 0.5rem;
    }
</style>
