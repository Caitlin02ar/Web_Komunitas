<script lang="ts">
	import { goto } from '$app/navigation';
    import PaymentDetail from '$lib/component/PaymentDetail.svelte';
    import TransferSlip from '$lib/component/TransferSlip.svelte';
    import { getJwtToken, getUserId, getAnggotaKomunitasId, extractIdFromUrl } from '$lib/js/utils';
    import { onMount } from 'svelte';

    const base_url = import.meta.env.VITE_API_BASE_URL;

    let eventName = "";
    let eventType = "";
    let eventDate = "";
    let total = "";
    let customerName = "";
    let isFileUploaded = false;
    let filePath = "";
    let pesertaEventData: any = {}; // Define with default structure
    let selectedFile: File | null = null;

    const userId = getUserId();

    const storedCartItem = localStorage.getItem('cartItem');
    const totalPayment = localStorage.getItem('totalPayment');
    let cartItem: any = null;

    
    if (storedCartItem) {
        cartItem = JSON.parse(storedCartItem);
        console.log("Retrieved cart item in payment detail", cartItem);
    }

    if (totalPayment) {
        total = totalPayment;
    }

    async function userData(userId: any) {
        const token = getJwtToken();
        if (!token) return;

        try {
            const response = await fetch(`${base_url}/v1/users/user/${userId}`, {
                headers: 
                { 'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' },
            });
            const jsonResponse = await response.json();
            customerName = jsonResponse.data?.nama_user || "";
        } catch (error) {
            console.error('Error fetching user data', error);
        }
    }

    async function anggotaKomunitas(userId: any) {
    const token = getJwtToken();
    if (!token) {
        console.error("No token found");
        return null; // Return null if no token
    }

    try {
        const response = await fetch(`${base_url}/v1/users/komunitas/1/anggotabyuser?userid=${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        // Log the response status and the response itself
        console.log('Response Status:', response.status);
        console.log('Response:', response);

        // Parse the response to JSON
        const jsonResponse = await response.json();
        
        // Log the JSON response to see its structure
        console.log('JSON Response:', jsonResponse);
        
        // Check if the response contains the expected data
        if (jsonResponse.data && Array.isArray(jsonResponse.data) && jsonResponse.data.length > 0) {
            const anggKomunitas = jsonResponse.data[0].id; // Get the ID of the first member in the array
            console.log('Anggota Komunitas ID:', anggKomunitas);
            return anggKomunitas; // Return the ID
        } else {
            console.error('ID not found in response data');
            return null; // Return null if ID is not found
        }
    } catch (error) {
        console.error('Error fetching data', error);
        return null; // Return null in case of error
    }
}



    async function fetchEventById(cartItem: any) {
        const token = getJwtToken();
        if (!token) return;

        try {
            const response = await fetch(`${base_url}/v1/users/komunitas/${cartItem.event_komunitas_id}/event/${cartItem.event_id}`, {
                headers: { 'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' },
            });
            const jsonResponse = await response.json();
            eventName = jsonResponse.data?.nama_event || "";
            eventDate = new Date(jsonResponse.data?.tgl_mulai_kegiatan || "").toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
        } catch (error) {
            console.error("Error fetching event data", error);
        }
    }

    async function fetchCategorybyId(cartItem: any) {
        const token = getJwtToken();
        if (!token) return;

        try {
            const response = await fetch(`${base_url}/v1/users/komunitas/${cartItem.event_komunitas_id}/event/${cartItem.event_id}/eventcategory/${cartItem.event_category_id}`, {
                headers: { 'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' },
            });
            const jsonResponse = await response.json();
            eventType = jsonResponse.data?.nama_event_category || "";
        } catch (error) {
            console.error('Error fetching event category', error);
        }
    }


    async function sendEventPeserta() {
    const token = getJwtToken();
    if (!token || !cartItem) return;

    const komunitasId = cartItem.event_komunitas_id;
    const anggotaKomunitasId = await anggotaKomunitas(userId);

    console.log("Komunitas ID:", komunitasId);
    console.log("Anggota Komunitas ID:", anggotaKomunitasId);

    const pesertaEventData = {
        if_panitia: "0",
        status_pembayaran: "baru",
        tgl_bayar: new Date().toISOString().split('T')[0],
        jawaban_field_1: "-",
        jawaban_field_2: "-",
        jawaban_field_3: "-",
        event_id: cartItem.event_id,
        anggota_komunitas_id: anggotaKomunitasId,
        sub_total: 10,
        total_qty: 20,
        total: 200,
        peserta_event_detail: [
            {
                kode_peserta: "a",
                sub_total: 100,
                qty: 10,
                event_category_id: cartItem.event_category_id,
                event_session_id: cartItem.event_session_id,
            }
        ]
    };

    const sendURL = `${base_url}/v1/users/komunitas/${komunitasId}/event/${cartItem.event_id}/peserta`;

    try {
        // Step 1: Register the participant
        const response = await fetch(sendURL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pesertaEventData),
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();
        console.log("Peserta Response:", result);

        // Step 2: Get the ID of the registered participant
        const pesertaId = result.data.id; // Ensure this is correct based on your API response structure

        // Step 3: Check if registration was successful
        if (pesertaId) {
            // Registration is successful, now upload payment receipt if a file is selected
            if (selectedFile) { // Ensure a file is selected for upload
                await uploadBuktiPembayaran(selectedFile, pesertaId);
            } else {
                console.log("No file selected for upload.");
            }
            alert("Participant registered successfully. Payment confirmation is awaited.");
        } else {
            alert("Failed to register participant. Please try again.");
        }
    } catch (error) {
        console.error("Error sending event data", error);
        alert("An error occurred while registering for the event.");
    }
}


async function uploadBuktiPembayaran(file: File | null, pesertaId: string | null) {
    console.log("User id", pesertaId);
    if (!file) {
        console.error("No file provided for upload");
        return; // Tidak melanjutkan jika file adalah null
    }

    const komunitas_id = cartItem.event_komunitas_id;
    const event_id_komunitas = cartItem.event_id;
    const token = getJwtToken();
    const anggotaKomunitasId =  await anggotaKomunitas(userId);    
    console.log("Anggota", anggotaKomunitasId);

    if (!komunitas_id || !token) return;

    const formdata = new FormData();
    
    // Pastikan file tidak null sebelum menambahkannya ke formdata
    formdata.append("foto", file); // file sudah terjamin bukan null di sini

    const uploadURL = `${base_url}/v1/users/komunitas/${komunitas_id}/event/${event_id_komunitas}/pesertauploadbukti/${pesertaId}`;

    try {
        const response = await fetch(uploadURL, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formdata
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorResponse.message}`);
        }

        const result = await response.json();
        if (result.filePath) {
            filePath = `public/uploads/foto_buktibayar_event/${result.filePath}`;
        }
    } catch (error) {
        console.error("Error uploading payment proof", error);
    }
}
    function handleConfirm() {
        if (!selectedFile) {
            alert("No file selected for payment proof");
            return;
        }
        // Pastikan selectedFile adalah tipe File
        sendEventPeserta().catch(error => {
            console.error("Error during confirmation", error);
            alert("Error during payment confirmation. Please try again.");
        });
    }
    function handleFileSelected(event: CustomEvent<File>){
        selectedFile = event.detail;
        isFileUploaded = true;
        alert("File selected successfully");
        console.log("File", filePath);
    }

    function handleCancel() {
        // Handle the cancel logic here
        // alert('Cancelled');
        localStorage.removeItem('totalPayment');
        localStorage.removeItem('contactField1');
        localStorage.removeItem('contactField2');
        localStorage.removeItem('contactField3');
        goto('booking');
    }

    onMount(async () => {
        if (cartItem) {
            await fetchEventById(cartItem);
            await fetchCategorybyId(cartItem);
            await userData(userId);
            await anggotaKomunitas(userId);
        }
    });
</script>


<main class="content">
    <!-- Use the PaymentDetail component -->
    <PaymentDetail
        title="Payment Detail"
        eventName={eventName}
        eventType={eventType}
        eventDate={eventDate}
        total={total}
        customerName={customerName}
    />
    <TransferSlip on:fileSelected={handleFileSelected} />
</main>

<div class="button-group">
    <button class="cancel-button" on:click={handleCancel}>Cancel</button>
    <button class="confirm-button" on:click={handleConfirm} disabled={!isFileUploaded}>Confirm (isFileUploaded: {isFileUploaded.toString()})</button>
</div>

<style>
    .content {
        display: flex;
        justify-content: space-between;
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
    }

    .button-group {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 20px;
    }

    .cancel-button, .confirm-button {
        padding: 7px 30px;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        border: none;
    }

    .cancel-button {
        background-color: #ff4d4d;
        color: white;
    }

    .confirm-button {
        background-color: #007bff;
        color: white;
    }
    .confirm-button:disabled{
        background-color: gray;
        color: lightgray;
        cursor: not-allowed;
        
    }
    .confirm-button:disabled:hover{
        background-color: gray;
    }

    .cancel-button:hover {
        background-color: #e60000;
    }

    .confirm-button:hover {
        background-color: #0056b3;
    }
</style>