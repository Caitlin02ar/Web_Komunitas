<script>
    import successAnimate from '$lib/images/Completed.svg';

</script>
<div class="container">
    <div class="header">
        <div class="content">
            <div class="img">
                <img src={successAnimate} alt="Activate Icon" style="width:25%; height:25%;">
            </div>

            <div class="text-information">

            </div>
        </div>
    </div>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

    :global(html, body) {
        margin: 0;
        padding: 0;
        height: 100%;
    }
    .container {
        background-color: white;
        border-radius: 4px;
        width: 100%;
        display: flex;
        /* justify-content: ; */
    }

    .content {
        padding: 16px;
    }
</style>