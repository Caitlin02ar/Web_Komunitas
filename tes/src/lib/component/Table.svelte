<script>
  // @ts-nocheck
  import Aksi from '$lib/component/Aksi.svelte';
  
  export let columns = [];
  export let rows = [];
  export let actions = [];
  export let currentPage = 1;
  export let pageSize = 10;
  let sortColumn = '';
  let sortAsc = true;

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

<div class="overflow-x-auto">
  <div class="flex justify-between items-center mb-4">
    <div class="flex items-center space-x-2">
      <slot name="buttons"></slot>
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
              {#if columns[j] === 'Action'}
                <Aksi {actions} id={row[5]} /> <!-- Menambahkan ID ke komponen Aksi -->
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

<style>
  .bg-header {
    background-color: #A9CED6;
  }
  th, td {
    text-align: left;
  }
</style>
