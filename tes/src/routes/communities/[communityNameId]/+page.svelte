<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import OpenForum from '$lib/component/CommunityForum.svelte';
  import PollingCarousel from '$lib/component/PollingCarousel.svelte';
  import Loading from '$lib/component/Loading.svelte'; 
  import { getJwtToken, getUserId, extractIdFromUrl, getAnggotaKomunitasId } from '$lib/js/utils';
  import { browser } from '$app/environment';

  let communityData = null;
  let forumPosts = [];
  let loading = true;
  let loadingRequest = false;
  let komunitasId = '';
  let communityName = '';
  let polls = [];
  let btn_submit_vote = '';

  onMount(async () => {
    if (browser) {
      const token = getJwtToken();
      const userId = getUserId();
      komunitasId = extractIdFromUrl(window.location.href);

      if (!token) {
        console.error('Token not found');
        loading = false;
        return;
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL;

      try {
        const pollResponse = await fetch(`${baseUrl}/v1/users/komunitas/${komunitasId}/polling?page=0&pageSize=0`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        const pollResult = await pollResponse.json();
        if (pollResult.status === 200) {
          const anggotaKomunitasId = await getAnggotaKomunitasId(komunitasId, userId);
          polls = pollResult.data.map(poll => {
            const userHasVoted = poll.polling_pilihan.some(pilihan => 
              pilihan.polling_pilihan_detail.some(detail => detail.anggota_komunitas_id === Number(anggotaKomunitasId))
            );
            return {
              id: poll.id,
              question: poll.pertanyaan,
              options: poll.polling_pilihan.map(option => ({
                id: option.id,
                text: option.jawaban,
                votes: option.jumlah_menjawab
              })),
              hasVoted: userHasVoted
            };
          });
        }

        const forumResponse = await fetch(`${baseUrl}/v1/users/komunitas/${komunitasId}/forum?page=0&pageSize=0`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const forumResult = await forumResponse.json();
        if (forumResult.status === 200) {
          forumPosts = forumResult.data.map(post => ({
            id: post.id,
            title: post.judul,
            userName: post.AnggotaKomunitas.User.nama_user,
            userImageSrc: `${import.meta.env.VITE_API_BASE_URL}/getfoto?path=${post.AnggotaKomunitas.User.foto_profile}`,
            content: post.isi,
            likes: post.JumlahLike || 0,
            hasLiked: Array.isArray(post.Like) && post.Like.some(like => like.AnggotaKomunitas.user_id === Number(userId)),
            comments: post.Komentar || [],
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        loading = false;
      }
    }
  });

  async function submitVote(event) {
    const { selectedOption, pollId } = event.detail;

    const token = getJwtToken();
    const userId = getUserId();
    const anggotaKomunitasId = await getAnggotaKomunitasId(komunitasId, userId);

    if (!selectedOption || !anggotaKomunitasId) {
      console.error("Missing selected option or anggota_komunitas_id.");
      return;
    }

    const voteData = {
      polling_pilihan_id: selectedOption,
      anggota_komunitas_id: anggotaKomunitasId
    };
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    try {
      const response = await fetch(`${baseUrl}/v1/users/pollingpilihandetail`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(voteData)
      });

      const result = await response.json();

      if (result.status === 200) {
        polls = polls.map(poll => {
          if (poll.id === pollId) {
            return {
              ...poll,
              options: poll.options.map(option =>
                option.id === selectedOption ? { ...option, votes: option.votes + 1 } : option
              ),
              hasVoted: true
            };
          }
          return poll;
        });
      } else {
        console.error("Failed to submit vote:", result.message);
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  }

  function handleCommentClick(event) {
    const { id } = event.detail;
    goto(`/communities/${communityName.replace(/\s+/g, '-').toLowerCase()}-${komunitasId}/forum/${id}`);
  }
</script>

<div class="community-container">
  {#if loading}
    <Loading message="Loading community data..." />
  {:else}
    {#if polls && polls.length > 0}
      <PollingCarousel {polls} submitButtonColor={btn_submit_vote} on:submitVote={submitVote} />
    {/if}
    <!-- (communityData.status === 'public' || communityData.status === 'joined') -->
      {#each forumPosts as post}
        <OpenForum
          userName={post.userName}
          userImageSrc={post.userImageSrc}
          content={post.content}
          likes={post.likes}
          hasLiked={post.hasLiked}
          postId={post.id} 
          title={post.title} 
          on:comment={handleCommentClick} 
          on:like={() => handleLike(post.id)}
        />
      {/each}
  {/if}
</div>

<style>
  .community-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding-top: 16px;
    background-color: #f9f9f9;
    margin-top: -16px;
  }
</style>