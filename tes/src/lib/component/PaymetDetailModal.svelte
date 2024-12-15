<script>
    // @ts-nocheck
    export let selectedPaymentDetail;
    export let onClose;
  
    function close() {
      onClose();
    }
  </script>
  
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Payment Detail</h2>
        <button class="close" on:click={close}>&times;</button>
      </div>
      <div class="modal-body">
        <p><strong>Payment Number:</strong> {selectedPaymentDetail[0]}</p>
        <p><strong>Payer Name:</strong> {selectedPaymentDetail[1]}</p>
        <p><strong>Payment Date:</strong> {selectedPaymentDetail[2]}</p>
        <p><strong>Event Category:</strong> VIP and Regular</p>
        <p><strong>Event Date:</strong></p>
        <ul>
          <li>Monday, 27 January 2025</li>
          <li>Tuesday, 27 January 2025</li>
        </ul>
        <p><strong>Proof of Payment:</strong></p>
        <textarea readonly class="proof-payment">
          BERHASIL
          18/11/2023 09:52:42
          Ke Rekening Tujuan: CITIBANK
          9897219805689095 PT GOOGLE INDONESIA
          NOMINAL TRANSFER Rp 389,100.00
          BIAYA Rp 2,500.00 LAYANAN BI FAST
        </textarea>
      </div>
      <div class="modal-footer">
        <button class="modal-button" on:click={close}>OK</button>
      </div>
    </div>
  </div>
  
  <style>
    .modal {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }
  
    .modal-content {
      background: white;
      padding: 20px;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
    }
  
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
  
    .modal-header h2 {
      margin: 0;
    }
  
    .close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
    }
  
    .modal-body p {
      margin-bottom: 10px;
    }
  
    .modal-footer {
      display: flex;
      justify-content: flex-end;
    }
  
    .modal-button {
      background-color: #007AFF;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
  
    .modal-button:hover {
      background-color: #006BDF;
    }
  
    .proof-payment {
      width: 100%;
      height: 150px;
      margin-top: 10px;
      padding: 10px;
      font-family: monospace;
      border-radius: 4px;
      border: 1px solid #ccc;
      background-color: #f9f9f9;
    }
  </style>
  