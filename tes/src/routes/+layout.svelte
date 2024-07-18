<script>
	import "../app.css";
  </script>
  
  <div class="app">
	<main>
	  <slot />
	</main>
  </div>
  
  <style>
	:global(body) {
	  margin: 0;
	  padding: 0;
	  box-sizing: border-box;
	  font-family: 'Inter', sans-serif;
	}
  
	/* .app {
	  display: flex;
	  flex-direction: column;
	  min-height: 100vh;
	} */
  
	/* main {
	  flex: 1;
	  display: flex;
	  flex-direction: column;
	} */
  </style>
  