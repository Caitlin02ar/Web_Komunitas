<script>
// @ts-nocheck

    export let date = '';
    export let title = '';
    export let time = '';
  
    function formatDate(dateString) {
      const date = new Date(dateString);
      const options = { day: '2-digit' };
      return date.toLocaleDateString('en-US', options);
    }
  </script>
  
  <style>
    .card {
      background-color: #5ac0b1;
      color: white;
      padding: 1rem;
      border-radius: 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
  
    .date {
      font-size: 1.5rem;
      font-weight: bold;
      margin-right: 1rem;
    }
  
    .details {
      flex: 1;
    }
  
    .title {
      font-size: 1rem;
      margin-bottom: 0.25rem;
    }
  
    .time {
      font-size: 0.875rem;
    }
  </style>
  
  <div class="card">
    <div class="date">{formatDate(date)}</div>
    <div class="details">
      <div class="title">{title}</div>
      <div class="time">{time}</div>
    </div>
  </div>
  