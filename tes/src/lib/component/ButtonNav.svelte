<script>
  export let iconPath = '';
  export let text = '';
  export let href = '#';
</script>

<a href={href} class="link">
  <img src={iconPath} alt={text} class="icon" />
  <span class="text">{text}</span>
</a>

<style>
.link {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #56A3B2; 
  border-radius: 0.375rem; 
  color: white;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.link:hover {
  background-color: #7EC8D7; 
}

.icon {
  width: 1.5rem; 
  height: 1.5rem; 
  margin-right: 0.5rem; 
}

.text {
  margin-left: 0.5rem;
}

a {
  display: inline-block;
  margin: 0.5rem;
}
</style>
