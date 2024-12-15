<script>
    export let title = "Payment Detail";
    export let eventName = "";
    export let eventType = "";
    export let eventDate = "";
    export let total = "";
    export let customerName = "";
</script>

<div class="payment-detail">
    <h2>{title}</h2>
    <table>
        <tr>
            <td class="label">Nama Event</td>
            <td class="value">{eventName}</td>
        </tr>
        <tr>
            <td class="label">Tipe Event</td>
            <td class="value">{eventType}</td>
        </tr>
        <tr>
            <td class="label">Tanggal Event</td>
            <td class="value">{eventDate}</td>
        </tr>
        <tr>
            <td class="label">Total</td>
            <td class="value">{total}</td>
        </tr>
        <tr>
            <td class="label">Nama Pemesan</td>
            <td class="value">{customerName}</td>
        </tr>
    </table>
</div>

<style>
    .payment-detail {
        background-color: #fff;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        width: 50%; /* Set width to 50% of the screen */
    }

    h2 {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 20px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    td {
        padding: 10px 0;
        vertical-align: top;
    }

    .label {
        font-weight: bold;
        color: #333;
        width: 30%; /* Width of the label column */
    }

    .value {
        color: #555;
        width: 70%; /* Width of the value column */
    }
</style>
