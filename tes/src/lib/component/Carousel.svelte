<script lang="ts">
  import { onMount } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import ThemeCard from './CategoryCard.svelte';

  type Item = {
    imageSrc: string;
    title: string;
    subtitle: string;
  };

  export let items: Item[] = [];

  let currentIndex = 0;
  let transitionDuration = 400;
  let xOffset = tweened(0, {
    duration: transitionDuration,
    easing: cubicOut
  });

  let visibleItems = 3;

  function next() {
    currentIndex = (currentIndex + 1) % items.length;
    xOffset.set(-currentIndex * (100 / visibleItems), { duration: transitionDuration, easing: cubicOut });
  }

  function previous() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    xOffset.set(-currentIndex * (100 / visibleItems), { duration: transitionDuration, easing: cubicOut });
  }

  const updateVisibleItems = () => {
    const width = window.innerWidth;
    if (width >= 1200) {
      visibleItems = 5;
    } else if (width >= 992) {
      visibleItems = 4;
    } else if (width >= 768) {
      visibleItems = 3;
    } else if (width >= 576) {
      visibleItems = 2;
    } else {
      visibleItems = 1;
    }
    xOffset.set(-currentIndex * (100 / visibleItems), { duration: 0 }); // Set tanpa animasi saat resize
  };

  onMount(() => {
    updateVisibleItems();
    window.addEventListener('resize', updateVisibleItems);
    return () => window.removeEventListener('resize', updateVisibleItems);
  });
</script>

<div class="carousel">
  <div class="carousel-inner" style="transform: translateX({$xOffset}%);">
    {#each items as item}
      <div class="carousel-item" style="flex: 0 0 calc(100% / {visibleItems});">
        <ThemeCard imageSrc={item.imageSrc} title={item.title} subtitle={item.subtitle} />
      </div>
    {/each}
  </div>
  <button class="carousel-control prev" on:click={previous}>❮</button>
  <button class="carousel-control next" on:click={next}>❯</button>
</div>

<style>
  .carousel {
    position: relative;
    overflow: hidden;
    width: 100%;
  }

  .carousel-inner {
    display: flex;
    /* Removed transition CSS */
  }

  .carousel-item {
    box-sizing: border-box;
    margin-right: 16px; 
  }

  .carousel-control {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    border-radius: 4px;
  }

  .carousel-control.prev {
    left: 10px;
  }

  .carousel-control.next {
    right: 10px;
  }

  .carousel-control:focus {
    outline: none; /* Hilangkan border saat tombol mendapat fokus */
  }
</style>



  <!-- /* .carousel-item h2 {
    font-size: 1rem;
  }

  .carousel-item p {
    font-size: 0.75rem; 
  }

  @media (max-width: 1200px) {
    .carousel-item h2 {
      font-size: 0.9rem; 
    }

    .carousel-item p {
      font-size: 0.7rem; 
    }
  }

  @media (max-width: 992px) {
    .carousel-item h2 {
      font-size: 0.8rem; 
    }

    .carousel-item p {
      font-size: 0.65rem; 
    }
  }

  @media (max-width: 768px) {
    .carousel-item h2 {
      font-size: 0.7rem; 
    }

    .carousel-item p {
      font-size: 0.6rem; 
    }
  }

  @media (max-width: 576px) {
    .carousel-item h2 {
      font-size: 0.6rem; 
    }

    .carousel-item p {
      font-size: 0.5rem; 
    }
  }

  @media (max-width: 480px) {
    .carousel-item h2 {
      font-size: 0.5rem; 
    }

    .carousel-item p {
      font-size: 0.45rem; 
    }
  } */
</style> -->
