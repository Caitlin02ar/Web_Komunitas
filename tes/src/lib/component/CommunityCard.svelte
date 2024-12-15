<script lang="ts">
  import { goto } from '$app/navigation';

  export let imageSrc: string = '';
  export let communityName: string = '';
  export let tags: string[] = [];
  export let memberCount: number = 0;
  export let description: string = '';
  export let visibility: 'Private' | 'Public' | undefined = undefined;
  export let communityId: string = ''; 
  import private_icon from '$lib/images/private.svg';

  const navigateToCommunity = () => {
    goto(`/communities/${communityName.replace(/\s+/g, '-').toLowerCase()}-${communityId}`);
  };

  // Fungsi untuk memotong teks jika terlalu panjang
  const truncate = (text: string, maxLength: number): string => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="card" on:click={navigateToCommunity}>
  <div class="card-header">
    <img src={imageSrc} alt={communityName} class="card-image" />
    <div class="card-info">
      <h2>
        {truncate(communityName, 10)} {#if visibility === 'Private'}<img src="{private_icon}" alt="Private" class="lock-icon"/>{/if}
      </h2>
      <div class="tags">
        {#each tags as tag}
          <span>{truncate(tag, 4)}</span>
        {/each}
      </div>
      <p>{memberCount}{memberCount === 1 ? ' member' : ' members'}</p>
    </div>
  </div>
  <hr />
  <div class="card-body">
    <h3>Description</h3>
    <p>{truncate(description, 30)}</p>
  </div>
</div>

<style>
  .card {
    border: 1px solid black; 
    border-radius: 8px;
    padding: 12px;
    max-width: 600px; 
    background-color: #F9F5EC; 
    transition: background-color 0.3s ease, box-shadow 0.3s ease; 
    cursor: pointer; 
    width: 100%;
    height: 100%;
  }

  .card:hover {
    background-color: #FFF4DB; 
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2); 
  }

  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }

  .card-image {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-right: 12px;
  }

  .card-info {
    display: flex;
    flex-direction: column;
  }

  .card-info h2 {
    margin: 0;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    font-weight: bold; 
    white-space: nowrap; /* Supaya teks dalam satu baris */
    overflow: hidden;
    text-overflow: ellipsis; /* Menampilkan '...' jika teks terlalu panjang */
    max-width: 250px; /* Atur sesuai kebutuhan */
  }

  .lock-icon {
    margin-left: 8px;
    width: 16px; 
    height: 16px; 
  }

  .tags {
    display: flex;
    gap: 8px;
    font-size: 0.9rem;
    margin: 4px 0;
    flex-wrap: nowrap; /* Supaya tag tidak turun ke baris berikutnya */
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 250px; /* Atur sesuai kebutuhan */
  }

  .tags span {
    border-radius: 4px;
    padding: 2px 6px;
  }

  .card-body {
    margin: 16px 0;
  }

  .card-body h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: bold;
  }

  .card-body p {
    margin: 4px 0 0;
    font-size: 0.9rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
  }
</style>
