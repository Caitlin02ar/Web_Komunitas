<script lang="ts">
    // @ts-nocheck
    import Table from '$lib/component/Table.svelte'; // Assuming your table component path
    import Back from '$lib/component/ButtonBack.svelte'; // Importing Back component
    import { onMount } from 'svelte';
  
    let showGradePass = false;
    let minimumGrade = '';
    let columns = ['Participant Name', 'Nilai', 'Grade Status', 'Action'];
    let rows = [
      ['Aliyah', '70 pax', 'Lulus', ''],
    ];
    const actions = [
    { 
      text: 'Upload Certificate', 
    },
    { 
      text: 'Info Member', 
    },
    ]
    
    function handleGradePassChange(event) {
      showGradePass = event.target.value === 'yes';
    }
  
    function handleSetGrade() {
      // Logic to handle setting the minimum grade
      console.log('Minimum Grade:', minimumGrade);
    }
  
    // Dummy Data for pagination
    let currentPage = 1;
    let pageSize = 10;
  </script>
  
  <div class="container mx-auto p-4">
    <!-- Back button component -->
    <Back href="/" text="Back" />
  
    <h2 class="text-xl font-bold mb-4">Grading Members of Group Community</h2>
  
    <div class="grade-pass-form mb-4">
      <label class="block font-bold mb-2">Grade Pass Member</label>
      <p class="text-sm mb-2">
        You can add grade pass for member of Group Community
      </p>
  
      <div class="mb-4">
        <label>Do you need to add grade pass for grading member Group Community?</label>
        <div>
          <input
            type="radio"
            id="yes"
            name="gradePass"
            value="yes"
            on:change={handleGradePassChange}
          />
          <label for="yes">Yes</label>
  
          <input
            type="radio"
            id="no"
            name="gradePass"
            value="no"
            class="ml-4"
            on:change={handleGradePassChange}
          />
          <label for="no">No</label>
        </div>
      </div>
  
      {#if showGradePass}
        <div class="minimum-grade mb-4">
          <label for="minimumGrade" class="block font-bold mb-2">Minimum Grade</label>
          <input
            type="number"
            id="minimumGrade"
            bind:value={minimumGrade}
            class="border px-2 py-1 rounded w-full"
            placeholder="Enter minimum grade"
          />
          <button class="btn btn-primary mt-2" on:click={handleSetGrade}>Set</button>
        </div>
      {/if}
    </div>
  
    <!-- Table Section -->
    <Table {columns} {rows} {actions} {currentPage} {pageSize}>
      <div slot="buttons">
        <!-- You can add buttons here if needed -->
      </div>
    </Table>
  </div>
  
  <style>
    .btn {
      background-color: #3490dc;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
    }
  
    .btn-primary:hover {
      background-color: #2779bd;
    }
  
    .container {
      max-width: 1000px;
      margin: 0 auto;
      margin-left: -2px;
    }
  
    label {
      font-weight: bold;
    }
  
    input[type='radio'] {
      margin-right: 5px;
    }
  
    input[type='number'] {
      padding: 5px;
      width: 100px;
    }
  
    .back-btn {
      margin-bottom: 20px;
    }
  </style>
  