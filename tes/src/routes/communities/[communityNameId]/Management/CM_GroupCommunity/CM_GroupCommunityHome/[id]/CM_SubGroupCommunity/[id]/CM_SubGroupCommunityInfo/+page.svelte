<script>
    //@ts-nocheck
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { getJwtToken, extractIdFromUrl } from '$lib/js/utils'; // Import token utility
    
    // Import your icons
    import editIcon from '$lib/images/edit-hitam.svg';
    import memberIcon from '$lib/images/member.svg';
    import gradeIcon from '$lib/images/manage_member.svg';
    import deleteIcon from '$lib/images/deleteO-merah.svg'; // Correct icon for delete
    
    import publicIcon from '$lib/images/public.svg';
    import privateIcon from '$lib/images/private.svg';
    import restrictedIcon from '$lib/images/restrict.svg';
    

    let groupcommunityName = "";
    let description = "";
    let privacyStatus = ""; 
    let groupImage = "";
    let showModal = false;
    let communityId = extractIdFromUrl(window.location.href);
    let groupId = null;
    let subgroupId = null;
    
    onMount(async () => {
        // Extract the communityId, groupId, and subgroupId from the URL
        const currentUrl = window.location.href;
        groupId = extractGroupIdFromUrl(currentUrl); // Extract groupId from URL
        subgroupId = extractSubGroupIdFromUrl(currentUrl); // Extract subgroupId from URL
        
        // Fetch group community data when the component is mounted
        await fetchSubGroupCommunity();
    });
    
    function extractGroupIdFromUrl(url) {
        const parts = url.split('/');
        const groupIndex = parts.findIndex(part => part === 'CM_GroupCommunityHome');
        if (groupIndex !== -1 && parts[groupIndex + 1]) {
            return parts[groupIndex + 1]; // Extract the groupId from the URL
        }
        return null;
    }
    
    function extractSubGroupIdFromUrl(url) {
        const parts = url.split('/');
        const subgroupIndex = parts.findIndex(part => part === 'CM_SubGroupCommunity');
        if (subgroupIndex !== -1 && parts[subgroupIndex + 1]) {
            return parts[subgroupIndex + 1]; // Extract the subgroupId from the URL
        }
        return null;
    }
    
    async function fetchSubGroupCommunity() {
        try {
            const token = getJwtToken(); // Get the token from utils
            const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${communityId}/group/${groupId}/subgroup/${subgroupId}`;
    
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
    
            const result = await response.json();
    
            if (result.status === 200) {
                const subgroupData = result.data.SubGroup;
                groupcommunityName = subgroupData.nama_subgroup_komunitas || '';
                description = subgroupData.deskripsi || '';
                privacyStatus = subgroupData.status_privasi ? subgroupData.status_privasi.toLowerCase() : 'public';
                groupImage = subgroupData.foto ? `${import.meta.env.VITE_API_BASE_URL}/getfoto?path=${subgroupData.foto}` : '/path-to-image.png';
            } else {
                console.error('Error fetching subgroup community:', result.message);
            }
        } catch (error) {
            console.error('Error fetching subgroup community:', error);
        }
    }
    
    function updateUrlSegment(newSegment) {
        const currentUrl = window.location.pathname;
        const parts = currentUrl.split('/');
        parts[parts.length - 1] = newSegment;
        const newUrl = parts.join('/');
        goto(newUrl);
    }
    
    function navigateToEditGroup() {
        updateUrlSegment('CM_EditSubGroupCommunity');
    }
    
    function navigateToManageMembers() {
        updateUrlSegment('CM_SubGroupCommunityMember');
    }

    async function confirmDelete() {
        try {
            const token = getJwtToken(); // Get the token from utils
            const apiUrl = `http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityId}/group/${groupId}/subgroup/delete/${subgroupId}`;
    
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            const result = await response.json();
    
            if (result.status === 200) {
                showModal = false;
                alert('Subgroup community deleted successfully.');
                goto('/CM_GroupCommunityHome'); // Navigate back to the main group page
            } else {
                console.error('Failed to delete subgroup community:', result.message);
                alert('Failed to delete subgroup community.');
            }
        } catch (error) {
            console.error('Error deleting subgroup community:', error);
            alert('An error occurred while deleting the subgroup.');
        }
    }
    
    function deleteGroup() {
        showModal = true;
    }
    
    function cancelDelete() {
        showModal = false;
    }
</script>

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
            <span>Edit Sub Group Community Information</span>
        </div>
        <div class="action-item" on:click={navigateToManageMembers}>
            <img src={memberIcon} alt="Manage Member" class="icon"/> 
            <span>Manage Member</span>
        </div>
        <div class="action-item delete-item" on:click={deleteGroup}>
            <img src={deleteIcon} alt="Delete" class="icon"/> 
            <span>Delete Sub Group Community</span>
        </div>
    </div>

    <div class="group-description">
        <h2>Group Community Description</h2>
        <p>{description}</p>
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
                <img src={deleteIcon} alt="Delete Icon" class="delete-icon"/>
                <h3>Delete Sub Group Community</h3>
                <p>Are you sure you want to delete this sub group community?</p>
                <p class="warning-text">This action cannot be undone</p>
                <div class="modal-actions">
                    <button on:click={cancelDelete} class="cancel-button">Cancel</button>
                    <button on:click={confirmDelete} class="delete-button">Yes, Delete</button>
                </div>
            </div>
        </div>
    {/if}
</div>

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
