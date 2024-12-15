<script>
  import { createEventDispatcher } from 'svelte';

  /**
	 * @type {string | any[]}
	 */
   export let polls = [];
  export let submitButtonColor = '#94C0C0';
  export let submitButtonHoverColor = '#639696';
  let currentPollIndex = 0;
  /**
	 * @type {null}
	 */
  let selectedOption = null;

  // Create event dispatcher
  const dispatch = createEventDispatcher();

  // Function to go to the previous poll
  function previousPoll() {
    if (currentPollIndex > 0) {
      currentPollIndex--;
    }
  }

  // Function to go to the next poll
  function nextPoll() {
    if (currentPollIndex < polls.length - 1) {
      currentPollIndex++;
    }
  }

  // Function to handle voting
  function submitVote() {
    if (selectedOption) {
      // Dispatch the 'submitVote' event to parent with the selected option
      dispatch('submitVote', {
        selectedOption,
        pollId: polls[currentPollIndex].id
      });
    }
  }

  // Calculate the percentage of votes for each option
  /**
	 * @param {number} votes
	 * @param {number} totalVotes
	 */
  function getVotePercentage(votes, totalVotes) {
    return totalVotes === 0 ? 0 : (votes / totalVotes) * 100;
  }
</script>

<div class="carousel-container">
  <button class="arrow left" on:click={previousPoll} disabled={currentPollIndex === 0}>❮</button>
  <div class="poll-container">
    <h3>{polls[currentPollIndex].question}</h3>
    <hr />

    {#if !polls[currentPollIndex].hasVoted}
      <div class="options">
        {#each polls[currentPollIndex].options as option}
          <label class="poll-option">
            <input
              type="radio"
              name="poll"
              value={option.id}
              on:change={() => selectedOption = option.id}
            />
            {option.text}
          </label>
        {/each}
        <button
          class="submit-btn"
          style="background-color: {submitButtonColor};"
          on:click={submitVote}
          disabled={selectedOption === null}
          on:mouseenter={() => submitButtonColor = submitButtonHoverColor}
          on:mouseleave={() => submitButtonColor = '#94C0C0'}
        >
          Submit your vote
        </button>
      </div>
    {:else}
      <div class="results">
        <h4>Poll Results:</h4>
        {#each polls[currentPollIndex].options as option}
          <div class="result">
            <div class="result-label">
              {option.text}: {option.votes} votes ({Math.round(getVotePercentage(option.votes, polls[currentPollIndex].options.reduce((/** @type {any} */ total, /** @type {{ votes: any; }} */ opt) => total + opt.votes, 0)))}%)
            </div>
            <div class="progress-bar">
              <div
                class="progress"
                style="width: {getVotePercentage(option.votes, polls[currentPollIndex].options.reduce((/** @type {any} */ total, /** @type {{ votes: any; }} */ opt) => total + opt.votes, 0))}%"
              ></div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
  <button class="arrow right" on:click={nextPoll} disabled={currentPollIndex === polls.length - 1}>❯</button>
</div>

<style>
  .carousel-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 2px solid #ddd;
    border-radius: 8px;
    padding: 10px;
  }

  .poll-container {
    width: 100%;
    padding: 16px;
    background-color: #f9f9f9;
    text-align: left;
  }

  h3 {
    margin-bottom: 10px;
    text-align: left;
    font-weight: 600;
  }

  hr {
    border: none;
    border-top: 1px solid #ccc;
    margin-bottom: 20px;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .poll-option {
    background-color: white;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    transition: box-shadow 0.3s ease;
    font-weight: 600;
  }

  .poll-option:hover {
    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3);
  }

  .submit-btn {
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    color: #234249;
    cursor: pointer;
    margin-top: 15px;
    display: inline-block;
    font-weight: 600;
    transition: background-color 0.3s;
  }

  .submit-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .arrow {
    background-color: #8f8f8f;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .arrow:hover{
    background-color: #6e6e6e;
  }

  .arrow:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  .arrow:focus{
    outline: none;
  }
  

  .progress-bar {
    width: 100%;
    background-color: #eee;
    border-radius: 4px;
    height: 10px;
    margin-top: 5px;
  }

  .progress {
    background-color: #007bff;
    height: 100%;
    border-radius: 4px;
  }

  .result-label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    font-weight: 600;
  }
</style>
