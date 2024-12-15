<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    const dispatch = createEventDispatcher();
  
    function closeModal() {
      dispatch('close');
    }
  
    function confirmLeave() {
      dispatch('confirmLeave');
    }
  </script>
  
  <div class="modal">
    <div class="modal-content">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <span class="close-button" on:click={closeModal}></span>
      <h2>Leave Community</h2>
      <p>Are you sure to leave this community?</p>
      <center><button class="leave-button" on:click={confirmLeave}>Leave Community</button></center>
    </div>
  </div>
  
  <style>
    h2{
        font-weight: 700;
    }
    .modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 25%;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      padding: 20px;
      text-align: center;
    }
  
    .modal-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  
    .close-button {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 12px;
      height: 12px;
      background-image: url('/src/lib/images/silang.svg');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      cursor: pointer;
      border: none;
    }
  
    .leave-button {
      background-color: #FF0000;
      color: white;
      border: none;
      border-radius: 30px;
      padding: 4px 8px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s;
      width: 50%;
      font-weight: 700;
    }
  
    .leave-button:hover {
      background-color: #e60000;
    }
  </style>
  