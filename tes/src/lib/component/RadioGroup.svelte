<script lang="ts">
    export let label: string = '';
    export let name: string = '';
    export let options: { value: string; label: string }[] = [];
    export let selectedValue: string = '';
  
    function handleChange(event: Event) {
      const target = event.target as HTMLInputElement;
      selectedValue = target.value;
    }
  </script>
  
  <div class="form-group">
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="block mb-2 font-semibold">{label}</label>
    {#each options as option}
      <div class="flex items-center justify-between mb-2">
        <div class="">{option.label}</div>
        <input type="radio" name={name} value={option.value} bind:group={selectedValue} class="form-radio" on:change={handleChange} />
      </div>
    {/each}
  </div>
  
  <style>
    .form-group {
      margin-bottom: 1rem;
    }
    .form-radio {
      margin-left: 0.5rem;
    }
    .flex {
      display: flex;
      justify-content: space-between;
    }
  </style>
  