<script>
    export let label = '';
    export let placeholder = '';
    export let value = '';
    export let addonLeft = '';
    export let addonRight = '';
  </script>
  
  <div class="form-group">
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="block mb-2 font-semibold">{label}</label>
    <div class="flex">
      {#if addonLeft}
        <span class="addon">{addonLeft}</span>
      {/if}
      <input type="text" class="form-input w-full p-2 border rounded" bind:value placeholder={placeholder} />
      {#if addonRight}
        <span class="addon">{addonRight}</span>
      {/if}
    </div>
  </div>
  
  <style>
    .form-group {
      margin-bottom: 1rem;
    }
    .form-input {
      flex: 1;
      border: 1px solid #ccc;
      border-radius: 0.375rem;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
    }
    .flex {
      display: flex;
      align-items: center;
    }
    .addon {
      background-color: #f3f4f6;
      border: 1px solid #ccc;
      border-radius: 0.375rem;
      padding: 0.5rem;
      display: inline-flex;
      align-items: center;
    }
    .addon:first-child {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .addon:last-child {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    .form-input:first-child {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .form-input:last-child {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  </style>
  