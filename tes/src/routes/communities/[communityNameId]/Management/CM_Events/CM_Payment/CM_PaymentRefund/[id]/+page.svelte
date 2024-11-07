<script>
    // @ts-nocheck
    import { onMount } from 'svelte';
    import Modal from '$lib/component/Modal.svelte';
    import { getJwtToken, getUserId, extractIdFromUrl } from '$lib/js/utils';
    import { page } from '$app/stores';
    import refundIcon from '$lib/images/refund-kuning.svg'

    let columns = ['No Invoice', 'Participant Name', 'Gender', 'Whatsapp Number', 'Category Type', 'Payment Detail', 'Action'];
    let rows = [];
    let communityNameId = $page.params.communityNameId;
    let eventId = $page.params.id;
    let isLoading = false;
    let selectedPaymentDetail = null;
    let showPaymentModal = false;
    let showConfirmModal = false;
    let selectedRefundId = null;
    let currentPage = 1;
    let pageSize = 10;
    let sortColumn = '';
    let sortAsc = true;

    onMount(async () => {
        isLoading = true;

        try {
            const token = getJwtToken();
            const userId = getUserId();
            communityNameId = extractIdFromUrl(window.location.href);
            console.log('JWT Token:', token);

            if (!token) {
                console.error('Authentication token not found.');
                return;
            }

            const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${communityNameId}/event/${eventId}/pesertastatus?page=0&pageSize=0&status=refund`;

            const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok && data.status === 200) {
                rows = data.data.map((peserta) => [
                    peserta.invoice, // No Invoice
                    peserta.User.nama_user, // Participant Name
                    peserta.User.jenis_kelamin === 'P' ? 'Female' : 'Male', // Gender
                    peserta.User.no_telpon, // Whatsapp Number
                    peserta.peserta_event_detail[0].EventCategory.nama_event_category, // Category Type
                    peserta, // Pass full participant data for Payment Detail
                    peserta.id // ID for actions
                ]);
            } else {
                console.error(`Failed to fetch refund participants: ${data.message}`);
            }
        } catch (error) {
            console.error('Error fetching refund participants:', error);
        } finally {
            isLoading = false;
        }
    });

    function handlePageSizeChange(event) {
        pageSize = +event.target.value;
        currentPage = 1;
    }

    function sortBy(column) {
        if (sortColumn === column) {
            sortAsc = !sortAsc;
        } else {
            sortColumn = column;
            sortAsc = true;
        }
    }

    $: sortedRows = [...rows].sort((a, b) => {
        const index = columns.indexOf(sortColumn);
        if (a[index] < b[index]) return sortAsc ? -1 : 1;
        if (a[index] > b[index]) return sortAsc ? 1 : -1;
        return 0;
    });

    $: paginatedRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    function handlePaymentDetail(participantData) {
        selectedPaymentDetail = participantData;
        showPaymentModal = true;
    }

    function closeModal() {
        showPaymentModal = false;
        showConfirmModal = false;
    }

    function handleConfirmRefund(id) {
        selectedRefundId = id;
        showConfirmModal = true;
    }

    async function confirmRefund() {
        const token = getJwtToken();
        if (!token) {
            console.error('Authentication token not found.');
            return;
        }
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${communityNameId}/event/${eventId}/peserta/delete/${selectedRefundId}`;
        try {
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                console.log(`Refund completed for ID: ${selectedRefundId}`);
                // Remove the row from the rows array
                rows = rows.filter((row) => row[6] !== selectedRefundId);
            } else {
                const errorData = await response.json();
                console.error('Failed to complete refund:', errorData.message);
            }
        } catch (error) {
            console.error('Error during the refund process:', error);
        } finally {
            showConfirmModal = false;
        }
    }

    function closeConfirmModal() {
        showConfirmModal = false;
    }
</script>

<div class="overflow-x-auto">
    <div class="flex justify-between items-center mb-4">
        <div class="flex items-center space-x-2">
            <!-- Additional buttons can be slotted here -->
        </div>
        <div class="flex items-center space-x-2">
            <span>Show</span>
            <select class="border px-2 py-1 rounded" on:change={handlePageSizeChange}>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
            <span>entries</span>
        </div>
    </div>

    <table class="min-w-full bg-white">
        <thead>
            <tr class="bg-header text-white">
                <th class="py-2 px-4 border-b text-left">No</th>
                {#each columns as column}
                    <th class="py-2 px-4 border-b cursor-pointer text-left" on:click={() => sortBy(column)}>
                        {column}
                        {#if sortColumn === column}
                            {#if sortAsc}
                                <span>&uarr;</span>
                            {:else}
                                <span>&darr;</span>
                            {/if}
                        {/if}
                    </th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each paginatedRows as row, i}
                <tr class="hover:bg-gray-100">
                    <td class="py-2 px-4 border-b text-left">{(currentPage - 1) * pageSize + i + 1}</td>
                    {#each row as cell, j}
                        <td class="py-2 px-4 border-b text-left">
                            {#if columns[j] === 'Payment Detail'}
                                <button class="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-700" on:click={() => handlePaymentDetail(row[5])}>
                                    Payment Detail
                                </button>
                            {:else if columns[j] === 'Action'}
                                <button class="bg-green-500 text-white w-10 h-10 rounded-md hover:bg-green-700 flex justify-center items-center" on:click={() => handleConfirmRefund(row[6])}>
                                    <img src="/src/lib/images/centang-putih.svg" alt="Confirm" class="w-6 h-6" />
                                </button>
                            {:else}
                                {cell}
                            {/if}
                        </td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<div class="mt-4 flex justify-between items-center">
    <span>Showing {((currentPage - 1) * pageSize + 1)} to {Math.min(currentPage * pageSize, rows.length)} of {rows.length} entries</span>
    <div>
        <button class="px-4 py-2 border" on:click={() => currentPage > 1 && (currentPage -= 1)}>Previous</button>
        {#each Array(Math.ceil(rows.length / pageSize)) as _, index}
            <button class="px-4 py-2 border" on:click={() => currentPage = index + 1}>{index + 1}</button>
        {/each}
        <button class="px-4 py-2 border" on:click={() => currentPage < Math.ceil(rows.length / pageSize) && (currentPage += 1)}>Next</button>
    </div>
</div>

<Modal show={showPaymentModal} title="Payment Detail" onClose={closeModal}>
    {#if selectedPaymentDetail}
        <p><strong>Payment Number:</strong> {selectedPaymentDetail.invoice}</p>
        <p><strong>Payer Name:</strong> {selectedPaymentDetail.User.nama_user}</p>
        <p><strong>Payment Date:</strong> {new Date(selectedPaymentDetail.tgl_bayar).toLocaleDateString()}</p>

        <div class="mt-4">
            <h3 class="text-lg font-semibold">Event Detail</h3>
            {#each selectedPaymentDetail.peserta_event_detail as detail}
                <p><strong>Event Category:</strong> {detail.EventCategory.nama_event_category}</p>
                <p><strong>Event Date:</strong> {new Date(detail.EventSession.tgl_mulai).toLocaleDateString()} - {new Date(detail.EventSession.tgl_selesai).toLocaleDateString()}</p>
            {/each}
        </div>

        <div class="mt-4">
            <h3 class="text-lg font-semibold">Proof of Payment</h3>
            <img src={`${import.meta.env.VITE_API_BASE_URL}/${selectedPaymentDetail.bukti_bayar}`} alt="Proof of Payment" class="mt-2 max-w-full h-auto" />
        </div>
    {/if}
</Modal>

<Modal show={showConfirmModal} onClose={closeConfirmModal} title="Refund Payment">
    <div class="flex flex-col items-center">
        <img src={refundIcon} alt="Refund Icon" class="mb-2 w-10 h-10" />
        <p>Are you sure you want to refund this payment?</p>
        <p class="warning-text"><em>This action cannot be irreversible</em></p>
        <div class="flex justify-center space-x-4 mt-4">
            <button class="cancel-button" on:click={closeConfirmModal}>Cancel</button>
            <button class="confirm-button" on:click={confirmRefund}>Yes, refund</button>
        </div>
    </div>
</Modal>

<style>
    .bg-header {
        background-color: #A9CED6;
    }
    th, td {
        text-align: left;
    }
    .w-full {
        width: 100%;
    }
    .w-10 {
        width: 2.5rem;
    }
    .h-10 {
        height: 2.5rem;
    }
    .px-4 {
        padding-left: 1rem;
        padding-right: 1rem;
    }
    .py-2 {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
    }
    .bg-blue-500 {
        background-color: #3b82f6;
    }
    .bg-blue-700 {
        background-color: #006BDF;
    }
    .bg-green-500 {
        background-color: #10b981;
    }
    .bg-green-700 {
        background-color: #059669;
    }
    .text-white {
        color: white;
    }
    .flex {
        display: flex;
    }
    .items-center {
        align-items: center;
    }
    .justify-center {
        justify-content: center;
    }
    .hover\:bg-gray-100:hover {
        background-color: #f7fafc;
    }
    .cursor-pointer {
        cursor: pointer;
    }
    .rounded-md {
        border-radius: 0.375rem;
    }
    .cancel-button {
        background-color: #e7e7e7;
        color: black;
        padding: 8px 16px;
        border-radius: 5px;
        cursor: pointer;
    }
    .cancel-button:hover{
        background-color: #cecece;
    }
    .confirm-button {
        background-color: white;
        color: black;
        padding: 8px 16px;
        border: 2px solid orange;
        border-radius: 5px;
        cursor: pointer;
    }
    .confirm-button:hover {
        background-color: orange;
        color: white;
    }
    .warning-text {
        color: red;
        font-style: italic;
        margin-top: 0.5rem;
    }
</style>
