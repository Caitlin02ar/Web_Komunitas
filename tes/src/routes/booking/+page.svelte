<script lang="ts">
// @ts-nocheck
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import CategoryCard from '$lib/component/CategoryCard.svelte';
    import ContactForm from '$lib/component/ContactForm.svelte';
    import OrderDetails from '$lib/component/OrderDetails.svelte';
    import { getJwtToken } from '$lib/js/utils';
	import { error } from '@sveltejs/kit';


    const base_url = import.meta.env.VITE_API_BASE_URL; 
    let eventData = {};
    let eventName = "Loading...";
    let eventCategory = "";
    let bookingInfo = "";
    let selectedDate = "";
    let selectedDay = "";
    let selectTime = "";
    let feeRegistration = "";
    let totalEventPayment = "";
    let totalPayment = "" ;
    let feeRegistrationValue = 0; // Simpan nilai asli
    let totalEventPaymentValue = 0;

    let field1 = "";
    let field2 = "";
    let field3 = "";
    let hasQuestions = false; // Menandakan apakah ada pertanyaan


    const storedCartItem = localStorage.getItem('cartItem');
    let cartItem = null;

    if (storedCartItem) {
        cartItem = JSON.parse(storedCartItem);
        console.log("Retrieved cart item", cartItem);
    }

    /**
	 * @param {{ event_komunitas_id: any; event_id: any; }} cartItem
	 */
    async function fetchEventById(cartItem) {
        const token = getJwtToken();

        if(!token){
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch(`${base_url}/v1/users/komunitas/${cartItem.event_komunitas_id}/event/${cartItem.event_id}`, {
                headers:{
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if(!response.ok){
                throw new Error('Network response was not ok');
            }

            const jsonResponse = await response.json();
            const eventData = jsonResponse.data || {};

            console.log("Data komunitas by event ID", eventData);
            console.log("Nama event", eventData.nama_event);

            eventName = eventData.nama_event || "Loading...";
            feeRegistrationValue = eventData.biaya;
            feeRegistration = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }).format(feeRegistrationValue);

            console.log("fee regist", feeRegistration);
            console.log("Fee Registration Value", feeRegistrationValue);

            fieldPertanyaan1 = eventData.field_pertanyaan_1;
            fieldPertanyaan2 = eventData.field_pertanyaan_2;
            fieldPertanyaan3 = eventData.field_pertanyaan_3;

        // Cek apakah ada pertanyaan
            hasQuestions = fieldPertanyaan1 || fieldPertanyaan2 || fieldPertanyaan3;

            console.log("fee registration:", feeRegistration);
            console.log("Field Pertanyaan 1:", fieldPertanyaan1);
            console.log("Field Pertanyaan 2:", fieldPertanyaan2);
            console.log("Field Pertanyaan 3:", fieldPertanyaan3);

        } catch (error){
            console.error('Error fetching event data', error);
            return null;
        }
    }

    async function fetchCategorybyId(cartItem){
        const token = getJwtToken();

        if(!token){
            console.error('No token found');
            return;
        }
        try {
            const response = await fetch(`${base_url}/v1/users/komunitas/${cartItem.event_komunitas_id}/event/${cartItem.event_id}/eventcategory/${cartItem.event_category_id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if(!response.ok){
                throw new Error('Network response was not ok');
            }
            const jsonResponse = await response.json();
            const categoryData = jsonResponse.data || {};
            console.log("Event category Data:", categoryData);
            eventCategory = categoryData.nama_event_category;

            // const testing = categoryData.price;
            // console.log("Pricee", testing);
            totalEventPaymentValue = categoryData.price;
            totalEventPayment = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }).format(totalEventPaymentValue);



            console.log("total event payment", totalEventPayment);
            console.log("Total Event Payment Value", totalEventPaymentValue);
        
        } catch(error){
            console.error('Error fetching event data', error);
            return null;
        }
    }

    async function fetchSessionbyId(cartItem){
        const token = getJwtToken();

        if(!token){
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch(`${base_url}/v1/users/komunitas/${cartItem.event_komunitas_id}/event/${cartItem.event_id}/eventcategory/${cartItem.event_category_id}/eventsession/${cartItem.event_session_id}`,{
                headers:{
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if(!response.ok){
                throw new Error('Network response was not ok');
            }

            const jsonResponse = await response.json();
            const eventSession = jsonResponse.data || {};
            console.log("Event session", eventSession);
            bookingInfo = calculateDate(eventSession.tgl_mulai, eventSession.tgl_selesai);
            console.log("Booking infooo" , bookingInfo);

            const isToString = eventSession.tgl_mulai;
            const date = new Date(isToString);
            selectedDate = date.toLocaleDateString();
            console.log("Selected Start Date", selectedDate);

            const dates = new Date(selectedDate);
            const dayOfWeek = dates.getDay(); 

            const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];
            selectedDay = days[dayOfWeek];

            console.log("Day of the week:", selectedDay);

            const tglMulai = eventSession.tgl_mulai;
            const tglSelesai = eventSession.tgl_selesai;

            const startDateNew = new Date(tglMulai);
            const endDateNew = new Date(tglSelesai);

            const startHours = startDateNew.getHours() - 7;
            const startMinutes = startDateNew.getMinutes();
            const endHours = endDateNew.getHours() - 7;
            const endMinutes = endDateNew.getMinutes();

            const startTime = `${startHours < 10 ? '0' + startHours : startHours}.${startMinutes < 10 ? '0' + startMinutes : startMinutes}.00`;
            const endTime = `${endHours < 10 ? '0' + endHours : endHours}.${endMinutes < 10 ? '0' + endMinutes : endMinutes}.00`;

            const formattedTimeRange = `${startTime.substring(0, 5)} - ${endTime.substring(0, 5)}`; 

            console.log("Formatted timerange:", formattedTimeRange);
            selectTime = formattedTimeRange;
            


        } catch(error) {
            console.error('Error fetching event data', error);
            return null;
        }
    }

    function calculateDate(startDate, endDate){
        const start = new Date(startDate);
        const end = new Date(endDate);

        const differentTime = end - start;
        const bookingInfo = differentTime / (1000 * 3600 * 24);

        return bookingInfo;
    }
    
        function calculateTotalPayment() {
        const totalPaymentValue = Number(feeRegistrationValue) + Number(totalEventPaymentValue); // Jumlahkan nilai asli
        totalPayment = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(totalPaymentValue); // Format untuk ditampilkan

        console.log("Fee Regist bagian calculate", feeRegistrationValue);
        console.log("Total payment", totalPayment);
    }

    function detailPayment() {
        if (!field1 || !field2 || !field3) {
            alert("Please fill out all required fields before proceeding.");
            return;
        }
        localStorage.setItem('contactField1', field1);
        localStorage.setItem('contactField2', field2);
        localStorage.setItem('contactField3', field3);
        localStorage.setItem('totalPayment', totalPayment.toString());
        goto('/paymentDetail'); // Arahkan ke halaman detailPayment
    }
    
    function clearLocalStorage(){
        localStorage.removeItem('selectedEvent');
        localStorage.removeItem('selectedCategories');
        localStorage.removeItem('completeCategories');
        localStorage.removeItem('cartItem');
        localStorage.removeItem('selectedCartIds');
        localStorage.removeItem('totalPayment');
        goto('/cart');
    }

    async function fetchData(cartItem) {
        await fetchEventById(cartItem);
        await fetchCategorybyId(cartItem);
        await fetchSessionbyId(cartItem);
        calculateTotalPayment();
    }

    // Panggil `fetchData` saat komponen dimuat
    onMount(async () => {
        if (cartItem) {
            await fetchData(cartItem);
        }
    });
</script>


<div class="form-and-details-container">
    <div class="form-container">
        <!-- ContactForm component -->
        <ContactForm
            title="Contact Details"
            instruction=""
            field1Label="Full Name"
            field2Label="Email"
            field3Label="Phone Number"
            field1Placeholder="Full Name"
            field2Placeholder="Email"
            field3Placeholder="+62"
            isFieldsEmpty={false}
            bind:field1={field1}
            bind:field2={field2}  
            bind:field3={field3} 
        />
        {#if hasQuestions}
            <ContactForm
            title="Order Details"
                instruction="Please fill out the form below correctly to complete the registration requirements for this event."
                field1Label={field1}
                field2Label={field2}
                field3Label={field3}
                field1Placeholder={field1}
                field2Placeholder={field2}
                field3Placeholder={field3}
            />
        {:else}
            <ContactForm
                title="Order Details"
                isFieldsEmpty={true}
            />
        {/if}
    </div>

    <div class="details-container">
        <!-- svelte-ignore missing-declaration -->
        <OrderDetails
            title="Order Details"
            detailLinkText="Details"
            eventName={eventName} 
            eventCategory = {eventCategory}
            bookingInfo={bookingInfo.toString()}
            selectedDate={selectedDate}
            selectedDay={selectedDay}
            selectedTime={selectTime}
            feeRegistration={feeRegistration} 
            totalEventPayment={totalEventPayment}
            totalPayment={totalPayment}
        />
    </div>
</div>

<div class="confirm-registration">
    <button class="cancel-btn" on:click={clearLocalStorage}>Cancel</button>
    <button type="button" on:click={detailPayment} class="confirm-btn">Confirm Registration</button>
</div>
<style>
    .form-and-details-container {
        display: flex;
        justify-content: space-between;
        gap: 20px;
        margin: 20px;
    }

    .form-container {
        flex: 2;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .details-container {
        flex: 1;
    }

    .confirm-registration {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
        gap: 12px;
    }

    .confirm-btn {
        background-color: #FFA949;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
    }

    .cancel-btn {
        background-color: #afadad;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
    }
    .cancel-btn:hover {
        background-color: #949292;
    }

    .confirm-btn:hover {
        background-color: #ff9041;
    }
</style>
