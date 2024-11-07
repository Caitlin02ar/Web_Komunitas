<script lang="ts">
    import SidebarChat from '$lib/component/SidebarChat.svelte';
    import { getJwtToken, extractIdFromUrl, getUserId, getAnggotaKomunitasId } from '$lib/js/utils'; 
    import { onMount } from 'svelte'; 
    import Loading from '$lib/component/Loading.svelte';

    let communityName = "";
    let chats = [];
    let isLoading = true;

    // Function to handle request join
    async function handleRequestJoin(event) {
        // Deklarasi variabel di dalam fungsi
        const { chatId, answers } = event.detail;
        console.log("Handling request to join chat:", chatId, answers);

        try {
            // Ambil userId dari utils.js
            const userId = getUserId();

            // Ambil communityId dari URL
            const communityId = extractIdFromUrl(window.location.href);

            // Ambil anggota_komunitas_id
            const anggotaKomunitasId = await getAnggotaKomunitasId(userId, communityId);

            // Persiapkan data untuk dikirim ke API
            const data = {
                anggota_komunitas_id: anggotaKomunitasId,
                field_jawaban_1: answers.question1 || "",  // Jika kosong, default ke ""
                field_jawaban_2: answers.question2 || "",
                field_jawaban_3: answers.question3 || ""
            };

            // URL endpoint untuk bergabung ke grup
            const url = `${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${communityId}/group/${chatId}/join`;

            // Ambil token dari utils.js
            const token = getJwtToken();

            // Kirim request POST ke API
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data) // Data yang dikirim ke API
            });

            // Tangani respon dari API
            if (response.ok) {
                const result = await response.json();
                console.log("Berhasil bergabung ke grup:", result);
            } else {
                console.error("Gagal bergabung ke grup:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error handling request join:", error);
        }
    }

    // Fetch community and group data from the API
    async function fetchCommunityData() {
        const token = getJwtToken();

        if (typeof window !== 'undefined') {
            const communityId = extractIdFromUrl(window.location.href);

            // Fetch community name
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${communityId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    communityName = result.data.Komunitas.nama_komunitas;
                } else {
                    console.error('Failed to fetch community data');
                }
            } catch (error) {
                console.error('Error fetching community data:', error);
            }

            // Fetch group data
            try {
                const groupResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${communityId}/group?page=0&pageSize=0`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });

                if (groupResponse.ok) {
                    const groupResult = await groupResponse.json();

                    for (const group of groupResult.data) {
                        const hasJoined = await checkMembership(group.id);

                        const questionResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${communityId}/group/${group.id}`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`, 
                                'Content-Type': 'application/json'
                            },
                        });

                        let questionData = { field_pertanyaan_1: "", field_pertanyaan_2: "", field_pertanyaan_3: "" };

                        if (questionResponse.ok) {
                            const questionResult = await questionResponse.json();
                            const groupDetails = questionResult.data.GroupKomunitas;
                            questionData = {
                                field_pertanyaan_1: groupDetails.field_pertanyaan_1 || "",
                                field_pertanyaan_2: groupDetails.field_pertanyaan_2 || "",
                                field_pertanyaan_3: groupDetails.field_pertanyaan_3 || ""
                            };
                        } else {
                            console.error('Failed to fetch questions for group:', group.id);
                        }

                        chats.push({
                            id: group.id,
                            name: group.nama_group_komunitas,
                            imageSrc: `${import.meta.env.VITE_API_BASE_URL}/${group.foto}`,
                            isPrivate: group.status_privasi !== 'Public',
                            hasJoined: hasJoined,
                            questions: questionData
                        });
                    }

                    console.log(chats);
                } else {
                    console.error('Failed to fetch group data');
                }
            } catch (error) {
                console.error('Error fetching group data:', error);
            }

            // After the data is fetched, set loading to false
            isLoading = false;
        }
    }

    // Check membership for a specific group
    async function checkMembership(groupId) {
        const token = getJwtToken();
        const userId = getUserId();
        const url = `${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${extractIdFromUrl(window.location.href)}/group/${groupId}/anggota?page=0&pageSize=0`;
        
        try {
            const membershipResponse = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (membershipResponse.ok) {
                const membershipResult = await membershipResponse.json();
                return membershipResult.data.some(member => member.user_id === Number(userId));
            } else {
                console.error('Failed to check group membership:', membershipResponse.statusText);
                return false;
            }
        } catch (error) {
            console.error('Error checking group membership:', error);
            return false;
        }
    }

    // Fetch data when component is mounted
    onMount(() => {
        fetchCommunityData();
    });
</script>

<!-- Render the SidebarChat component and pass the data as props -->
<div class="page-container">
    {#if isLoading}
        <Loading /> <!-- Show loading component while data is being fetched -->
    {:else if communityName}
        <div class="sidebar-container">
            <SidebarChat {communityName} {chats} on:requestJoin={handleRequestJoin} />
        </div>
    {/if}
    <div class="chat-container">
        <main>
            <slot />
        </main>
    </div>
</div>

<style>
    .page-container {
        display: flex;
        justify-content: flex-start;
        background-color: #f9f9f9;
        margin-top: -20px;
        margin-bottom: -20px;
        box-sizing: border-box;
    }

    .sidebar-container {
        width: 300px; /* Fixed width for sidebar */
        background-color: #fff;
        border-right: 1px solid #ddd;
        height: 100%;
        overflow-y: auto;
        margin-left: -40px;
        
        box-sizing: border-box;
    }

    .chat-container {
        flex-grow: 1; /* Allow chat container to take the rest of the space */
        background-color: #f0f0f0;
        overflow-y: auto;
        height: 100%; /* Full height */
        box-sizing: border-box;
    }
</style>
