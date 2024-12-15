<script lang="ts">
  import { writable } from 'svelte/store';
  import Rules from './Rules.svelte';
  import { page } from '$app/stores';
  import calendar_icon from '$lib/images/calendar.svg';
  import event_icon from '$lib/images/events.svg';

  export let rules: Array<{ title: string, content: string }> = [];
  export let groupCommunities: Array<{ name: string, imageSrc: string }> = [];
  export let events: Array<{ name: string, imageSrc: string }> = [];
  export let openChatImageSrc: string;
  export let isMember: boolean;
  export let btn_community_schedule_color: string = "#FFA959";
  export let btn_community_event_color: string = "#7AB2B2";

  const showGroupCommunities = writable(false);
  const showEvents = writable(false);

  function toggleGroupCommunities() {
    showGroupCommunities.update(value => !value);
  }

  function toggleEvents() {
    showEvents.update(value => !value);
  }

  let communityNameId: string;
  $: communityNameId = $page.params.communityNameId;

  function navigateToOpenChat() {
    const newUrl = `/communities/${communityNameId}/chat/openchat`;
    window.location.href = newUrl;
  }
</script>

<div class="sidebar">
  <div class="rules">
    <h1>Community Rules</h1>
    {#if rules.length > 0}
      {#each rules as rule}
        <Rules title={rule.title} content={rule.content} />
      {/each}
    {:else}
      <p class="no-rules">There are no rules in this community</p>
    {/if}
  </div>

  {#if isMember}
    <a href={`/communities/${communityNameId}/calendar`} class="schedule-button" style="background-color: {btn_community_schedule_color}">
      <img src="{calendar_icon}" alt="Calendar" width="24" height="24" class="white-icon" />
      Community Schedule
    </a>
  
    <a href={`/communities/${communityNameId}/events`} class="events-button" style="background-color: {btn_community_event_color}">
      <img src="{event_icon}" alt="Event" width="24" height="24" class="white-icon" />
      Community Events
    </a>

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="community">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="community-item" on:click={navigateToOpenChat}>
        <img src={openChatImageSrc} alt="Open Chat Komunitas" />
        <span>Open Chat Komunitas</span>
      </div>
    </div>

    <div class="group-community">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="group-community-title" on:click={toggleGroupCommunities}>
        Group Community
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          class:rotated={$showGroupCommunities}
          style="transition: transform 0.3s ease;"
        >
          <path fill="none" stroke="black" stroke-width="2" d="M6 9l6 6 6-6" />
        </svg>
      </div>
      {#if $showGroupCommunities}
        <div class="scroll">
          {#each groupCommunities as community}
            <div class="community-item-boxed">
              <img src={community.imageSrc} alt={community.name} />
              <span>{community.name}</span>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <div class="events">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="events-title" on:click={toggleEvents}>
        Events
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          class:rotated={$showEvents}
          style="transition: transform 0.3s ease;"
        >
          <path fill="none" stroke="black" stroke-width="2" d="M6 9l6 6 6-6" />
        </svg>
      </div>
      {#if $showEvents}
        <div class="scroll">
          {#each events as event}
            <div class="community-item-boxed">
              <img src={event.imageSrc} alt={event.name} />
              {event.name}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  h1 {
    font-weight: 800;
  }

  .sidebar {
    border: 2px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    background-color: #fff;
    max-width: 300px;
    position: sticky;
    height: fit-content;
    top: 30px;
  }

  .rules, .community, .events {
    margin-bottom: 16px;
  }

  .no-rules {
    font-style: italic;
    color: #888;
  }

  .schedule-button, .events-button {
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    text-decoration: none;
  }

  .schedule-button img, .events-button img {
    margin-right: 8px;
  }

  .schedule-button img.white-icon {
    filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(0deg) brightness(200%) contrast(100%);
  }

  .community-item, .community-item-boxed {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-top: 8px;
    height: 48px;
    cursor: pointer;
    background-color: #fff;
  }

  .community-item:hover,
  .community-item-boxed:hover {
    background-color: #E5E1E1;
  }

  .community-item img, .community-item-boxed img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 8px;
  }

  .community-item span, .community-item-boxed span {
    font-weight: bold;
    font-size: 0.9rem;
  }

  .group-community-title, .events-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    font-weight: bold;
    margin-top: 8px;
  }

  .rotated {
    transform: rotate(180deg);
  }

  .scroll {
    max-height: 120px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #888 #f0f0f0;
  }

  .scroll::-webkit-scrollbar {
    width: 6px;
  }

  .scroll::-webkit-scrollbar-track {
    background: #f0f0f0;
  }

  .scroll::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 20px;
  }

  .scroll::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
</style>
