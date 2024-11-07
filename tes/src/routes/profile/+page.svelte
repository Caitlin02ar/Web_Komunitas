<script>
    import { goto } from '$app/navigation';
    import ButtonBack from '$lib/component/ButtonBack.svelte';
    import { getJwtToken, getUserId, deleteCookie } from '$lib/js/utils';
    import { onMount } from 'svelte';

    let user = {
        name: '',
        username: '',
        phone: '',
        dob: '',
        email: '',
        address: '',
        gender: '',
        profilePicture: ''
    };

    let events = [];

    let history = [
        {
            title: "LEAP 2024",
            startDate: "1 July 2024",
            endDate: "31 November 2024"
        },
        {
            title: "Cybersecurity Conference 2024",
            startDate: "5 August 2024",
            endDate: ""
        }
    ];

    let activeTab = 'events'; // Default tab

    function switchTab(tab) {
        activeTab = tab;
    }

    async function fetchUserEvents() {
    const token = getJwtToken();
    const userId = getUserId();

    if (token && userId) {
        try {
            const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/userparticipant/${userId}`;
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                
                if (data.status === 200 && data.data && data.data.PesertaEvent) {
                    // Map the event data from the PesertaEvent array
                    events = data.data.PesertaEvent.map(event => ({
                        title: event.Event.nama_event,
                        startDate: new Date(event.Event.tgl_mulai_kegiatan).toLocaleDateString(),
                        endDate: event.Event.tgl_selesai_kegiatan ? new Date(event.Event.tgl_selesai_kegiatan).toLocaleDateString() : '',
                        detailUrl: `/events/${event.event_id}` // Assuming there's a detail page
                    }));
                } else {
                    console.error('No events found for the user');
                }
            } else {
                console.error('Failed to fetch events data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching events data:', error);
        }
    } else {
        console.error('No token or user ID available');
    }
}

    function formatEventDate(event) {
        return event.endDate ? `${event.startDate} - ${event.endDate}` : event.startDate;
    }


    async function logout() {
    try {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/logout`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (response.ok) {
            deleteCookie('jwt');
            deleteCookie('userId');
            goto('/login');
            setTimeout(() => {
                window.location.reload(); // Force page reload to clear any cached data
            }, 100); // Delay to ensure the redirect completes first
        } else {
            console.error('Logout failed');
        }
    } catch (err) {
        console.error('An error occurred during logout:', err);
    }
}

    function navigateToEditProfile() {
        goto('/editProfile');
    }

    function navigateToChangePassword() {
        goto('/changePassword');
    }

    onMount(async () => {
        await fetchUserData();
        await fetchUserEvents();
    });

    async function fetchUserData() {
        const token = getJwtToken();
        const userId = getUserId();

        if (token && userId) {
            try {
                const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/user/${userId}`;
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 200) {
                        user = {
                            name: data.data.nama_user,
                            username: data.data.username,
                            phone: data.data.no_telpon,
                            dob: new Date(data.data.tanggal_lahir).toLocaleDateString(),
                            email: data.data.email,
                            address: data.data.alamat,
                            gender: data.data.jenis_kelamin === 'P' ? 'Female' : 'Male',
                            profilePicture: `${import.meta.env.VITE_API_BASE_URL}/getfoto?path=${data.data.foto_profile}`
                        };
                    }
                } else {
                    console.error('Failed to fetch user data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        } else {
            console.error('No token or user ID available');
        }
    }
</script>

<div class="profile-page">
    <div class="back-button-wrapper">
        <ButtonBack />
    </div>
    <div class="profile-container">
        <div class="user-info">
            <div class="logout-container" on:click={logout}>
                <img src="/src/lib/images/logout.svg" alt="Logout" class="logout-icon" />
                <p>Logout</p>
            </div>
            <img src={user.profilePicture || "https://via.placeholder.com/120"} alt="Profile Picture" class="profile-picture" />
            <h2><strong>{user.name}</strong></h2>
            <p class="username">@{user.username}</p>
            <button class="edit-profile" on:click={navigateToEditProfile}>Edit Profile</button>
            <button class="change-password" on:click={navigateToChangePassword}>Change Password</button>
        </div>
        <div class="account-info">
            <h3>Account Information</h3>
            <div class="account-details">
                <div class="detail-row">
                    <div class="detail-label bold-text">Phone Number</div>
                    <div class="detail-colon">:</div>
                    <div class="detail-value">{user.phone}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label bold-text">Date of Birth</div>
                    <div class="detail-colon">:</div>
                    <div class="detail-value">{user.dob}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label bold-text">Email</div>
                    <div class="detail-colon">:</div>
                    <div class="detail-value">{user.email}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label bold-text">Address</div>
                    <div class="detail-colon">:</div>
                    <div class="detail-value">{user.address}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label bold-text">Gender</div>
                    <div class="detail-colon">:</div>
                    <div class="detail-value">{user.gender}</div>
                </div>
            </div>
        </div>
    </div>

    <div class="tabs">
        <button class="tab-button" class:active={activeTab === 'events'} on:click={() => switchTab('events')}>Events Information</button>
        <button class="tab-button" class:active={activeTab === 'history'} on:click={() => switchTab('history')}>History</button>
    </div>

    <div class="tab-content">
        {#if activeTab === 'events'}
            <div class="events-info">
                {#each events as event}
                    <div class="event-item">
                        <div class="event-details">
                            <p class="event-title">{event.title}</p>
                            <p class="event-date">{formatEventDate(event)}</p>
                        </div>
                        <button on:click={() => goto(event.detailUrl)}>Detail</button>
                    </div>
                {/each}
            </div>
        {:else if activeTab === 'history'}
            <div class="history-info">
                {#each history as event}
                    <div class="event-item">
                        <div class="event-details">
                            <p class="event-title">{event.title}</p>
                            <p class="event-date">{formatEventDate(event)}</p>
                        </div>
                        <button on:click={() => goto(event.detailUrl)}>Detail</button>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
    .tabs {
        margin-top: 10px;
        display: flex;
        border-bottom: 2px solid #ddd;
        justify-content: flex-start;
        width: 100%;
        max-width: 800px;
    }

    .tab-button {
        padding: 8px 20px;
        background: none;
        border: none;
        font-weight: bold;
        cursor: pointer;
        color: #333;
        transition: color 0.3s ease;
        outline: none;
        border-bottom: 3px solid transparent;
    }

    .tab-button.active {
        color: #000;
        border-bottom: 3px solid #75b5b1;
    }

    .tab-content {
        margin-top: 10px;
        padding: 15px;
        border: 2px solid #ddd;
        border-radius: 8px;
        background-color: #fff;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 800px;
        max-height: 300px;
        overflow-y: auto;
    }

    .event-item {
        display: flex;
        justify-content: space-between;
        padding: 10px 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background-color: #f7f7f7;
        margin-bottom: 10px;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        width: 100%;
    }

    .event-details {
        flex-grow: 1;
    }

    .event-title {
        margin: 0;
        font-weight: bold;
        font-size: 16px;
    }

    .event-date {
        margin: 0;
        color: #666;
        font-size: 14px;
    }

    .event-item button {
        flex-shrink: 0;
        margin-left: 20px;
        padding: 2px 30px;
        border-radius: 5px;
        background-color: #007AFF;
        color: white;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s ease;
        align-self: center;
    }

    .event-item button:hover {
        background-color: #0056b3;
    }

    .profile-page {
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .back-button-wrapper {
        align-self: flex-start;
        margin-bottom: 10px;
    }

    .profile-container {
        display: flex;
        width: 100%;
        max-width: 800px;
        justify-content: space-between;
    }

    .user-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 30px 15px; 
        background-color: #FFFFFF;
        border-radius: 8px;
        width: 250px;
        box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
        position: relative;
    }

    .edit-profile, .change-password {
    width: 100%;
    max-width: 200px;
    text-align: center;
    margin-bottom: 10px;
    padding: 8px 20px;
    border: none; /* Remove the border */
    border-radius: 12px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
    }

    .edit-profile {
        background-color: #7AB2B2;
        color: white;
    }

    .edit-profile:hover {
        background-color: #609f9a;
    }

    .change-password {
        background-color: #FF9C41;
        color: white;
    }

    .change-password:hover {
        background-color: #e88b3a;
    }
    .logout-container {
        position: absolute;
        top: 15px;
        left: 15px;
        display: flex;
        align-items: center;
        padding: 0;
        cursor: pointer;
    }

    .logout-container p {
        margin-left: 5px;
        color: #FF0000;
        font-weight: 600;
        font-size: 14px;
    }

    .logout-icon {
        width: 20px;
        height: 20px;
        display: block;
        margin-top: -8px;
    }
	.user-info img{
		margin-top: 30px;
	}
	.logout-container {
    position: absolute;
    top: 15px;
    left: 15px;
    display: flex;
    align-items: center;
    padding: 0; /* Reset padding */
    cursor: pointer;
	
	}

	.profile-container .user-info .logout-container p {
		margin-left: 5px; /* Space between icon and text */
		color: #FF0000;
		font-weight: 600;
		font-size: 14px; /* Adjust font size if necessary */

	}

	.logout-container img {
		width: 20px;
		height: 20px;
		display: block; /* Ensures it's treated as an inline-block element */
		margin-top: -8px;
	}

    .user-info p.username {
        font-weight: normal !important;
        margin-bottom: 10px;
        font-size: 14px;
        color: #000;
    }

    .user-info img.profile-picture {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        margin-bottom: 10px;
    }

    .user-info h2 {
        margin-bottom: 5px;
    }

    .user-info p {
        font-weight: normal;
        margin-bottom: 10px;
    }

    .account-info {
        flex: 1;
        padding: 15px;
        background-color: #FFFFFF;
        border-radius: 8px;
        margin-left: 10px;
        box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
    }

    .account-info h3 {
        font-weight: bold;
        margin-bottom: 10px;
    }

    .account-details {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .detail-row {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    .detail-label {
        flex: 0 0 150px;
        text-align: left;
        padding-right: 5px;
        font-weight: bold;
    }

    .detail-colon {
        flex: 0 0 auto;
        padding-right: 5px;
    }

    .detail-value {
        flex: 1;
        text-align: left;
        word-wrap: break-word;
        overflow-wrap: break-word;
        white-space: normal;
        word-break: break-all;
        hyphens: auto;
    }

    .events-info {
        margin-top: 10px;
        width: 100%;
        max-width: 800px;
    }

    .history-info {
        margin-top: 10px;
        width: 100%;
        max-width: 800px;
    }

    @media (max-width: 768px) {
        .profile-container {
            flex-direction: column;
            align-items: center;
        }

        .user-info, .account-info {
            width: 100%;
            max-width: none;
            margin-left: 0;
        }

        .account-info {
            margin-top: 20px;
        }

        .account-details .detail-label,
        .account-details .detail-value {
            width: 100%;
            max-width: 100%;
            word-wrap: break-word;
            white-space: normal;
        }

        .detail-row {
            justify-content: space-between;
        }
    }
</style>
