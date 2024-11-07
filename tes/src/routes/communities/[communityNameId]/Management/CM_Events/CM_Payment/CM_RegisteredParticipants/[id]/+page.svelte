<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { getJwtToken, getUserId, extractIdFromUrl } from '$lib/js/utils';
  import { page } from '$app/stores';
  import ModalSuccess from '$lib/component/ModalSuccess.svelte';

  const columns = ['No Invoice', 'Participant Name', 'Payment Date', 'Payment Detail', 'Participant Information', 'Action'];
  let rows = [];
  let communityNameId = $page.params.communityNameId;
  let eventId = $page.params.id;
  let isLoading = false;
  let selectedPaymentDetail = null;
  let selectedParticipantDetail = null;
  let currentPage = 1;
  let pageSize = 10;
  let sortColumn = '';
  let sortAsc = true;

  let showConfirmModal = false;
  let showRefuseModal = false;
  let showRefundModal = false;
  let selectedParticipantId = null;

  let showSuccessModal = false;
  let successMessage = '';

  function handleConfirm(participantId) {
    selectedParticipantId = participantId;
    showConfirmModal = true;
  }

  function handleRefuse(participantId) {
    selectedParticipantId = participantId;
    showRefuseModal = true;
  }

  function handleRefund(participantId) {
    selectedParticipantId = participantId;
    showRefundModal = true;
  }

  function closeModal() {
    showConfirmModal = false;
    showRefuseModal = false;
    showRefundModal = false;
  }

  async function updatePaymentStatus(status) {
    const token = getJwtToken();
    const apiUrl = `http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityNameId}/event/${eventId}/peserta/update/${selectedParticipantId}`;
    try {
    const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status_pembayaran: status }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to update payment status:', errorData);
        throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Payment status updated:', data);
} catch (error) {
    console.error('Error updating payment status:', error);
}

  }

  async function confirmPayment() {
    await updatePaymentStatus('terima');
  }

  async function refusePayment() {
    await updatePaymentStatus('tolak');
  }

  async function refundPayment() {
    await updatePaymentStatus('refund');
  }

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

      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${communityNameId}/event/${eventId}/pesertastatus?page=0&pageSize=0&status=baru`;

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok && data.status === 200) {
        rows = data.data.map((peserta, index) => [
          peserta.invoice, 
          peserta.User.nama_user, 
          new Date(peserta.tgl_bayar).toLocaleDateString(), 
          peserta, 
          peserta, 
          peserta.id 
        ]);
      } else {
        console.error(`Failed to fetch participants: ${data.message}`);
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
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

  function handlePaymentDetail(paymentDetail) {
    selectedPaymentDetail = paymentDetail;
  }

  function handleParticipantDetail(participantDetail) {
    selectedParticipantDetail = participantDetail;
  }
</script>

<main>
  <div class="flex justify-end items-center mb-4">
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

  <div class="mb-6">
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
                  <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full" on:click={() => handlePaymentDetail(row[3])}>
                    Payment Detail
                  </button>
                {:else if columns[j] === 'Participant Information'}
                  <button class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-700 w-full" on:click={() => handleParticipantDetail(row[4])}>
                    Participant Detail
                  </button>
                {:else if columns[j] === 'Action'}
                  <div class="flex space-x-2 justify-center">
                    <button class="bg-green-500 text-white w-10 h-10 flex items-center justify-center rounded-md" on:click={() => handleConfirm(row[5])}>
                      <img src="/src/lib/images/centang-putih.svg" alt="Accept" class="w-6 h-6" />
                    </button>
                    <button class="bg-red-500 text-white w-10 h-10 flex items-center justify-center rounded-md" on:click={() => handleRefuse(row[5])}>
                      <img src="/src/lib/images/silang-putih.svg" alt="Reject" class="w-6 h-6" />
                    </button>
                    <button class="bg-orange-500 text-white w-10 h-10 flex items-center justify-center rounded-md" on:click={() => handleRefund(row[5])}>
                      <img src="/src/lib/images/refund-putih.svg" alt="Refund" class="w-6 h-6" />
                    </button>
                  </div>
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

  <!-- Confirm Modal -->
  {#if showConfirmModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="bg-white rounded shadow-lg p-6 w-full max-w-md text-center">
      <img src="/src/lib/images/warning-kuning.svg" alt="Warning" class="mx-auto w-12 h-12" />
      <h2 class="text-xl font-bold mt-4">Confirmation</h2>
      <p class="mt-4">Are you sure you want to confirm this payment?</p>
      <div class="flex justify-center space-x-2 mt-6">
        <button class="btn-cancel" on:click={closeModal}>Cancel</button>
        <button class="btn-confirm" on:click={confirmPayment}>Yes, Confirmation</button>
      </div>
    </div>
  </div>
  {/if}

  <!-- Refuse Modal -->
  {#if showRefuseModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="bg-white rounded shadow-lg p-6 w-full max-w-md text-center">
      <img src="/src/lib/images/warning-merah.svg" alt="Warning" class="mx-auto w-12 h-12" />
      <h2 class="text-xl font-bold mt-4">Refuse Payment</h2>
      <p class="mt-4">Are you sure you want to refuse this payment?</p>
      <p class="mt-2 text-red-500 text-sm">This action cannot be undone.</p>
      <div class="flex justify-center space-x-2 mt-6">
        <button class="btn-cancel" on:click={closeModal}>Cancel</button>
        <button class="btn-refuse" on:click={refusePayment}>Yes, refuse</button>
      </div>
    </div>
  </div>
  {/if}

  <!-- Refund Modal -->
  {#if showRefundModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="bg-white rounded shadow-lg p-6 w-full max-w-md text-center">
      <img src="/src/lib/images/refund-kuning.svg" alt="Refund" class="mx-auto w-12 h-12" />
      <h2 class="text-xl font-bold mt-4">Refund Payment</h2>
      <p class="mt-4">Are you sure you want to refund this payment?</p>
      <p class="mt-2 text-red-500 text-sm">This action cannot be undone.</p>
      <div class="flex justify-center space-x-2 mt-6">
        <button class="btn-cancel" on:click={closeModal}>Cancel</button>
        <button class="btn-refund" on:click={refundPayment}>Yes, refund</button>
      </div>
    </div>
  </div>
  {/if}

  <!-- Success Modal -->
  <ModalSuccess {showSuccessModal} successMessage={successMessage} />
</main>

<style>
  .bg-header {
    background-color: #A9CED6;
  }

  .rounded {
    border-radius: 0.375rem;
  }

  .rounded-md {
    border-radius: 0.375rem;
  }

  .w-10, .h-10 {
    width: 2.5rem;
    height: 2.5rem;
  }

  .w-6, .h-6 {
    width: 1.5rem;
    height: 1.5rem;
  }

  .bg-orange-500 {
    background-color: #f97316;
  }

  .bg-orange-700 {
    background-color: #FA7D09;
  }

  .bg-green-500 {
    background-color: #10b981;
  }

  .bg-red-500 {
    background-color: #ef4444;
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

  .space-x-2 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-right: calc(0.5rem * var(--tw-space-x-reverse));
    margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 8px 12px;
    border-bottom: 1px solid #ddd;
    text-align: left;
  }

  .hover\:bg-gray-100:hover {
    background-color: #f7fafc;
  }

  .fixed {
    position: fixed;
  }

  .inset-0 {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .z-50 {
    z-index: 50;
  }

  .max-w-md {
    max-width: 28rem;
  }

  .p-6 {
    padding: 1.5rem;
  }

  .w-full {
    width: 100%;
  }

  .text-xl {
    font-size: 1.25rem;
  }

  .font-bold {
    font-weight: 700;
  }

  .shadow-lg {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  }

  .mt-4 {
    margin-top: 1rem;
  }

  .mt-6 {
    margin-top: 1.5rem;
  }

  .text-sm {
    font-size: 0.875rem;
  }

  .text-red-500 {
    color: #ef4444;
  }

  .justify-end {
    justify-content: flex-end;
  }

  .bg-white {
    background-color: #ffffff;
  }

  .border {
    border: 1px solid #ddd;
  }

  .px-2 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .py-1 {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
  }

  .rounded {
    border-radius: 0.375rem;
  }

  .mx-auto {
    margin-left: auto;
    margin-right: auto;
  }

  .w-12 {
    width: 3rem;
  }

  .h-12 {
    height: 3rem;
  }

  .text-center {
    text-align: center;
  }

  /* Button styles */
  .btn-cancel {
    background-color: #6c757d;
    color: #ffffff;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
  }
  .btn-cancel:hover {
    background-color: #5a6268;
  }

  .btn-confirm, .btn-refund {
    background-color: #f97316;
    color: #ffffff;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
  }
  .btn-confirm:hover, .btn-refund:hover {
    background-color: #d35605;
  }

  .btn-refuse {
    background-color: #ef4444;
    color: #ffffff;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
  }
  .btn-refuse:hover {
    background-color: #cc3636;
  }

  /* Create Polling button */
  .btn-create {
    background-color: #000;
    color: #fff;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
  }
  .btn-create:hover {
    background-color: #f97316;
  }
</style>
