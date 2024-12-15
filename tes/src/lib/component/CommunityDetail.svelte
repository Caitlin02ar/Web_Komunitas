<script lang="ts">
    export let communityData: {
      imageSrc: string;
      name: string;
      members: number;
      tags: string[];
      description: string;
    };
  </script>
  
  <div class="community-card">
    <div class="community-header">
      <img src={communityData.imageSrc} alt={communityData.name} class="community-image" />
      <div class="community-info">
        <h2>{communityData.name}</h2>
        <div class="members-tags">
          <p>{communityData.members} members</p>
          <div class="tags">
            {#each communityData.tags as tag}
              <span class="tag">{tag}</span>
            {/each}
          </div>
        </div>
      </div>
    </div>
  
    <div class="community-description">
      <h3>Description</h3>
      <p>{communityData.description}</p>
    </div>
  </div>

  
  
  <style>
    .community-card {
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      position: relative;
    }
  
    .community-header {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      position: relative;
    }
  
    .community-image {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 16px;
    }
  
    .community-info {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
  
    .community-info h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: bold;
    }
  
    .members-tags {
      display: flex;
      align-items: center;
      margin-top: 4px;
      gap: 8px;
    }
  
    .community-info p {
      margin: 0;
      font-size: 1rem;
      color: #555;
    }
  
    .tags {
      display: flex;
      gap: 8px;
    }
  
    .tag {
      background-color: #C9DADA;
      padding: 4px 8px;
      border-radius: 8px;
      font-size: 0.875rem;
      color: #000000;
      font-weight: 500;
      border: 1.5px solid rgba(94, 94, 94, 0.5);
    }
  
    .community-description {
      display: flex;
      flex-direction: column;
      width: calc(100%);
    }
  
    .community-description h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: bold;
    }
  
    .community-description p {
      margin: 4px 0 0;
      font-size: 1rem;
      color: #333;
    }
  </style>
  