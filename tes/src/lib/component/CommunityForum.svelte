<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import HeartIcon from '/src/lib/images/heart.svg';
  import FilledHeartIcon from '/src/lib/images/filled-heart.svg';
  import CommentIcon from '/src/lib/images/comment.svg';

  export let userName: string;
  export let userImageSrc: string;
  export let content: string;
  export let likes: number;
  export let hasLiked: boolean;
  export let postId: number;
  export let title: string;
  export let status: string;
  export let showCommentButton: boolean = true; // Properti baru untuk menampilkan/menyembunyikan tombol komentar
  export let showLikeButton: boolean = true;

  const dispatch = createEventDispatcher();

  function handleCommentClick() {
    dispatch('comment', { id: postId, title }); // Kirimkan `id` dan `title` dari forum saat tombol comment diklik
  }

  function toggleLike() {
    if (hasLiked) {
      likes -= 1;
    } else {
      likes += 1;
    }
    hasLiked = !hasLiked;
  }
</script>

<div class="forum-post">
  <div class="post-header">
    <img src={userImageSrc} alt={userName} class="user-image" />
    <div class="user-info">
      <h3>{userName}</h3>
      <div style="display: inline-flex; gap: 8px;">
        <p style="font-weight: bold;">{title}</p>
        {#if status !== 'Anyone'}
          <p>● Restrict</p>
        {/if}
      </div>
      <p>{content}</p>
    </div>    
  </div>
  <div class="separator"></div>
  <div class="post-actions">
   
    <div class="likes-comments">
      {#if showLikeButton}
      <button class="like-button"  on:click={() => dispatch('like')}>
        <img src={hasLiked ? FilledHeartIcon : HeartIcon} alt="Like" class="action-icon" />
        <span>{likes}</span>
      </button>
      {/if}
      
      {#if showCommentButton}
        <button class="comment-button" on:click={handleCommentClick}>
          <img src={CommentIcon} alt="Comment" class="action-icon" />
        </button>
      {/if}
    </div>
  </div>
</div>

<style>
  .forum-post {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .post-header {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .user-image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  .user-info {
    display: flex;
    flex-direction: column;
  }

  .user-info h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: bold;
  }

  .user-info p {
    margin: 0;
    font-size: 0.9rem;
    color: #555;
  }

  .separator {
    border-bottom: 1px solid #ddd;
    margin: 8px 0;
  }

  .post-actions {
    display: flex;
    justify-content: space-between;
  }

  .likes-comments {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .like-button, .comment-button {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    color: #555;
    transition: color 0.3s ease;
  }

  .like-button img {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
  }

  .like-button img:hover {
    transform: scale(1.2);
  }

  .action-icon {
    width: 20px;
    height: 20px;
  }

  .like-button span {
    font-size: 0.9rem;
  }

  .like-button:focus,
  .comment-button:focus {
    outline: none;
    border: none;
  }
</style>
