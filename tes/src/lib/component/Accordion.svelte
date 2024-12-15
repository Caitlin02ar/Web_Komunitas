<script>
    export let title;
    export let content;
    let isOpen = false;
    let toggle = () => isOpen = !isOpen;
  </script>
  
  <style>
    .accordion {
      cursor: pointer;
      padding: 10px;
      padding-left: 2px;
      margin-bottom: 0;
      border-bottom: none;
      border-radius: 4px;
      font-weight: 600;
    }
  
    .accordion-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
      padding: 0 10px;
      padding-left: 2px;
      border-bottom: 1px solid #ccc;
    }
  
    .accordion-content.open {
      max-height: 100px;
    }
  
    .accordion::after {
      content: '+';
      float: right;
      font-size: 20px;
      transition: transform 0.3s ease;
    }
  
    .accordion.open::after {
      content: '-';
      transform: rotate(0deg);
    }
  
    .accordion.open {
      border-bottom: none;
    }
  </style>
  
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="accordion" on:click={toggle} class:open={isOpen}>
    {title}
  </div>
  <div class="accordion-content {isOpen ? 'open' : ''}">
    <p>{content}</p>
  </div>
  