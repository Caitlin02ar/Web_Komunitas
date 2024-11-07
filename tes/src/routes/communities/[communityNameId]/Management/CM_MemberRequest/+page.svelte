<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import MemberRequest from '$lib/component/MemberRequest.svelte';
  import Toast from '$lib/component/Toast.svelte';
  import { getJwtToken, getUserId, extractIdFromUrl } from '$lib/js/utils';
  import { page } from '$app/stores';

  let memberRequests = [];
  let communityNameId;
  let showToast = false;
  let toastTitle = '';
  let toastDescription = '';
  let toastBgColor = '';
  let toastIcon = '';

  import CentangO_Hijau from '$lib/images/CentangO-Hijau.svg';
  import SilangO_Merah from '$lib/images/SilangO-Merah.svg';
  
  $: communityNameId = $page.params.communityNameId;

  const handleAccept = async (memberId) => {
    console.log('Accept button clicked for member:', memberId);
    try {
      const token = getJwtToken();
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${communityNameId}/requestanggota/accept/${memberId}`;

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        toastTitle = 'Request Accepted';
        toastDescription = 'The member is now part of your community';
        toastBgColor = 'bg-green-100';
        toastIcon = CentangO_Hijau;
        console.log('Member accepted successfully');
        memberRequests = memberRequests.filter(member => member.id !== memberId);
      } else {
        toastTitle = 'Failed To Accept';
        toastDescription = data.message || 'Unable to add the member. Please try again.';
        toastBgColor = 'bg-red-100';
        toastIcon = SilangO_Merah;
        console.log('Failed to accept member:', data.message);
      }
    } catch (error) {
      toastTitle = 'Failed To Accept';
      toastDescription = 'Unable to add the member. Please try again.';
      toastBgColor = 'bg-red-100';
      toastIcon = SilangO_Merah;
      console.error('Error accepting member:', error);
    } finally {
      showToast = true;
      setTimeout(() => showToast = false, 3000);
    }
  };

  const handleDeny = async (memberId) => {
    const token = getJwtToken();
    if (!token) {
      console.error('Authentication token not found.');
      return;
    }

    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${communityNameId}/requestanggota/delete/${memberId}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        toastTitle = 'Request Denied';
        toastDescription = 'The membership request has been successfully denied.';
        toastBgColor = 'bg-green-100';
        toastIcon = SilangO_Merah;
        memberRequests = memberRequests.filter(member => member.id !== memberId);
      } else {
        toastTitle = 'Failed to Deny';
        toastDescription = data.message || 'Failed to deny the member request. Please try again.';
        toastBgColor = 'bg-red-100';
        toastIcon = SilangO_Merah;
      }
    } catch (error) {
      toastTitle = 'Failed to Deny';
      toastDescription = 'An error occurred while denying the member request. Please try again.';
      toastBgColor = 'bg-red-100';
      toastIcon = SilangO_Merah;
      console.error('Error denying member:', error);
    } finally {
      showToast = true;
      setTimeout(() => showToast = false, 3000);
    }
  };

 onMount(async () => {
         try {
            const token = getJwtToken();
            const userId = getUserId();
            communityNameId = extractIdFromUrl(window.location.href);
            console.log('JWT Token:', token);

            if (!token) {
                console.error('Authentication token not found.');
                return;
            }

      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${communityNameId}/requestanggota?page=0&pageSize=0`;

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok && data.status === 200) {
        memberRequests = data.data.map(member => {
          const user = member.User;
          const photoUrl = import.meta.env.VITE_API_BASE_URL + '/' + user.foto_profile;
          
          console.log('Photo URL:', photoUrl);

          return {
            id: member.id,
            name: user.nama_user,
            username: user.username,
            photo: photoUrl,
            details: {
              class: member.kelas || 'No class provided',
              allergy: member.alergi || 'No allergy information',
            }
          };
        });
      } else {
        console.error(`Failed to fetch member requests: ${data.message}`);
      }
    } catch (error) {
      console.error('Error fetching member requests:', error);
    }
  });
</script>

<main class="p-4">
  <div class="bg-white shadow-md rounded-lg p-8">
    <h1 class="text-2xl font-bold mb-4 text-left">Member Requests</h1>
    {#each memberRequests as member}
      <MemberRequest 
        name={member.name}
        username={member.username}
        photo={member.photo}
        details={member.details}
        onAccept={() => handleAccept(member.id)}
        onDeny={() => handleDeny(member.id)}
      />
    {/each}
  </div>

  <Toast
    title={toastTitle}
    description={toastDescription}
    bgColor={toastBgColor}  
    icon={toastIcon}  
    visible={showToast}
    onClose={() => showToast = false}
  />
</main>

<style>
  main {
    padding: 1rem;
  }

  .bg-white {
    background-color: white;
  }

  .shadow-md {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .rounded-lg {
    border-radius: 8px;
  }

  .p-8 {
    padding: 2rem;
  }

  .text-left {
    text-align: left;
  }

  .text-blue-500 {
    color: #3B82F6;
  }

  .hover\:underline:hover {
    text-decoration: underline;
  }

  .mb-4 {
    margin-bottom: 1rem;
  }

  .inline-block {
    display: inline-block;
  }

  .text-2xl {
    font-size: 1.5rem;
  }

  .font-bold {
    font-weight: bold;
  }
</style>
