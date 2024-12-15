<script>
  import { goto } from '$app/navigation';
  export let imageSrc = '';
  export let title = '';
  export let subtitle = '';

  function handleClick() {
    goto(`/communities/categories/${title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`);
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="card" on:click={handleClick}>
  <img src={imageSrc} alt={title} class="card-image" />
  <div class="overlay">
    <div class="text">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  </div>
</div>

<style>
  .card {
    position: relative;
    width: 100%;
    max-width: 300px; /* Adjust this as needed */
    border-radius: 8px;
    overflow: hidden;
    padding: 0%;
    margin: 0;
    cursor: pointer;
  }

  .card-image {
    width: 100%;
    display: block;
  }

  .overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, #000, rgba(0, 0, 0, 0)); /* Solid black to transparent gradient */
    overflow: hidden;
    width: 100%;
    height: 80%;
    display: flex;
    justify-content: center;
    align-items: flex-end; /* Align text to the bottom */
  }

  .text {
    color: white;
    padding: 10px;
    text-align: center;
    width: 100%;
  }

  .text h2 {
    margin: 0;
    font-size: 1.2rem; /* Larger font size for the title */
    font-weight: bold;
  }

  .text p {
    margin: 0;
    font-size: 1.2rem; /* Larger font size for the subtitle */
    font-weight: bold;
  }
</style>
