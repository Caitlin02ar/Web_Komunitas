<script>
    import chatImage from '$lib/images/Chat1.png';
  </script>
  
  <div class="app-container">
    <div class="chat-area">
      <img src={chatImage} alt="Chat interface" />
      <p>Start a new conversation</p>
    </div>
  </div>
  
  <style>
    .app-container {
      display: flex;
      height: 100vh;
    }
  
    .chat-area {
      width: 80%;
      background-color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 50px;
      box-sizing: border-box;
    }
  
    .chat-area img {
      max-width: 70%;
    }
  
    .chat-area p {
      margin-top: 20px;
      font-size: 1.2em;
      color: #333;
    }
  </style>
  