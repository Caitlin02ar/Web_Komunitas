<script>
    export let question = "";
    /**
	 * @type {any[]}
	 */
     export let options = [];
    /**
	 * @type {null}
	 */
    let selectedOption = null;
    let hasVoted = false;
  
    function submitVote() {
      if (selectedOption !== null) {
        options = options.map(option =>
          option.id === selectedOption ? { ...option, votes: option.votes + 1 } : option
        );
        hasVoted = true;
      }
    }
  
    /**
	 * @param {null} id
	 */
    function handleOptionChange(id) {
      selectedOption = id;
    }
  </script>
  
  <div class="poll-container">
    <h3>{question}</h3>
    {#if !hasVoted}
      <div class="options">
        {#each options as option}
          <label class="poll-option">
            <input
              type="radio"
              name="poll"
              value={option.id}
              on:change={() => handleOptionChange(option.id)}
            />
            {option.text}
          </label>
        {/each}
      </div>
      <button class="submit-btn" on:click={submitVote} disabled={selectedOption === null}>
        Submit your vote
      </button>
    {:else}
      <div class="results">
        <h4>Poll Results:</h4>
        {#each options as option}
          <div class="result">
            {option.text}: {option.votes} votes
          </div>
        {/each}
      </div>
    {/if}
  </div>
  
  