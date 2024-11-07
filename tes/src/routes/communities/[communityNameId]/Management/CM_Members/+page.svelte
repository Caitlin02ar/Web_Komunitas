<script>
    // @ts-nocheck
    import { onMount } from 'svelte';
    import Member from '$lib/component/Member.svelte';
    import Modal from '$lib/component/Modal.svelte'; // Import Modal component
    import Search from '$lib/images/search.svg';
    import Toast from '$lib/component/Toast.svelte';
    import { getJwtToken, getUserId, extractIdFromUrl } from '$lib/js/utils';
    import centangIcon from '$lib/images/centangO-hijau.svg';
    import silangIcon from '$lib/images/silangO-merah.svg';
    
    let members = [];
    let roles = [];
    let communityNameId;
    let userRole = '';
    let currentLeaderId = null;
    let searchQuery = '';

    // Modal variables for "Member Detail"
    let showModal = false;
    let selectedMember = { name: '', username: '', role: '' };

    // Toast variables
    let showToast = false;
    let toastTitle = '';
    let toastDescription = '';
    let toastBgColor = '';
    let toastIcon = '';

    onMount(async () => {
        await fetchMembersAndRoles();
    });

    // Show Success Toast
    function showSuccessToast(role) {
        toastTitle = 'Role Updated';
        toastDescription = `Member's role successfully changed to ${role}.`;
        toastBgColor = 'bg-green-100';
        toastIcon = centangIcon;
        showToast = true;
        setTimeout(() => showToast = false, 3000);
    }

    // Show Failure Toast
    function showFailToast() {
        toastTitle = 'Update Failed';
        toastDescription = 'Failed to change member\'s role. Please try again.';
        toastBgColor = 'bg-red-100';
        toastIcon = silangIcon;
        showToast = true;
        setTimeout(() => showToast = false, 3000);
    }

    async function fetchMembersAndRoles() {
        try {
            const token = getJwtToken();
            const userId = getUserId();
            communityNameId = extractIdFromUrl(window.location.href);

            if (!token) {
                console.error('Authentication token not found.');
                return;
            }

            await fetchUserRole(token, userId);
            await fetchCommunityMembers(token);
            await fetchCommunityRoles(token);
        } catch (error) {
            console.error('Error fetching members or roles:', error);
        }
    }

    async function fetchUserRole(token, userId) {
        const roleResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${communityNameId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
        });

        const roleData = await roleResponse.json();
        if (roleResponse.ok && roleData.status === 200) {
            const leader = roleData.data.Leader;
            const coLeader = roleData.data.CoLeader;
            currentLeaderId = leader.user_id;

            if (leader && leader.user_id === parseInt(userId, 10)) {
                userRole = 'Leader';
            } else if (coLeader.some(co => co.user_id === parseInt(userId, 10))) {
                userRole = 'Co-Leader';
            }
        } else {
            console.error('Failed to fetch user role or community details:', roleData.message);
        }
    }

    async function fetchCommunityMembers(token) {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${communityNameId}/anggota?page=0&pageSize=0`;

        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
        });

        const data = await response.json();
        if (response.ok && data.status === 200) {
            const coLeadersCount = data.data.filter(member => member.Role.nama_roles === 'Co-Leader').length;

            members = data.data.map(member => {
                const user = member.User;
                const photoUrl = `${import.meta.env.VITE_API_BASE_URL}/${user.foto_profile}`;
                let actions = [
                    { text: 'Member Detail', onClick: () => showMemberDetail(member) } // Add Member Detail action
                ];

                if (userRole === 'Leader') {
                    if (member.Role.nama_roles === 'Member') {
                        actions.push(
                            ...(coLeadersCount < 2 ? [{ text: 'Make Co-Leader', onClick: () => updateRole(member.id, 'Co-Leader') }] : []),
                            { text: 'Make Admin', onClick: () => updateRole(member.id, 'Admin') },
                            { text: 'Remove Member', onClick: () => removeMember(member.id) }
                        );
                    } else if (member.Role.nama_roles === 'Admin') {
                        actions.push(
                            ...(coLeadersCount < 2 ? [{ text: 'Make Co-Leader', onClick: () => updateRole(member.id, 'Co-Leader') }] : []),
                            { text: 'Remove Admin', onClick: () => updateRole(member.id, 'Member') }
                        );
                    } else if (member.Role.nama_roles === 'Co-Leader') {
                        actions.push(
                            { text: 'Promote to Leader', onClick: () => promoteToLeader(member.id) },
                            { text: 'Remove Co-Leader', onClick: () => updateRole(member.id, 'Member') }
                        );
                    }
                } else if (userRole === 'Co-Leader') {
                    if (member.Role.nama_roles === 'Member') {
                        actions.push(
                            { text: 'Make Admin', onClick: () => updateRole(member.id, 'Admin') },
                            { text: 'Remove Member', onClick: () => removeMember(member.id) }
                        );
                    } else if (member.Role.nama_roles === 'Admin') {
                        actions.push(
                            { text: 'Remove Admin', onClick: () => updateRole(member.id, 'Member') }
                        );
                    }
                }

                return {
                    id: member.id,
                    name: user.nama_user,
                    username: user.username,
                    gender: user.jenis_kelamin === "P" ? "Female" : "Male",
                    phone: user.no_telpon,
                    birthDate: new Date(user.tanggal_lahir).toLocaleDateString(),
                    email: user.email,
                    address: user.alamat,
                    role: member.Role.nama_roles,
                    actions,
                    photo: photoUrl
                };
            });

            // Sorting members by role: Leader, Co-Leader, Admin, Member
            members.sort((a, b) => {
                const roleOrder = { Leader: 1, 'Co-Leader': 2, Admin: 3, Member: 4 };
                return roleOrder[a.role] - roleOrder[b.role];
            });
        } else {
            console.error('Failed to fetch members:', data.message);
        }
    }

    // Reactive statement to filter members based on search query
    $: filteredMembers = members.filter(member => 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Show member details in the modal
    function showMemberDetail(member) {
        selectedMember = {
            name: member.User.nama_user,
            username: member.User.username,
            gender: member.User.jenis_kelamin === "P" ? "Female" : "Male",
            phone: member.User.no_telpon,
            birthDate: new Date(member.User.tanggal_lahir).toLocaleDateString(),
            email: member.User.email,
            address: member.User.alamat,
            role: member.Role.nama_roles
        };
        showModal = true;
    }

    // Function to close the modal
    function closeModal() {
        showModal = false;
    }
</script>

<main class="p-4">
    <div class="bg-white shadow-md rounded-lg p-8">
        <h1 class="text-2xl font-bold mb-4 text-left">Members of Community</h1>
        <div class="relative mb-4">
            <input 
                type="text" 
                class="p-2 border rounded w-full pr-10" 
                placeholder="Search by name or username..." 
                bind:value={searchQuery}
            />
            <img src={Search} alt="Search" class="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5"/>
        </div>
        {#if filteredMembers.length > 0}
            {#each filteredMembers as member}
                <Member 
                    name={member.name}
                    username={member.username}
                    photo={member.photo}
                    role={member.role}
                    actions={member.actions} 
                />
            {/each}
        {:else}
            <p>No members found.</p>
        {/if}
    </div>
</main>

<Modal show={showModal} title="Member Details" onClose={closeModal}>
    <p><strong>Name:</strong> {selectedMember.name}</p>
    <p><strong>Username:</strong> {selectedMember.username}</p>
    <p><strong>Gender:</strong> {selectedMember.gender}</p>
    <p><strong>Phone:</strong> {selectedMember.phone}</p>
    <p><strong>Birth Date:</strong> {selectedMember.birthDate}</p>
    <p><strong>Email:</strong> {selectedMember.email}</p>
    <p><strong>Address:</strong> {selectedMember.address}</p>
    <p><strong>Role:</strong> {selectedMember.role}</p>
</Modal>

<Toast
    title={toastTitle}
    description={toastDescription}
    visible={showToast}
    bgColor={toastBgColor}
    icon={toastIcon}
    onClose={() => showToast = false}
/>
    
    <style>
      main {
        padding: 2rem;
        background-color: #f7f8fc;
      }
    
      .bg-white {
        background-color: #fff;
        padding: 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
    
      .text-2xl {
        font-size: 1.75rem;
        font-weight: bold;
      }
    
      .text-left {
        text-align: left;
      }
    
      .p-4 {
        padding: 1rem;
      }
    
      .mb-4 {
        margin-bottom: 1rem;
      }
    
      input {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 0.25rem;
        width: 100%;
        padding-right: 2.5rem;
      }
    
      img {
        cursor: pointer;
      }
    
      .relative {
        position: relative;
      }
    
      .absolute {
        position: absolute;
      }
    
      .right-2 {
        right: 0.5rem;
      }
    
      .transform {
        transform: translateY(-50%);
      }
    
      .w-5 {
        width: 1.25rem;
      }
    
      .h-5 {
        height: 1.25rem;
      }
    
      .pr-10 {
        padding-right: 2.5rem;
      }
    </style>
    