<script>
    export let text = '';
    export let href = '#';
    export let color = '#000'; // Default color
    export let hoverColor = '#FF9029'; // Default hover color
    export let svgPath = ''; // Default SVG path
</script>

<a href={href} class="button" style="--color: {color}; --hover-color: {hoverColor};">
    <img src={svgPath} alt={text} class="icon" />
    <span>{text}</span>
</a>

<style>
    .button {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--color);
        color: white;
        padding: 0.5rem 1.5rem;
        border-radius: 5px;
        text-decoration: none;
        font-weight: bold;
        transition: background-color 0.3s;
    }

    .button:hover {
        background-color: var(--hover-color);
    }

    .icon {
        width: 1.5rem;
        height: 1.5rem;
        margin-right: 0.5rem;
    }
</style>
