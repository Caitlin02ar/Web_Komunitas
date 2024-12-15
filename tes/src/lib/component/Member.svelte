<script>
// @ts-nocheck

    export let name = '';
    export let username = '';
    export let photo = '';
    // export let details = {};
    export let actions = [];
    export let role = ''; 

    import Aksi2 from '$lib/component/Aksi2.svelte';
</script>

<style>
    .member-card {
        display: flex;
        align-items: center;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        margin-bottom: 1rem;
        background-color: white;
        position: relative; 
    }
    .member-info {
        display: flex;
        align-items: center;
        flex: 1; 
    }
    .member-info img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 1rem;
    }
    .member-details {
        flex: 1; /* Membuat member-details mengambil ruang yang tersedia */
    }
    .role {
        font-weight: bold;
        margin-top: 0.25rem;
        padding: 2px 12px; /* Lebih lebar padding untuk wrapping */
        border-radius: 20px; /* Radius lebih besar */
        border: 1px solid;
        display: inline-block;
    }
    .leader {
        color: #093B70;
        border-color: #093B70;
    }
    .co-leader {
        color: #093B70;
        border-color: #093B70;
    }
    .admin {
        color: #00BB6C;
        border-color: #00BB6C;
    }
    .member {
        color: #FFA049;
        border-color: #FFA049;
    }
    .actions-container {
        position: absolute; 
        top: 1rem; 
        right: 1rem; 
    }
</style>

<div class="member-card">
    <div class="member-info">
        <img src={photo} alt={name} />
        <div class="member-details">
            <h3>{name}</h3>
            <p>@{username}</p>
            <p class={`role ${role.toLowerCase()}`}>{role}</p> 
        </div>
    </div>
    <div class="actions-container">
        <Aksi2 {actions} />
    </div>
</div>
