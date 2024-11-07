<script>
    // @ts-nocheck
    import TextInput from '$lib/component/TextInput.svelte';
    import TextAreaInput from '$lib/component/TextAreaInput.svelte';
    import cameraIcon from '$lib/images/camera.svg';
    import profileImage from '$lib/images/profil_komunitas.png';
    import DropdownCheckbox from '$lib/component/DropdownCheckbox.svelte';
    import editIcon from '$lib/images/edit.svg';
    import deleteIcon from '$lib/images/delete.svg';
    import Modal from '$lib/component/Modal.svelte';
    import ModalSuccess from '$lib/component/ModalSuccess.svelte';
    import { onMount } from 'svelte';
    import { getJwtToken, getUserId, extractIdFromUrl } from '$lib/js/utils';
    
    let communityName = '';
    let description = '';
    let selectedFile = profileImage;
    let isLoading = false;
    let communityNameId;
    let communityRules = [];
    let selectedOptions = [];
    let categories = []; 
    let selectedSubcategories = [];
    
    let showAddModal = false;
    let showEditModal = false;
    let showDeleteModal = false;
    
    let communityRuleTitle = '';
    let communityDescription = '';
    let editingRuleId = null;
    let deletingRuleId = null;

    let showSuccessModal = false;
    let successMessage = '';
    
    const apiBaseUrl = 'http://leap.crossnet.co.id:3010/api/v1';
    
    onMount(async () => {
        isLoading = true;
        try {
            const token = getJwtToken();  // Get JWT token
            const userId = getUserId();   // Get user ID
            communityNameId = extractIdFromUrl(window.location.href); // Extract community ID from URL
            console.log('JWT Token:', token, 'User ID:', userId, 'Community ID:', communityNameId);
    
            if (!token) {
                console.error('Authentication token not found.');
                return;
            }
    
            await fetchCommunityDetails(token);
            await fetchCategoriesAndSubcategories(token);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            isLoading = false;
        }
    });
    
    async function fetchCommunityDetails(token) {
        const apiUrl = `${apiBaseUrl}/users/komunitas/${communityNameId}`;
        const response = await fetch(apiUrl, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
    
        if (data.status === 200) {
            const community = data.data.Komunitas;
            communityName = community.nama_komunitas;
            description = community.deskripsi_komunitas;
            selectedFile = `http://leap.crossnet.co.id:3010/getfoto?path=${community.gambar_komunitas}`;  // Update here to fetch the image using the correct API
            communityRules = community.rules_komunitas;
    
            // Map existing subcategories into selected options
            selectedSubcategories = community.subkategori_mm_komunitas.map(sub => sub.sub_kategori_id);
        } else {
            console.error('Failed to fetch community details:', data.message);
        }
    }
    
    async function fetchCategoriesAndSubcategories(token) {
        const categoriesApiUrl = `${apiBaseUrl}/admin/kategori?page=0&pageSize=0`;
        const subcategoriesApiUrl = `${apiBaseUrl}/admin/subkategori?page=0&pageSize=0`;
    
        // Fetch categories
        const categoriesResponse = await fetch(categoriesApiUrl, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const categoriesData = await categoriesResponse.json();
    
        // Fetch subcategories
        const subcategoriesResponse = await fetch(subcategoriesApiUrl, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const subcategoriesData = await subcategoriesResponse.json();
    
        if (categoriesData.status === 200 && subcategoriesData.status === 200) {
            categories = categoriesData.data.map(category => {
                const subcategoriesForCategory = subcategoriesData.data.filter(sub => sub.kategori_komunitas_id === category.id);
                return {
                    id: category.id,
                    name: category.nama_kategori,
                    subcategories: subcategoriesForCategory.map(sub => ({
                        id: sub.id,
                        name: sub.nama_subkategori
                    }))
                };
            });
        } else {
            console.error('Failed to fetch categories or subcategories.');
        }
    }
    
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            selectedFile = URL.createObjectURL(file);
        }
    }
    
    async function saveCommunity() {
        const token = getJwtToken();
        const apiUrl = `${apiBaseUrl}/users/komunitas/update/${communityNameId}`;
        const updateData = {
            "warna_tema": "Peach Glow",
            "subkategori_mm_komunitas": selectedSubcategories.map(sub => ({
                "sub_kategori_id": sub
            }))
        };
    
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...updateData,
                    nama_komunitas: communityName,
                    deskripsi_komunitas: description
                })
            });
    
            const result = await response.json();
            if (result.status === 200) {
                console.log('Community saved successfully!');
            } else {
                console.error('Failed to save community:', result.message);
            }
        } catch (error) {
            console.error('Error saving community:', error);
        }
    
        if (selectedFile !== profileImage) {
            await uploadProfileImage();
        }
    }
    
    async function uploadProfileImage() {
        const token = getJwtToken();
        const apiUrl = `${apiBaseUrl}/users/komunitasuploadfoto/${communityNameId}`;
        const formData = new FormData();
        const fileInput = document.getElementById('profile-upload');
        const file = fileInput.files[0];
    
        if (!file) {
            console.error('No file selected for upload.');
            return;
        }
    
        formData.append('foto', file);
    
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
    
            const result = await response.json();
            if (result.status === 200) {
                console.log('Profile image uploaded successfully!');
            } else {
                console.error('Failed to upload profile image:', result.message);
            }
        } catch (error) {
            console.error('Error uploading profile image:', error);
        }
    }
    
    function toggleRules(ruleIndex) {
        communityRules[ruleIndex].show = !communityRules[ruleIndex].show;
    }
    
    function toggleAddModal() {
        showAddModal = !showAddModal;
    }
    
    function toggleEditModal(ruleId) {
        editingRuleId = ruleId;
        const ruleToEdit = communityRules.find(rule => rule.id === ruleId);
        if(ruleToEdit) {
            communityRuleTitle = ruleToEdit.judul;
            communityDescription = ruleToEdit.deskripsi;
            showEditModal = true;
        } else {
            console.error('Rule not found');
        }
    }
    
    async function saveRule() {
        const token = getJwtToken();
        const apiUrl = showEditModal 
            ? `${apiBaseUrl}/users/komunitas/${communityNameId}/rule/update/${editingRuleId}`
            : `${apiBaseUrl}/users/komunitas/${communityNameId}/rule`;

        const method = showEditModal ? 'PUT' : 'POST';

        try {
            const response = await fetch(apiUrl, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    judul: communityRuleTitle,
                    deskripsi: communityDescription
                })
            });

            const result = await response.json();
            if (result.status === 200) {
                console.log('Rule saved successfully!');
                successMessage = showEditModal ? 'Successfully edit community rules!' : 'Successfully add community rules!';
                showSuccessModal = true;

                if (showEditModal) {
                    communityRules = communityRules.map(rule => rule.id === editingRuleId 
                        ? { ...rule, judul: communityRuleTitle, deskripsi: communityDescription } 
                        : rule
                    );
                } else {
                    communityRules.push(result.data);
                }

                // Fetch updated data
                const token = getJwtToken();
                await fetchCommunityDetails(token);
            } else {
                console.error('Failed to save rule:', result.message);
            }
        } catch (error) {
            console.error('Error saving rule:', error);
        }
    
        showAddModal = false;
        showEditModal = false;
    }

    function toggleDeleteModal(ruleId) {
        deletingRuleId = ruleId;
        showDeleteModal = true;
    }

    function handleCloseDeleteModal() {
        showDeleteModal = false;
    }

    async function deleteRule() {
        try {
            isLoading = true;
            const token = getJwtToken();
            const apiUrl = `http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityNameId}/rule/delete/${deletingRuleId}`;

            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                console.log('Community rule deleted successfully');
                communityRules = communityRules.filter(rule => rule.id !== deletingRuleId);
                successMessage = 'Successfully delete community rules!'; // Set success message
                showSuccessModal = true;
                handleCloseDeleteModal();
            } else {
                const errorData = await response.json();
                console.error(`Failed to delete community rule: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error deleting rule:', error);
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="content-container">
    <h2 class="text-xl font-semibold mb-4">Community Detail</h2>

    <div class="profile-and-name">
        <div class="profile-picture-container">
            <label for="profile-upload">
                <img src={selectedFile} alt="Community Profile" class="profile-picture" />
                <div class="camera-icon-container">
                    <img src={cameraIcon} alt="Camera Icon" class="camera-icon" />
                </div>
            </label>
            <input type="file" id="profile-upload" class="hidden" accept="image/*" on:change={handleFileSelect} />
        </div>
        <TextInput label="Community Name" placeholder="Enter community name" bind:value={communityName} />
    </div>

    <TextAreaInput label="Description" placeholder="Enter community description" bind:value={description} />
    
    <div class="form-group">
        <label class="block mb-2 font-semibold">Community Topics and Category</label>
        <DropdownCheckbox {categories} bind:selectedOptions={selectedSubcategories} />
    </div>

    <div class="form-group">
        <label class="block mb-2 font-semibold">Community Rules</label>
        <button class="add-rule-btn" on:click={toggleAddModal}>Add Community Rule</button>
        <div class="rules-list">
            {#each communityRules as rule, index}
            <div class="rule-item-container">
                <div class="rule-container">
                    <div class="rule-header" on:click={() => toggleRules(index)}>
                        <span>{rule.judul}</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" class="arrow-icon" class:rotated={rule.show}>
                            <path fill="none" stroke="black" stroke-width="2" d="M6 9l6 6 6-6" />
                        </svg>
                    </div>
                    {#if rule.show}
                    <p class="rule-content">
                        {rule.deskripsi}
                    </p>
                    {/if}
                </div>
                <div class="button-container">
                    <button class="edit-button" on:click={() => toggleEditModal(rule.id)}>
                        <img src={editIcon} alt="Edit" /> Edit
                    </button>
                    <button class="delete-button" on:click={() => toggleDeleteModal(rule.id)}>
                        <img src={deleteIcon} alt="Delete" /> Delete
                    </button>
                </div>
            </div>
            {/each}
        </div>
    </div>
</div>

<Modal title="Add Community Rules" show={showAddModal} onClose={toggleAddModal}>
    <TextInput label="Community Rules Title" placeholder="Enter rule title" bind:value={communityRuleTitle} />
    <TextAreaInput label="Community Description" placeholder="Enter description" bind:value={communityDescription} />
    <div class="modal-actions">
        <button class="cancel-button" on:click={toggleAddModal}>Cancel</button>
        <button class="save-button" on:click={saveRule}>Save</button>
    </div>
</Modal>

<Modal title="Edit Community Rules" show={showEditModal} onClose={toggleEditModal}>
    <TextInput label="Community Rules Title" placeholder="Edit rule title" bind:value={communityRuleTitle} />
    <TextAreaInput label="Community Description" placeholder="Edit description" bind:value={communityDescription} />
    <div class="modal-actions">
        <button class="cancel-button" on:click={toggleEditModal}>Cancel</button>
        <button class="save-button" on:click={saveRule}>Save</button>
    </div>
</Modal>

<Modal title="Delete Community Rule" bind:show={showDeleteModal} onClose={handleCloseDeleteModal}>
    <p>Are you sure you want to delete this community rule? This action cannot be undone.</p>
    <div class="flex justify-end space-x-2 mt-4">
        <button class="bg-gray-400 text-white px-4 py-2 rounded" on:click={handleCloseDeleteModal}>Cancel</button>
        <button class="bg-red-500 text-white px-4 py-2 rounded" on:click={deleteRule}>Delete</button>
    </div>
</Modal>

<ModalSuccess {showSuccessModal} {successMessage} />
    
<style>
    .content-container {
        background-color: white;
        padding: 16px;
        border-radius: 8px;
        height: auto;
    }

    .profile-and-name {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 20px;
    }

    .profile-picture-container {
        position: relative;
        width: 120px;
        height: 120px;
        cursor: pointer;
    }

    .profile-picture {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
    }

    .camera-icon-container {
        position: absolute;
        bottom: 10px;
        right: 10px;
        width: 35px;
        height: 35px;
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .camera-icon {
        width: 20px;
        height: 20px;
    }

    .hidden {
        display: none;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    .rules-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-top: 16px;
    }

    .rule-item-container {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    .rule-container {
        flex-grow: 1;
        border: 1px solid #ccc;
        border-radius: 8px;
        margin-right: 10px;
    }

    .rule-header {
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        width: 100%;
        height: 40px;
        padding: 8px 8px;
    }

    .arrow-icon {
        transition: transform 0.2s;
    }

    .rotated {
        transform: rotate(180deg);
    }

    .rule-content {
        margin-top: 8px;
        color: #333;
        padding: 8px 8px;
    }

    .button-container {
        display: flex;
        gap: 10px;
        align-items: center;
    }

    .edit-button, .delete-button {
        display: flex;
        align-items: center;
        background-color: transparent;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
    }

    .edit-button img, .delete-button img {
        margin-right: 8px;
    }

    .edit-button {
        background-color: #007bff;
        color: white;
    }

    .delete-button {
        background-color: #ff4040;
        color: white;
    }

    .edit-button:hover {
        background-color: #0069d9;
    }

    .delete-button:hover {
        background-color: #ff2020;
    }

    .add-rule-btn {
        background-color: #FF9029;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.3s;
    }

    .add-rule-btn:hover {
        background-color: #e07f24;
    }

    .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 16px;
    }

    .cancel-button {
        background-color: #e2e8f0;
        color: #4a5568;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        border: none;
        font-weight: 500;
    }

    .save-button {
        background-color: #007bff;
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        border: none;
        font-weight: 500;
    }

    .save-button:hover, .cancel-button:hover {
        opacity: 0.9;
    }
</style>
