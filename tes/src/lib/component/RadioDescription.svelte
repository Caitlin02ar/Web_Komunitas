<script>
    export let svgPath = '';
    export let label = '';
    export let description = '';
    export let name = '';
    export let value = '';
    export let selectedValue = '';
  
    // @ts-ignore
    function handleChange(event) {
      selectedValue = event.target.value;
    }
  </script>
  
  <div class="flex items-center justify-between mb-4">
    <div class="flex iQtems-center">
      <img src={svgPath} alt={label} class="w-8 h-8 mr-4" />
      <div>
        <div class="font-semibold">{label}</div>
        <div class="text-gray-600">{description}</div>
      </div>
    </div>
    <input type="radio" name={name} value={value} bind:group={selectedValue} class="form-radio" />
  </div>
  
  <style>
    .form-radio {
      margin-left: 0.5rem;
    }
  </style>
  