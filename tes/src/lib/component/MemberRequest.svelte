<script>
  //@ts-nocheck
  export let name = '';
  export let username = '';
  export let photo = '';
  export let details = {}; 
  export let onAccept = () => {};
  export let onDeny = () => {};
  let showDetails = false;

  function toggleDetails() {
    showDetails = !showDetails;
  }
</script>

<div class="member-request-card">
  <div class="member-info">
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <img src={photo} alt="Profile Photo" class="member-photo" />
    <div class="member-details">
      <div class="member-name">{name}</div>
      <div class="member-username">@{username}</div>
    </div>
    <div class="action-buttons">
      <button class="accept-button" on:click={onAccept}>Accept</button>
      <button class="deny-button" on:click={onDeny}>Deny</button>
      <button class="details-button" on:click={toggleDetails}>
        Details
        <svg viewBox="6 5 12 12" class:rotated={showDetails} width="30" height="40">
          <path fill="none" stroke="currentColor" stroke-width="2" d="M6 9l6 6 6-6"></path>
        </svg>
      </button>
    </div>
  </div>

  {#if showDetails}
    <div class="details-content visible">
      <div><strong>Gender:</strong> {details.gender}</div>
      <div><strong>Phone:</strong> {details.phone}</div>
      <div><strong>Email:</strong> {details.email}</div>
      <div><strong>Birth Date:</strong> {details.birthDate}</div>
      <div><strong>Address:</strong> {details.address}</div>
    </div>
  {/if}
</div>

<style>
  .member-request-card {
    padding: 16px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background-color: white;
    margin-bottom: 12px;
  }

  .member-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .member-photo {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 16px;
  }

  .member-details {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;
  }

  .member-name {
    font-weight: bold;
    margin-bottom: 4px;
  }

  .member-username {
    color: #6b7280;
  }

  .action-buttons {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
  }

  .action-buttons button {
    height: 30px;
    width: 100px;
    padding: 0 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 500;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .action-buttons .accept-button {
    background-color: #007AFF;
    color: white;
  }

  .action-buttons .accept-button:hover {
    background-color: #154AC1;
  }

  .action-buttons .deny-button {
    background-color: #E5E7EB;
    color: black;
  }

  .action-buttons .deny-button:hover {
    background-color: #D1D5DB;
  }

  .action-buttons .details-button {
    background-color: white;
    color: #0091BF;
    border: 1px solid #0091BF;
    border-radius: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
  }

  .action-buttons .details-button:hover {
    background-color: #F3F4F6;
  }

  .details-button:focus {
    outline: none;
    box-shadow: none;
  }

  .details-content {
    display: flex;
    flex-direction: column;
    margin-top: 8px;
    border-top: 1px solid #e5e7eb;
    padding-top: 12px;
    text-align: left;
  }

  svg.rotated {
    transform: rotate(180deg);
  }

  svg {
    margin-left: 8px;
    transition: transform 0.3s ease;
    width: 24px;
    height: 24px;
  }
</style>
