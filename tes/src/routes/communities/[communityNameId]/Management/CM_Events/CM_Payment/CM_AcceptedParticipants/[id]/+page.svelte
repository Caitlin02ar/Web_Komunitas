<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import Modal from '$lib/component/Modal.svelte'; // Import modal component
  import { getJwtToken, getUserId, extractIdFromUrl } from '$lib/js/utils';
  import { page } from '$app/stores';

  const columns = ['No', 'No Invoice', 'Participant Name', 'Gender', 'Whatsapp Number', 'Category Type', 'Payment Detail', 'Participant Information'];
  let rows = [];
  let communityNameId = $page.params.communityNameId;
  let eventId = $page.params.id;
  let isLoading = false; // State to control loading UI
  let selectedPaymentDetail = null; // State to store selected payment detail
  let showPaymentModal = false; // State to control modal visibility
  let selectedParticipantDetail = null; // State to store selected participant detail
  let showParticipantModal = false; // State to control modal visibility
  let currentPage = 1;
  let pageSize = 10;
  let sortColumn = '';
  let sortAsc = true;

  onMount(async () => {
    isLoading = true; // Start loading

    try {
            const token = getJwtToken();
            const userId = getUserId();
            communityNameId = extractIdFromUrl(window.location.href);
            console.log('JWT Token:', token);

            if (!token) {
                console.error('Authentication token not found.');
                return;
            }

      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${communityNameId}/event/${eventId}/pesertastatus?page=0&pageSize=0&status=terima`;

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok && data.status === 200) {
        rows = data.data.map((peserta, index) => [
          index + 1, // No
          peserta.invoice, // No Invoice
          peserta.User.nama_user, // Participant Name
          peserta.User.jenis_kelamin === 'P' ? 'Female' : 'Male', // Gender
          peserta.User.no_telpon, // Whatsapp Number
          peserta.peserta_event_detail[0].EventCategory.nama_event_category, // Category Type
          peserta, // Store payment detail object for modal
          peserta // Store participant detail object for modal
        ]);
      } else {
        console.error(`Failed to fetch participants: ${data.message}`);
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
    } finally {
      isLoading = false; // Stop loading
    }
  });

  function handlePaymentDetail(paymentDetail) {
    selectedPaymentDetail = paymentDetail;
    showPaymentModal = true;
  }

  function handleParticipantDetail(participantDetail) {
    selectedParticipantDetail = participantDetail;
    showParticipantModal = true;
  }

  function closeModal() {
    showPaymentModal = false;
    showParticipantModal = false;
  }

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

</script>

<main>
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

  <div class="mb-6">
    <table class="min-w-full bg-white">
      <thead>
        <tr class="bg-header text-white">
          {#each columns as column}
            <th class="py-2 px-4 border-b text-left cursor-pointer" on:click={() => sortBy(column)}>
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
        {#each paginatedRows as row}
          <tr class="hover:bg-gray-100">
            {#each row as cell, j}
              <td class="py-2 px-4 border-b text-left">
                {#if columns[j] === 'Payment Detail'}
                  <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full" on:click={() => handlePaymentDetail(row[6])}>
                    Payment Detail
                  </button>
                {:else if columns[j] === 'Participant Information'}
                  <button class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-700 w-full" on:click={() => handleParticipantDetail(row[7])}>
                    Participant Detail
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

  <!-- Pagination -->
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

  <!-- Payment Detail Modal -->
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

  <!-- Participant Detail Modal -->
  <Modal show={showParticipantModal} title="Participant Detail" onClose={closeModal}>
    {#if selectedParticipantDetail}
      <p><strong>Answer Question 1</strong></p>
      <div class="border p-2 rounded mb-4">{selectedParticipantDetail.jawaban_field_1 || 'No answer'}</div>
      <p><strong>Answer Question 2</strong></p>
      <div class="border p-2 rounded mb-4">{selectedParticipantDetail.jawaban_field_2 || 'No answer'}</div>
      <p><strong>Answer Question 3</strong></p>
      <div class="border p-2 rounded mb-4">{selectedParticipantDetail.jawaban_field_3 || 'No answer'}</div>
    {/if}
  </Modal>
</main>

<style>
  .bg-header {
    background-color: #A9CED6;
  }

  .rounded {
    border-radius: 0.375rem;
  }

  .w-full {
    width: 100%;
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

  .bg-orange-500 {
    background-color: #f97316;
  }

  .bg-orange-700 {
    background-color: #FA7D09;
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

  .hover\:bg-gray-100:hover {
    background-color: #f7fafc;
  }

  th, td {
    padding: 8px 12px;
    border-bottom: 1px solid #ddd;
    text-align: left;
    white-space: nowrap; /* Prevent text wrapping */
  }

  th {
    font-weight: bold;
  }

  .border {
    border: 1px solid #000000;
  }

  .p-2 {
    padding: 0.5rem;
  }

  .mb-4 {
    margin-bottom: 1rem;
  }

  .flex {
    display: flex;
  }

  .justify-between {
    justify-content: space-between;
  }

  .items-center {
    align-items: center;
  }

  .space-x-2 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-right: calc(0.5rem * var(--tw-space-x-reverse));
    margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));
  }

  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
</style>
