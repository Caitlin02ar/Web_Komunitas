<script>
    export let label = '';
    export let placeholder = '';
    export let value = '';
  </script>
  
  <div class="form-group">
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="block mb-2 font-semibold">{label}</label>
    <textarea class="form-input w-full p-2 border rounded" bind:value placeholder={placeholder}></textarea>
  </div>
  
  <style>
    .form-group {
      margin-bottom: 1rem;
    }
    .form-input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 0.375rem;
    }
  </style>
  