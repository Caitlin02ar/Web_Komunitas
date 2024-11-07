<script>
    //@ts-nocheck
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { getJwtToken, extractIdFromUrl } from '$lib/js/utils'; // Import utilities
    import editIcon from '$lib/images/edit-hitam.svg';
    import memberIcon from '$lib/images/member.svg';
    import gradeIcon from '$lib/images/manage_member.svg';
    import deleteIcon from '$lib/images/deleteO-merah.svg'; // Correct import for delete icon
    
    import publicIcon from '$lib/images/public.svg';
    import privateIcon from '$lib/images/private.svg';
    import restrictedIcon from '$lib/images/restrict.svg';
    
    let groupcommunityName = "";
    let description = "";
    let privacyStatus = ""; // Can be either 'public', 'private', or 'restricted'
    let additionalQuestions = [];
    let periodStart = "";
    let periodEnd = "";
    let showModal = false; // Controls the visibility of the modal
    let groupImage = ""; // Image path for the group
    let userImage = "";  // Image path for the user
    let communityId = null;
    let groupId = null;
    
    onMount(async () => {
        // Extract the communityId and groupId from the URL
        const currentUrl = window.location.href;
        communityId = extractIdFromUrl(currentUrl); // Extract communityId from URL
        groupId = extractGroupIdFromUrl(currentUrl); // Extract groupId from URL
        
        // Fetch group community data when the component is mounted
        await fetchGroupCommunity();
    });
    
    function extractGroupIdFromUrl(url) {
        const parts = url.split('/');
        const groupIndex = parts.findIndex(part => part === 'CM_GroupCommunityHome');
        if (groupIndex !== -1 && parts[groupIndex + 1]) {
            return parts[groupIndex + 1]; // Extract the groupId from the URL
        }
        return null;
    }
    
    async function fetchGroupCommunity() {
        try {
            const token = getJwtToken(); // Get the token from utils
            const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${communityId}/group/${groupId}`;
    
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
    
            const result = await response.json();
    
            // Log the entire result to the console for debugging
            console.log('Full API Response:', result);
    
            if (result.status === 200) {
                const groupData = result.data.GroupKomunitas;
                const userData = result.data.Leader.User;
    
                groupcommunityName = groupData.nama_group_komunitas || '';
                description = groupData.deskripsi || '';
                privacyStatus = groupData.status_privasi ? groupData.status_privasi.toLowerCase() : 'public';
                periodStart = groupData.start_date ? new Date(groupData.start_date).toISOString().slice(0, 16) : '';
                periodEnd = groupData.end_date ? new Date(groupData.end_date).toISOString().slice(0, 16) : '';
    
                // Fetch image using provided format
                groupImage = groupData.foto ? `${import.meta.env.VITE_API_BASE_URL}/getfoto?path=${groupData.foto}` : '/path-to-image.png';
                userImage = userData.foto_profile ? `${import.meta.env.VITE_API_BASE_URL}/getfoto?path=${userData.foto_profile}` : '/default-profile.png';
    
                // Handle additional questions if available
                additionalQuestions = [
                    groupData.field_pertanyaan_1 || "Question 1",
                    groupData.field_pertanyaan_2 || "Question 2",
                    groupData.field_pertanyaan_3 || "Question 3"
                ].filter(Boolean); // Remove any null or undefined questions
    
            } else {
                console.error('Error fetching group community:', result.message);
            }
        } catch (error) {
            console.error('Error fetching group community:', error);
        }
    }
    
    function updateUrlSegment(newSegment) {
        const currentUrl = window.location.pathname; // Get the current URL
        const parts = currentUrl.split('/');   // Split the URL into segments
        parts[parts.length - 1] = newSegment;  // Replace the last segment with the new one
        const newUrl = parts.join('/');        // Join the segments back into a full URL
        goto(newUrl);                          // Navigate to the updated URL
    }
    
    function navigateToEditGroup() {
        updateUrlSegment('CM_EditGroupCommunity'); // Navigate to Edit Group Community
    }
    
    function navigateToManageMembers() {
        updateUrlSegment('CM_GroupCommunityMember'); // Navigate to Manage Members
    }
    
    function navigateToManageGrade() {
        updateUrlSegment('CM_GroupCommunityGrade'); // Navigate to Member Grade
    }
    
    function deleteGroup() {
        showModal = true; // Show the delete confirmation modal
    }
    
    async function confirmDelete() {
    try {
        const token = getJwtToken(); // Get the token from utils
        const apiUrl = `http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityId}/group/delete/${groupId}`;
        
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        
        const result = await response.json();

        if (result.status === 200) {
            alert('Group community successfully deleted');
            goto('/communities'); // Redirect to the communities page after deletion
        } else {
            console.error('Error deleting group community:', result.message);
            alert('Failed to delete group community');
        }
    } catch (error) {
        console.error('Error deleting group community:', error);
        alert('An error occurred while deleting the group community');
    } finally {
        showModal = false; // Close the modal
    }
}
    
    function cancelDelete() {
        showModal = false; // Close the modal without deleting
    }
</script>

<!-- HTML part to display the fetched data -->
<div class="group-community-info">
    <div class="header">
        <button class="back-button" on:click={() => alert('Back button clicked')}>Back</button>
    </div>

    <div class="group-header">
        <div class="image-container">
            <img src={groupImage} alt="Group Image" class="group-image" />
            <h1 class="group-name">{groupcommunityName}</h1>
        </div>
    </div>

    <div class="actions">
        <div class="action-item" on:click={navigateToEditGroup}>
            <img src={editIcon} alt="Edit" class="icon"/> 
            <span>Edit Group Community Information</span>
        </div>
        <div class="action-item" on:click={navigateToManageMembers}>
            <img src={memberIcon} alt="Manage Member" class="icon"/> 
            <span>Manage Member</span>
        </div>
        <div class="action-item" on:click={navigateToManageGrade}>
            <img src={gradeIcon} alt="Member Grade" class="icon"/> 
            <span>Member Grade</span>
        </div>
        <div class="action-item delete-item" on:click={deleteGroup}>
            <img src={deleteIcon} alt="Delete" class="icon"/> 
            <span>Delete Group Community</span>
        </div>
    </div>

    <div class="group-description">
        <h2>Group Community Description</h2>
        <p>{description}</p>
    </div>

    <div class="additional-questions">
        <h2>Group Community Additional Question</h2>
        {#each additionalQuestions as question, index}
            <div class="question-field">
                <label>Question {index + 1}</label>
                <input type="text" value={question} readonly />
            </div>
        {/each}
    </div>

    <div class="group-period-time">
        <h2>Group Community Period Time</h2>
        <div class="period-time">
            <div class="period-field">
                <label>Group Community Start Date</label>
                <input type="datetime-local" value={periodStart} readonly />
            </div>
            <div class="period-field">
                <label>Group Community End Date</label>
                <input type="datetime-local" value={periodEnd} readonly />
            </div>
        </div>
    </div>

    <div class="group-status">
        <h2>Group Community Status Privacy</h2>
        {#if privacyStatus === "public"}
            <div class="status-privacy">
                <img src={publicIcon} alt="Public" class="status-icon" />
                <div class="status-details">
                    <label>Public</label>
                    <p>Anyone can view and contribute</p>
                </div>
            </div>
        {:else if privacyStatus === "private"}
            <div class="status-privacy">
                <img src={privateIcon} alt="Private" class="status-icon" />
                <div class="status-details">
                    <label>Private</label>
                    <p>Only approved users can view and contribute</p>
                </div>
            </div>
        {:else if privacyStatus === "restricted"}
            <div class="status-privacy">
                <img src={restrictedIcon} alt="Restricted" class="status-icon" />
                <div class="status-details">
                    <label>Restricted</label>
                    <p>Only invited users can join</p>
                </div>
            </div>
        {/if}
    </div>

    {#if showModal}
        <div class="modal-overlay">
            <div class="modal">
                <img src={deleteIcon} alt="Delete" class="delete-icon"/>
                <h3>Delete Group Community</h3>
                <p>Are you sure you want to delete this group community?</p>
                <p class="warning-text">This action cannot be irreversible</p>
                <div class="modal-actions">
                    <button on:click={cancelDelete} class="cancel-button">Cancel</button>
                    <button on:click={confirmDelete} class="delete-button">Yes, delete</button>
                </div>
            </div>
        </div>
    {/if}
</div>

<!-- Your CSS styling for the modal and buttons -->
<style>
    .group-community-info {
        margin: 5px;
        padding: 20px;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
        font-family: Arial, sans-serif;
    }

    .header {
        margin-bottom: 20px;
    }

    .back-button {
        background-color: transparent;
        border: none;
        font-size: 16px;
        cursor: pointer;
        color: #007BFF;
        display: flex;
        align-items: center;
    }

    .group-header {
        margin-bottom: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .image-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .group-image {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 15px;
    }

    .group-name {
        font-size: 24px;
        margin-bottom: 20px;
        text-align: center;
    }

    .actions {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-bottom: 30px;
    }

    .action-item {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 16px;
        cursor: pointer;
    }

    .delete-item {
        color: #ff4d4f;
    }

    .icon {
        width: 20px;
        height: 20px;
    }

    .group-description {
        margin-bottom: 30px;
    }

    .group-description p {
        font-size: 16px;
        line-height: 1.5;
        color: #555;
    }

    .additional-questions {
        margin-bottom: 30px;
    }

    .question-field {
        margin-bottom: 10px;
    }

    .question-field label {
        display: block;
        font-weight: bold;
        margin-bottom: 5px;
    }

    .question-field input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    .group-period-time {
        margin-bottom: 30px;
    }

    .period-time {
        display: flex;
        gap: 10px;
        justify-content: space-between;
    }

    .period-field {
        flex-grow: 1;
    }

    .period-field label {
        display: block;
        font-weight: bold;
        margin-bottom: 5px;
    }

    .period-field input {
        padding: 8px;
        width: 100%;
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    .group-status {
        margin-bottom: 30px;
    }

    .status-privacy {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .status-details {
        display: flex;
        flex-direction: column;
    }

    .status-icon {
        width: 24px;
        height: 24px;
    }

    .status-privacy p {
        margin-top: 5px;
        color: #555;
        font-size: 14px;
    }

    /* Modal Overlay */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.2); /* 20% opacity */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    /* Modal Content */
    .modal {
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        text-align: center;
        width: 300px;
        max-width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .delete-icon {
        width: 50px;
        height: 50px;
        margin-bottom: 20px;
    }

    .modal h3 {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .modal p {
        font-size: 16px;
        margin-bottom: 10px;
    }

    .warning-text {
        color: red;
        font-style: italic;
        font-size: 14px;
        margin-bottom: 20px;
    }

    /* Modal Buttons */
    .modal-actions {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }

    .cancel-button {
        background-color: #ccc;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        flex-grow: 1;
        margin-right: 10px;
    }

    .delete-button {
        background-color: white;
        color: #ff4d4f;
        border: 2px solid #ff4d4f;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        flex-grow: 1;
    }
</style>
