<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import RadioDescription from '$lib/component/RadioDescription.svelte';
  import ModalSuccess from '$lib/component/ModalSuccess.svelte';
  import Modal from '$lib/component/Modal.svelte';
  import { getJwtToken, getUserId, extractIdFromUrl } from '$lib/js/utils';

  let selectedPrivacy = 'public';
  let communityNameId;
  let isLoading = false;
  let errorMessage = '';
  let showSuccessModal = false;
  let successMessage = ''; 
  let showInviteModal = false;
  let isRestrictPrivacy = false;
  let invitationUrl = '';
  let showCopyMessage = false;

  // Get community ID and user info
  function initAuth() {
    try {
      const token = getJwtToken();
      const userId = getUserId();
      communityNameId = extractIdFromUrl(window.location.href);
      console.log('JWT Token:', token);

      if (!token) {
        console.error('Authentication token not found.');
        return;
      }
    } catch (error) {
      console.error('Error retrieving authentication details:', error);
    }
  }

  // Fetch the current privacy settings on mount
  onMount(async () => {
    initAuth();
    await fetchCommunityPrivacy();
  });

  // Function to fetch the current community privacy status
  async function fetchCommunityPrivacy() {
    try {
      const token = getJwtToken();
      if (!token) {
        console.error('Authentication token not found.');
        return;
      }

      const response = await fetch(`http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityNameId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.status === 200) {
        selectedPrivacy = data.data.Komunitas.status_privasi.toLowerCase();
        isRestrictPrivacy = selectedPrivacy === 'restrict';
        if (isRestrictPrivacy) {
          invitationUrl = `http://yourdomain.com/join/${communityNameId}`;
        }
      } else {
        console.error('Failed to fetch community privacy:', data.message);
      }
    } catch (error) {
      console.error('Error fetching community privacy:', error);
    }
  }

  // Function to save the updated privacy settings
  async function saveSettings() {
    isLoading = true;
    try {
      const token = getJwtToken();
      if (!token) {
        console.error('Authentication token not found.');
        return;
      }

      const body = {
        status_privasi: selectedPrivacy.charAt(0).toUpperCase() + selectedPrivacy.slice(1),
      };

      const response = await fetch(`http://leap.crossnet.co.id:3010/api/v1/users/komunitas/update/${communityNameId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Settings saved:', result);

        // Show success message and modal
        successMessage = "Successfully updated community privacy!";
        showSuccessModal = true;
      } else {
        const errorData = await response.json();
        errorMessage = `Failed to save settings: ${errorData.message}`;
        console.error(errorMessage);
      }
    } catch (error) {
      errorMessage = 'Error saving settings.';
      console.error('Error saving settings:', error);
    } finally {
      isLoading = false;
    }
  }

  // Function to cancel changes
  function cancelSettings() {
    console.log('Settings changes canceled');
    fetchCommunityPrivacy();
  }

  // Open invite modal
  function openInviteModal() {
    showInviteModal = true;
  }

  // Close invite modal
  function closeInviteModal() {
    showInviteModal = false;
  }

  // Copy the invitation URL to clipboard
  function copyToClipboard() {
    navigator.clipboard.writeText(invitationUrl).then(() => {
      showCopyMessage = true;
      setTimeout(() => showCopyMessage = false, 2000); // Show confirmation for 2 seconds
    }).catch(err => console.error('Failed to copy text: ', err));
  }
</script>

<!-- Success modal -->
<ModalSuccess show={showSuccessModal} successMessage={successMessage} />

<!-- Invite modal -->
<Modal show={showInviteModal} title="Invitation URL" onClose={closeInviteModal}>
  <p>Share this invitation link to invite members:</p>
  <div class="invitation-url-container">
    <input type="text" readonly value={invitationUrl} class="invitation-url-input" />
    <button class="copy-button" on:click={copyToClipboard}>
      <img src="/src/lib/images/copy-icon.svg" alt="Copy" class="copy-icon" />
    </button>
  </div>
  {#if showCopyMessage}
    <p class="copy-message">Link copied to clipboard!</p>
  {/if}
</Modal>

<div class="content-container">
  <h2 class="text-xl font-semibold mb-4">Community Privacy</h2>
  <div class="form-group mb-6">
    <RadioDescription
      svgPath="/src/lib/images/public.svg"
      label="Public"
      description="Anyone can view and contribute"
      name="privacy"
      value="public"
      bind:selectedValue={selectedPrivacy}
    />
    <RadioDescription
      svgPath="/src/lib/images/private.svg"
      label="Private"
      description="Only approved users can view and contribute"
      name="privacy"
      value="private"
      bind:selectedValue={selectedPrivacy}
    />
    <RadioDescription
      svgPath="/src/lib/images/restrict.svg"
      label="Restrict"
      description="Only invited users can join"
      name="privacy"
      value="restrict"
      bind:selectedValue={selectedPrivacy}
    />

    <!-- Show "Invite Member" button only if API response indicates "restrict" -->
    {#if isRestrictPrivacy}
      <button class="invite-member-button" on:click={openInviteModal}>Invite Member</button>
    {/if}
  </div>

  <div class="buttons-container">
    <button class="cancel-button" on:click={cancelSettings}>Cancel</button>
    <button class="save-button" on:click={saveSettings} disabled={isLoading}>
      {#if isLoading}
        Saving...
      {:else}
        Save
      {/if}
    </button>
  </div>

  {#if errorMessage}
    <p class="text-red-500 mt-4">{errorMessage}</p>
  {/if}
</div>

<style>
  .content-container {
    background-color: white;
    padding: 16px;
    border-radius: 8px;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .invite-member-button {
    display: block;
    margin-top: 16px;
    padding: 8px 16px;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .invite-member-button:hover {
    background-color: #2563eb;
  }

  .buttons-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }

  .cancel-button {
    background-color: #e2e8f0;
    color: #4a5568;
    padding: 8px 16px;
    border-radius: 4px;
    margin-right: 8px;
    cursor: pointer;
    border: none;
  }

  .save-button {
    background-color: #007bff;
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    border: none;
  }

  .save-button:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }

  .text-red-500 {
    color: #f56565;
  }

  .mt-4 {
    margin-top: 1rem;
  }

  .invitation-url-container {
    display: flex;
    align-items: center;
    margin-top: 1rem;
  }

  .invitation-url-input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #f9f9f9;
    font-size: 1rem;
    color: #333;
  }

  .copy-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    margin-left: 8px;
  }

  .copy-icon {
    width: 24px;
    height: 24px;
  }

  .copy-message {
    color: #28a745;
    font-size: 0.9rem;
    margin-top: 8px;
  }
</style>
