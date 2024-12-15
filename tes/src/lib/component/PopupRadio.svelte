<script>
  // @ts-nocheck
  export let question = "Do you need to add more fields/questions for event registration?";  // Default question
    let showInput = false;
  
    function handleRadioChange(event) {
      if (event.target.value === 'yes') {
        showInput = true;
      } else {
        showInput = false;
      }
    }
  </script>
  
  <div class="popup-radio">
    <p>{question}</p>
    <div class="radio-options">
      <label>
        <input type="radio" name="addFields" value="yes" on:change={handleRadioChange}>
        Yes
      </label>
      <label>
        <input type="radio" name="addFields" value="no" on:change={handleRadioChange}>
        No
      </label>
    </div>
    {#if showInput}
      <div class="input-container">
        <slot></slot> <!-- Slot for placing input fields -->
      </div>
    {/if}
  </div>
  
  <style>
    .popup-radio {
      margin-top: 1rem;
    }
  
    .radio-options {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
  
    .input-container {
      border: 1px solid #ccc;
      border-radius: 0.375rem;
      padding: 1rem;
    }
  </style>
  