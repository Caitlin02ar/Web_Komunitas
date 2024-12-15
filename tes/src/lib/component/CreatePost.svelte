<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  let postContent = '';

  function closeModal() {
    dispatch('close');
  }

  function handlePost() {
    if (postContent.trim()) {
      // Emit an event to the parent with the post content
      dispatch('submit', { content: postContent });
      closeModal(); // Close the modal after posting
    } else {
      alert("Post content cannot be empty!");
    }
  }

  function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      console.log('File selected:', files[0]);
    }
  }
</script>

<div class="modal">
  <div class="modal-content">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <span class="close-button" on:click={closeModal}></span>
    <textarea
      placeholder="Create your post"
      class="post-input"
      bind:value={postContent}  
    ></textarea>
    <div class="modal-footer">
      <div class="add-image">
        <input type="file" id="file-input" accept="image/*" style="display: none;" on:change={handleFileChange}/>
        <label for="file-input">
          <!-- Add icon or text here to indicate file upload -->
        </label>
      </div>
      <button class="reply-button" on:click={handlePost}>Post</button>
    </div>
  </div>
</div>

<style>
  .modal {
    position: fixed;
    bottom: 0;
    left: 250px; /* Sesuaikan dengan lebar sidebar Anda */
    width: calc(100% - 250px);
    background: white;
    box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    border-radius: 30px 30px 0 0;
    padding: 16px;
  }

  .modal-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .close-button {
    align-self: flex-end;
    width: 12px;
    height: 12px;
    padding-bottom: 2%;
    background-image: url('/src/lib/images/silang.svg');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
    border: none;
  }

  .post-input {
    width: 100%;
    height: 120px;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: none; 
    overflow-y: auto; 
  }

  .modal-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
  }

  .add-image {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
  }


  .reply-button {
    background-color: #FFA959;
    color: white;
    border: none;
    border-radius: 30px;
    padding: 4px 28px;
    font-size: 16px;
    cursor: pointer;
    align-self: flex-end;
  }

  .reply-button:hover {
    background-color: #FF9029;
  }
</style>
