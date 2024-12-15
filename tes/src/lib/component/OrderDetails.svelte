<script lang="ts">
    export let title = "Order Details";
    export let detailLinkText = "Details";
    export let eventName = "";
    export let eventCategory = "";
    export let bookingInfo = 0;
    export let selectedDate = "";
    export let selectedTime = "";
    export let feeRegistration = "Rp. 0";
    export let totalEventPayment = "Rp. 0";
    export let totalPayment = "Rp. 0";
    export let selectedDay = "";
    export let selectedDayEvent = "";
    export let selectedDateEvent = "";
    export let selectedTimeEvent = "";
    export let bookingInfoEvent = 0;
    export let selectedEndDate = "";
    export let selectedEndDay = "";
    export let selectedEndDaySession ="";
    export let selectedEndDateSession = "";


    console.log("Received eventName:", eventName); // Tambahkan log ini
    console.log("Received Booking info", bookingInfo);
    console.log("Received Selected Date", selectedDate);
    console.log("Received seleceted day event", selectedDayEvent);
    console.log("Received booking info event", bookingInfoEvent);
    
</script>

<div class="order-summary">
    <div class="order-header">
        <h3>{title}</h3>
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a href="#">{detailLinkText}</a>
    </div>

    <p class="event-name">{eventName} - {eventCategory  || "No event category"}</p>
    <p class="booking-info">
        {(bookingInfo) > 0
            ? `Booking for ${bookingInfo} day`
            : bookingInfoEvent > 0
            ? `Booking for ${bookingInfoEvent} day`
            : "Waktu tidak valid"}
    </p>
    
    
    <hr />
    <div class="selected-details">
        <div class="selected-info">
            <p class="label">Selected Date</p>
            <p>{selectedDay ||selectedDayEvent }, {selectedDate || selectedDateEvent} - {selectedEndDaySession || selectedEndDay}, {selectedEndDateSession || selectedEndDate}</p>
        </div>
        <div class="selected-info">
            <p class="label">Selected Time</p>
            <!-- <p>{selectedTime ? `${selectedTime} WIB` : (selectedTimeEvent || <span></span>"No Time Selected")}</p> -->
            <p>
            {#if selectedTime}
                {selectedTime} WIB
            {:else}
                {#if selectedTimeEvent}
                {selectedTimeEvent}
                {:else}
                <em>No Time Selected</em>
                {/if}
            {/if}
            </p>
        </div>
    </div>
    <hr />
    <div class="payment-info">
        <div class="payment-row">
            <p>Fee Registration</p>
            <p>{feeRegistration}</p>
        </div>
        <div class="payment-row">
            <p>Total Event Payment</p>
            <p>{totalEventPayment || "Rp. 0"}</p>
        </div>
        <hr />
        <div class="payment-row total">
            <p>Total Payment</p>
            <p>{totalPayment}</p>
        </div>
    </div>
</div>

<style>
    .order-summary {
        background-color: #F9F5EC;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        width: 100%;
        font-family: Arial, sans-serif;
    }

    em {
        font-weight: 600;
        color: red;
    }

    .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .order-header h3 {
        margin: 0;
        font-size: 1.2rem;
        font-weight: bold;
    }

    .order-header a {
        font-size: 0.85rem;
        color: #007bff;
        text-decoration: none;
    }

    .order-header a:hover {
        text-decoration: underline;
    }

    .event-name {
        font-weight: bold;
        font-size: 1rem;
        margin-bottom: 5px;
    }

    .booking-info {
        font-size: 0.9rem;
        color: #777;
        margin-bottom: 10px;
    }

    hr {
        border: 0;
        border-top: 1px solid #ddd;
        margin: 10px 0;
    }

    .selected-details {
        display: flex;
        justify-content: space-between;
    }

    .selected-info {
        font-size: 0.9rem;
    }

    .label {
        font-weight: bold;
        color: #555;
    }

    .payment-info {
        font-size: 0.9rem;
    }

    .payment-row {
        display: flex;
        justify-content: space-between;
        margin: 5px 0;
    }

    .payment-row.total {
        font-weight: bold;
        margin-top: 10px;
    }
</style>
