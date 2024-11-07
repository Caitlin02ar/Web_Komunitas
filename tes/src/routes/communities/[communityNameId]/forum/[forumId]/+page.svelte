<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { page } from '$app/stores';
  import { getJwtToken, extractIdFromUrl, getUserId, getAnggotaKomunitasId } from '$lib/js/utils';
  import { browser } from '$app/environment';
  import OpenForum from '$lib/component/CommunityForum.svelte';
  import Loading from '$lib/component/Loading.svelte';

  let forumPost = null;
  let replies = [];
  let komunitasId = '';
  let forumId = '';
  let loading = true;
  let newReply = '';
  let isReplying = false;
  let replyLoading = false;

  onMount(async () => {
    if (browser) {
      const token = getJwtToken();
      const userId = getUserId();
      komunitasId = extractIdFromUrl(window.location.href);
      forumId = get(page).params.forumId;

      const baseUrl = import.meta.env.VITE_API_BASE_URL;

      try {
        const response = await fetch(`${baseUrl}/v1/users/komunitas/${komunitasId}/forum/${forumId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (result.status === 200) {
          // Set forum post data and determine hasLiked status
          forumPost = result.data;
          forumPost.hasLiked = Array.isArray(forumPost.Like) && forumPost.Like.some(
            like => like?.AnggotaKomunitas?.user_id === Number(getUserId())
          );

          // Map replies to include hasLiked status
          replies = Array.isArray(result.data.Komentar)
            ? result.data.Komentar.map(reply => ({
                ...reply,
                hasLiked: Array.isArray(reply.Like) && reply.Like.some(
                  like => like?.AnggotaKomunitas?.user_id === Number(getUserId())
                )
              }))
            : [];
        } else {
          replies = [];
        }
      } catch (error) {
        console.error('Error fetching forum post:', error);
        replies = [];
      } finally {
        loading = false;
      }
    }
  });

  function startReplying() {
    isReplying = true;
  }

  function cancelReply() {
    isReplying = false;
    newReply = '';
  }

  async function submitReply() {
    if (newReply.trim()) {
      replyLoading = true;
      const token = getJwtToken();
      const userId = getUserId();

      const anggotaKomunitasId = await getAnggotaKomunitasId(komunitasId, userId);

      if (!anggotaKomunitasId) {
        console.error("Couldn't find anggota_komunitas_id");
        replyLoading = false;
        return;
      }

      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/users/komunitas/${komunitasId}/forum/${forumId}/komentar`;

      const replyData = {
        isi: newReply,
        anggota_komunitas_id: anggotaKomunitasId,
      };

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(replyData),
        });

        const data = await response.json();

        if (data.status === 200) {
          console.log('Reply submitted successfully');
          window.location.reload();
        } else {
          console.error('Failed to submit reply:', data.message);
        }
      } catch (error) {
        console.error('Error submitting reply:', error);
      } finally {
        replyLoading = false;
      }
    }
    cancelReply();
  }

  async function handleLike(postId: string) {
    // Find the post or reply by postId
    const post = postId === forumPost?.id ? forumPost : replies.find(reply => reply.id === postId);
    console.log('Post object:', post);

    if (!post) return;

    const originalHasLiked = post.hasLiked;
    const isCurrentlyLiked = originalHasLiked;
    console.log('Original hasLiked:', originalHasLiked);

    // Determine if it's a like or unlike action
    const method = isCurrentlyLiked ? 'PUT' : 'POST';

    // Optimistic UI update
    post.hasLiked = !isCurrentlyLiked;
    post.JumlahLike += post.hasLiked ? 1 : -1;

    // Trigger Svelte reactivity
    if (postId === forumPost.id) {
      forumPost = { ...forumPost };
    } else {
      replies = [...replies];
    }

    const token = getJwtToken();
    const userId = getUserId();
    const anggotaKomunitasId = await getAnggotaKomunitasId(komunitasId, userId);

    if (!anggotaKomunitasId) {
      console.error("Couldn't find anggota_komunitas_id");
      // Revert optimistic update if anggotaKomunitasId is not found
      post.hasLiked = originalHasLiked;
      post.JumlahLike += post.hasLiked ? 1 : -1;

      if (postId === forumPost.id) {
        forumPost = { ...forumPost };
      } else {
        replies = [...replies];
      }

      return;
    }

    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    let apiUrl = `${baseUrl}/v1/users/komunitas/${komunitasId}/forum/${forumId}/like`;

    // If it's an unlike action, adjust the API URL for deleting the like
    if (method === 'PUT') {
      apiUrl += `/deletebyanggota/${anggotaKomunitasId}`;
    }

    const likeData = {
      anggota_komunitas_id: anggotaKomunitasId,
    };

    try {
      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: method === 'POST' ? JSON.stringify(likeData) : null,
      });

      const data = await response.json();

      if (data.status !== 200) {
        // Revert optimistic update if the request fails
        post.hasLiked = originalHasLiked;
        post.JumlahLike += post.hasLiked ? 1 : -1;

        if (postId === forumPost.id) {
          forumPost = { ...forumPost };
        } else {
          replies = [...replies];
        }

        console.error(`Failed to ${isCurrentlyLiked ? 'unlike' : 'like'} post:`, data.message);
      }
    } catch (error) {
      // Revert optimistic update if there's an error
      post.hasLiked = originalHasLiked;
      post.JumlahLike += post.hasLiked ? 1 : -1;

      if (postId === forumPost.id) {
        forumPost = { ...forumPost };
      } else {
        replies = [...replies];
      }

      console.error(`Error ${isCurrentlyLiked ? 'unliking' : 'liking'} post:`, error);
    }
  }
</script>

<section class="forum-post">
  {#if loading}
    <Loading message="Loading forum post..." />
  {:else if forumPost}
    <OpenForum
      userName={forumPost?.AnggotaKomunitas?.User?.nama_user || 'Unknown User'}
      userImageSrc={forumPost?.AnggotaKomunitas?.User?.foto_profile ? `${import.meta.env.VITE_API_BASE_URL}/getfoto?path=${forumPost.AnggotaKomunitas.User.foto_profile}` : '/path/to/default/image.png'}
      content={forumPost.isi}
      likes={forumPost.JumlahLike || 0}
      hasLiked={forumPost.hasLiked}
      postId={forumPost.id}
      title={forumPost.judul}
      showCommentButton={false}
      on:like={() => handleLike(forumPost.id)}
    />

    <div class="reply-input-container">
      <textarea
        bind:value={newReply}
        placeholder="Add Reply..."
        class="reply-input"
        on:focus={startReplying}
      ></textarea>

      {#if isReplying}
        <div class="reply-buttons">
          <button class="cancel-button" on:click={cancelReply} disabled={replyLoading}>Cancel</button>
          <button class="reply-button" on:click={submitReply} disabled={replyLoading}>
            {#if replyLoading}
              <Loading message="Submitting..." />
            {:else}
              Reply
            {/if}
          </button>
        </div>
      {/if}
    </div>

    <section class="replies">
      {#each replies as reply}
        <OpenForum
          userName={reply?.AnggotaKomunitas?.User?.nama_user || 'Unknown User'}
          userImageSrc={reply?.AnggotaKomunitas?.User?.foto_profile ? `${import.meta.env.VITE_API_BASE_URL}/getfoto?path=${reply.AnggotaKomunitas.User.foto_profile}` : '/path/to/default/image.png'}
          content={reply.isi}
          likes={reply.JumlahLike || 0}
          hasLiked={reply.hasLiked}
          postId={reply.id}
          showCommentButton={false}
          showLikeButton={false}
          on:like={() => handleLike(reply.id)}
        />
      {/each}
    </section>
  {/if}
</section>

<style>
  .forum-post {
    padding: 16px;
    overflow-x: hidden;
    word-wrap: break-word;
    display: flex;
    flex-direction: column;
  }

  .reply-input-container {
    margin-top: 16px;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .reply-input {
    width: 100%;
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid #ccc;
    font-size: 0.9rem;
    outline: none;
    box-sizing: border-box;
    max-height: 150px;
    resize: none;
  }

  .reply-buttons {
    margin-top: 8px;
    display: flex;
    gap: 8px;
  }

  .cancel-button,
  .reply-button {
    padding: 6px 12px;
    border-radius: 12px;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .cancel-button {
    background: #ddd;
    border: none;
    color: #555;
  }

  .reply-button {
    background: #ffa500;
    border: none;
    color: #fff;
  }

  .replies {
    margin-top: 24px;
    max-height: 300px;
    overflow-y: auto;
    width: 100%;
  }
</style>
