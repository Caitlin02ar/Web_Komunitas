<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { getJwtToken, getUserId, extractIdFromUrl } from '$lib/js/utils';  // Import fungsi utilitas

  let themes = [
    { id: 1, name: 'Default', color: '#646464', image: '/src/lib/images/Theme-Default.svg' },
    { id: 2, name: 'Blush Rose', color: '#FF8888', image: '/src/lib/images/Theme-BlushRose.svg' },
    { id: 3, name: 'Peach Glow', color: '#FFBD80', image: '/src/lib/images/Theme-PeachGlow.svg' },
    { id: 4, name: 'Sunshine Glow', color: '#FFD83B', image: '/src/lib/images/Theme-SunshineGlow.svg' },
    { id: 5, name: 'Mint Breeze', color: '#60EA87', image: '/src/lib/images/Theme-MintBreeze.svg' },
    { id: 6, name: 'Aqua Splash', color: '#7CF6F8', image: '/src/lib/images/Theme-AquaSplash.svg' },
    { id: 7, name: 'Ultramarine Blue', color: '#4078FA', image: '/src/lib/images/Theme-AquamarineBlue.svg' },
    { id: 8, name: 'Violet Dream', color: '#7559FF', image: '/src/lib/images/Theme-VioletDream.svg' },
    { id: 9, name: 'Lavender Mist', color: '#F082FF', image: '/src/lib/images/Theme-LavenderMist.svg' },
    { id: 10, name: 'Carnation Pink', color: '#FFA0CC', image: '/src/lib/images/Theme-CarnationPink.svg' },
    { id: 11, name: 'Crimson Velvet', color: '#7D2438', image: '/src/lib/images/Theme-CrimsonVelvet.svg' },
  ];

  let selectedThemeId = null;
  let communityNameId = extractIdFromUrl(window.location.href);  // Ambil ID komunitas dari URL

  // Fetch the current theme-id of the community
  onMount(async () => {
    try {
      const token = getJwtToken();  // Dapatkan JWT token dari utilitas
      console.log('JWT Token:', token); // Debugging JWT Token
      console.log('Community Name ID:', communityNameId); // Debugging Community Name ID

      if (!token) {
        console.error('Authentication token not found.');
        return;
      }

      const response = await fetch(`http://leap.crossnet.co.id:3010/api/v1/users/komunitas/${communityNameId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include'
      });

      const data = await response.json();
      console.log('Fetch response data:', data); // Debugging data fetched

      if (response.ok && data.status === 200) {
        selectedThemeId = data.data.Komunitas['theme-id'];
        console.log('Selected Theme ID:', selectedThemeId); // Debugging Theme ID
      } else {
        console.error('Failed to fetch theme-id:', data.message);
      }
    } catch (error) {
      console.error('Error fetching theme-id:', error);
    }
  });

  // Function to select the theme
  function selectTheme(id) {
    selectedThemeId = id;
    console.log('Selected Theme:', selectedThemeId); // Debugging selected theme ID
  }

  // Function to update the theme-id using PUT request
  async function saveTheme() {
    try {
      const token = getJwtToken();  // Ambil JWT token dari utilitas
      const userId = getUserId();   // Ambil User ID dari utilitas

      console.log('Saving Theme:', selectedThemeId); // Debugging theme ID yang disimpan
      console.log('User ID:', userId); // Debugging User ID
      console.log('JWT Token for Save:', token); // Debugging JWT Token for Save

      if (!token) {
        console.error('Authentication token not found.');
        return;
      }

      const payload = { 'theme-id': selectedThemeId, 'user_id': userId };
      console.log('Payload being sent:', payload); // Debugging payload

      const response = await fetch(`http://leap.crossnet.co.id:3010/api/v1/users/komunitas/update/4`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      const result = await response.json();
      console.log('Response from Save Theme:', result); // Debugging hasil dari server

      if (response.ok && result.status === 200) {
        alert('Theme updated successfully!');
      } else {
        console.error('Failed to update theme:', result.message);
      }
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  }
</script>

<div class="themes-container">
  {#each themes as theme}
    <div class="theme-card" on:click={() => selectTheme(theme.id)}>
      <div class="image-container">
        <img src={theme.image} alt={theme.name} />
      </div>
      <div class="theme-info">
        <div class="circle" style="background-color: {theme.color};"></div>
        <div class="theme-name">{theme.name}</div>
        <input type="radio" name="theme" value={theme.id} checked={selectedThemeId === theme.id} />
      </div>
    </div>
  {/each}
</div>

<div class="buttons-container">
  <button class="cancel-button" on:click={() => (selectedThemeId = null)}>Cancel</button>
  <button class="save-button" on:click={saveTheme}>Save</button>
</div>

<style>
  .themes-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
  }

  .theme-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 8px;
    cursor: pointer;
  }

  .image-container {
    width: 100%;
    height: 100%;
    background-color: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
  }

  .image-container img {
    width: 100%;
    height: auto;
  }

  .theme-info {
    display: flex;
    align-items: center;
    margin-top: 8px;
    width: 100%;
  }

  .circle {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    margin-right: 8px;
  }

  .theme-name {
    flex: 1;
    font-size: 14px;
  }

  input[type="radio"] {
    margin-left: 8px;
  }

  .buttons-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }

  .cancel-button, .save-button {
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 8px;
  }

  .cancel-button {
    background-color: #e2e8f0;
    color: #4a5568;
    border: none;
  }

  .save-button {
    background-color: #007bff;
    color: white;
    border: none;
  }
</style>
