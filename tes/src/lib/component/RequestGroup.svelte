<script lang="ts">
  export let showModal = false;
  export let onClose:any;
  export let onSubmit:any;

  // Placeholder for the question answers
  let question1 = '';
  let question2 = '';
  let question3 = '';

  function handleSubmit() {
    onSubmit({ question1, question2, question3 });
    onClose(); // Close the modal after submission
  }
</script>

{#if showModal}
  <div class="modal-backdrop">
    <div class="modal">
      <div class="modal-header">
        <h2>Request to Join the Community</h2>
        <button class="close-btn" on:click={onClose}>×</button>
      </div>
      <p>If you want to enter the Group Community, request to join first</p>
      <div class="modal-body">
        <div class="question-field">
          <label for="question1">Question 1</label>
          <input type="text" id="question1" bind:value={question1} placeholder="Answer question 1" />
        </div>
        <div class="question-field">
          <label for="question2">Question 2</label>
          <input type="text" id="question2" bind:value={question2} placeholder="Answer question 2" />
        </div>
        <div class="question-field">
          <label for="question3">Question 3</label>
          <input type="text" id="question3" bind:value={question3} placeholder="Answer question 3" />
        </div>
      </div>
      <div class="modal-footer">
        <button class="submit-btn" on:click={handleSubmit}>Submit</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    background: white;
    border-radius: 8px;
    padding: 20px;
    max-width: 400px;
    width: 100%;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }

  .modal-body {
    margin-top: 20px;
  }

  .question-field {
    margin-bottom: 15px;
  }

  .question-field label {
    font-size: 0.9rem;
    display: block;
    margin-bottom: 5px;
  }

  .question-field input {
    width: 100%;
    padding: 8px;
    font-size: 1rem;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
  }

  .submit-btn {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .submit-btn:hover {
    background-color: #0056b3;
  }
</style>
