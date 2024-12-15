<script lang="ts">
    export let profileImage: string;
    export let name: string;
    export let username: string;
    export let role: string;
  </script>
  
  <div class="member-card">
    <img src={profileImage} alt={name} class="profile-image" />
    <div class="member-info">
      <div class="name-role">
        <span class="name">{name}</span>
        {#if role}
          <span class="role-badge {role.toLowerCase()}">{role}</span>
        {/if}
      </div>
      <span class="username">@{username}</span>
    </div>
  </div>
  
  <style>
    .member-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
      max-width: 600px;
      margin-top: 20px;
    }
  
    .member-card {
      display: flex;
      align-items: center;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background-color: #fff;
      box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 10px;
    }
  
    .profile-image {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 10px;
    }
  
    .member-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  
    .name-role {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  
    .name {
      font-weight: bold;
      font-size: 1rem;
    }
  
    .role-badge {
      padding: 2px 6px;
      font-size: 0.8rem;
      border-radius: 12px;
      font-weight: 500;
    }
  
    .role-badge.leader {
      color: #007bff;
      border: 1px solid #007bff;
    }
  
    .role-badge.co-leader {
      color: #007bff;
      border: 1px solid #007bff;
    }
  
    .role-badge.admin {
      color: #28a745;
      border: 1px solid #28a745;
    }
  
    .role-badge.member {
      color: #ff9800;
      border: 1px solid #ff9800;
    }
  
    .username {
      font-size: 0.9rem;
      color: #666;
    }
  </style>
  