<script>
    // @ts-nocheck
    import { onMount } from 'svelte';
    import Member from '$lib/component/Member.svelte';
    import { getJwtToken, getUserId, extractIdFromUrl } from '$lib/js/utils';

    let members = [];
    let communityNameId;
    let groupId;
    let userRole = ''; // Store if the user is 'Leader' or 'Co-Leader'

    onMount(async () => {
        await fetchMembers();
    });

    async function fetchMembers() {
        try {
            const token = getJwtToken();
            const userId = getUserId();
            communityNameId = extractIdFromUrl(window.location.href);
            groupId = extractGroupIdFromUrl(window.location.href);

            if (!token) {
                console.error('Authentication token not found.');
                return;
            }

            // Fetch community members
            await fetchCommunityMembers(token);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    }

    // Extract group ID from the URL
    function extractGroupIdFromUrl(url) {
        const regex = /CM_GroupCommunityHome\/(\d+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    // Fetch members of the community
    async function fetchCommunityMembers(token) {
        const apiUrl = `http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityNameId}/group/${groupId}/anggota?page=0&pageSize=0`;

        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
        });

        const data = await response.json();
        if (response.ok && data.status === 200) {
            members = data.data.map(member => {
                const user = member.User;
                const photoUrl = `${import.meta.env.VITE_API_BASE_URL}/${user.foto_profile}`;

                let actions = [
                    { text: 'Make Admin', onClick: () => makeAdmin(member.id) },
                    { text: 'Remove Member', onClick: () => removeMember(member.id) }
                ];

                return {
                    id: member.id,
                    name: user.nama_user,
                    username: user.username,
                    photo: photoUrl,
                    role: member.Role.nama_roles,
                    actions
                };
            });
        } else {
            console.error('Failed to fetch members:', data.message);
        }
    }

    // Remove a member from the community
    async function removeMember(memberId) {
        try {
            const token = getJwtToken();
            const apiUrl = `http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityNameId}/group/${groupId}/anggota/delete/${memberId}`;

            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
            });

            if (response.ok) {
                console.log(`Successfully removed member ${memberId}`);
                await fetchCommunityMembers(token); // Refresh the members list
            } else {
                console.error('Failed to remove member:', response.statusText);
                alert(`Failed to remove member: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error removing member:', error);
            alert(`Error removing member: ${error}`);
        }
    }

    // Make a member an admin (API action is currently empty)
    function makeAdmin(memberId) {
        console.log(`Making member ${memberId} an Admin - API action not implemented yet.`);
        // Placeholder for API call to make the user an Admin
    }
</script>

<main class="p-4">
    <div class="bg-white shadow-md rounded-lg p-8">
        <h1 class="text-2xl font-bold mb-4 text-left">Members of Community</h1>
        {#if members.length > 0}
            {#each members as member}
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
</style>
