<script>
  // @ts-nocheck
  import { goto } from '$app/navigation';

  export let question = '';
  export let options = [];
  export let votes = []; // Array for the number of votes for each option
  export let onEdit = () => {}; // Function to edit the poll
  export let onDelete = () => {}; // Function to delete the poll
  export let onEndPoll = () => {}; // Function to end the poll
  export let pollId = ''; // Poll ID for routing
  import arrow_icon from '$lib/images/panah-biru.svg';
  import edit from '$lib/images/edit.svg';
  import delete_icon from '$lib/images/delete.svg'
  // export let communityNameId = ''; // Community Name ID for routing

  // Calculate total votes
  $: totalVotes = votes.reduce((a, b) => a + b, 0);

  // Calculate percentage for each option
  $: percentages = votes.map(vote => (totalVotes ? Math.round((vote / totalVotes) * 100) : 0));

  // Navigate to the poll detail view
  function onViewPoll() {
    goto(`${window.location.href}/${pollId}`);
  }
</script>

<div class="polling-container bg-white shadow-md rounded-lg p-4 mb-4 relative">
  <div class="flex justify-between items-center mb-2">
    <h2 class="text-lg font-bold">{question}</h2>
    <button class="view-poll flex items-center text-blue-500 font-semibold" on:click={onViewPoll}>
      <span>View Poll</span>
      <img src="{arrow_icon}" alt="View Poll" class="ml-2 w-4 h-4" />
    </button>
  </div>

  <!-- Add the horizontal line -->
  <hr class="border-t-2 border-gray-300 mb-4" />

  <ul>
    {#each options as option, index}
      <li class="option-item mb-4">
        <div class="flex justify-between items-center mb-1">
          <span>{option}</span>
          <span>{votes[index]} votes ({percentages[index]}%)</span>
        </div>
        <div class="vote-bar">
          <div class="vote-fill" style="width: {percentages[index]}%"></div>
        </div>
      </li>
    {/each}
  </ul>

  <div class="button-group flex space-x-2">
    <button class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 flex items-center" on:click={onEndPoll}>
      <span>End Poll</span>
    </button>
    <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center" on:click={onEdit}>
      <img src="{edit}" alt="Edit" class="w-4 h-4 mr-2" />
      <span>Edit</span>
    </button>
    <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center" on:click={onDelete}>
      <img src="{delete_icon}" alt="Delete" class="w-4 h-4 mr-2" />
      <span>Delete</span>
    </button>
  </div>
</div>

<style>
  .polling-container {
    max-width: 100%;
    width: 100%; 
    margin: 0 auto; 
    padding: 1rem;
    box-sizing: border-box;
    position: relative;
    padding-bottom: 4rem;
  }

  .option-item {
    text-align: left;
  }

  .vote-bar {
    height: 8px;
    background-color: #e0e0e0;
    border-radius: 4px;
  }

  .vote-fill {
    height: 100%;
    background-color: #3b82f6;
    border-radius: 4px;
  }

  .flex {
    display: flex;
  }

  .justify-between {
    justify-content: space-between;
  }

  .items-center {
    align-items: center;
  }

  .mb-1 {
    margin-bottom: 0.25rem;
  }

  .mb-4 {
    margin-bottom: 1rem;
  }

  .text-lg {
    font-size: 1.125rem;
  }

  .font-bold {
    font-weight: bold;
  }

  .view-poll {
    cursor: pointer;
  }

  .ml-2 {
    margin-left: 0.5rem;
  }

  .w-4 {
    width: 1rem;
  }

  .h-4 {
    height: 1rem;
  }

  .bg-gray-400 {
    background-color: #9ca3af;
  }

  .hover\:bg-gray-500:hover {
    background-color: #6b7280;
  }

  .bg-blue-500 {
    background-color: #3b82f6;
  }

  .hover\:bg-blue-700:hover {
    background-color: #006BDF;
  }

  .bg-red-500 {
    background-color: #ef4444;
  }

  .hover\:bg-red-700:hover {
    background-color: #c53030;
  }

  .button-group {
    position: absolute;
    bottom: 16px;
    right: 16px;
    margin-top: 0px;
  }

  .space-x-2 > :not(:first-child) {
    margin-left: 0.5rem;
  }

  .mr-2 {
    margin-right: 0.5rem;
  }

  .border-t-2 {
    border-top-width: 2px;
  }

  .border-gray-300 {
    border-color: #d1d5db;
  }
</style>
