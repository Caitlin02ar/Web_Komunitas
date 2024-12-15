<script>
    export let title = "Order Details (Question Field)";
    export let instruction = "";
    export let field1Label = "Field 1";
    export let field2Label = "Field 2";
    export let field3Label = "Field 3";
    export let field1Placeholder = "Field 1";
    export let field2Placeholder = "Field 2";
    export let field3Placeholder = "Field 3";
    export let isFieldsEmpty = false;

    // Bindable fields to capture user input
    export let field1 = "";
    export let field2 = "";
    export let field3 = "";

    export let showField1 = true;  // Menentukan apakah field1 ditampilkan
    export let showField2 = true;  // Menentukan apakah field2 ditampilkan
    export let showField3 = true;  // Menentukan apakah field3 ditampilkan
</script>

<div class="order-details-form">
    <h2>{title}</h2>

    {#if isFieldsEmpty}
        <p class="empty-message">There's no question field to register this event</p>
    {:else}
        <p class="instruction">{instruction}</p>
        <form>
            {#if showField1}
                <div class="form-group">
                    <label for="field1">{field1Label} <span class="required">*</span></label>
                    <input type="text" id="field1" placeholder={field1Placeholder} bind:value={field1} required />
                </div>
            {/if}

            {#if showField2}
                <div class="form-group">
                    <label for="field2">{field2Label} <span class="required">*</span></label>
                    <input type="text" id="field2" placeholder={field2Placeholder} bind:value={field2} required />
                </div>
            {/if}

            {#if showField3}
                <div class="form-group">
                    <label for="field3">{field3Label} <span class="required">*</span></label>
                    <input type="text" id="field3" placeholder={field3Placeholder} bind:value={field3} required />
                </div>
            {/if}
        </form>
    {/if}
</div>


<style>
    .order-details-form {
        background-color: #fff;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        width: 100%;
        margin-left: 0; /* Align to the left */
    }

    .order-details-form h2 {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .instruction {
        font-size: 0.95rem;
        color: #777;
        margin-bottom: 20px;
    }

    .form-group {
        margin-bottom: 15px;
    }

    .form-group label {
        display: block;
        font-weight: bold;
        margin-bottom: 5px;
        font-size: 0.9rem;
    }

    .form-group .required {
        color: red;
    }

    .form-group input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
    }

    .form-group input::placeholder {
        color: #bbb;
    }

    .empty-message {
        color: red;
        font-size: 1rem;
        text-align: center;
    }
</style>
