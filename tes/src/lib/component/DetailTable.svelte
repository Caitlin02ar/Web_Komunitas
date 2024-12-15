<script>
    /**
     * @type {{ label: string, value: string }[]}
     */
    export let details = [];
</script>

<table class="detail-table">
    {#each details as detail}
        <tr>
            <th>{detail.label}</th>
            <td>{detail.value}</td>
        </tr>
    {/each}
</table>

<style>
    .detail-table {
        width: 100%;
        border-collapse: collapse;
    }

    .detail-table th, .detail-table td {
        border: 1px solid #ddd;
        padding: 8px;
    }

    .detail-table th {
        background-color: #f2f2f2;
        text-align: left;
    }

    .detail-table tr:nth-child(even) {
        background-color: #f9f9f9;
    }
</style>
