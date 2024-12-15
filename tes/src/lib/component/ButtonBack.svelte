<script>
    export let href = "#";
    export let text = "Back";
  </script>
  
  <a href={href} class="back-button" on:click|preventDefault={() => history.back()}>
    <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
    </svg>
    {text}
  </a>
  
  <style>
  .back-button {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    text-decoration: none;
    color: #000;
    font-weight: 500;
    margin-bottom: 1rem;
    margin-top: 16px; /* Aligns vertically */
}

.back-button:hover {
    background-color: #f0f0f0;
}

.icon {
    width: 20px;
    height: 20px;
    margin-right: 0.5rem;
}

  </style>
  