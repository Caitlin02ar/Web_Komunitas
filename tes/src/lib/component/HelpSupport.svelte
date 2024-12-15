<script>
    let name = '';
    let email = '';
    let message = '';

    function handleSubmit() {
        // Logika untuk mengirim pesan
        console.log('Nama:', name);
        console.log('Email:', email);
        console.log('Pesan:', message);
        // Reset form
        name = '';
        email = '';
        message = '';
    }
</script>

<style>

    nav ul li {
        margin-left: 20px;
    }

    nav ul li a {
        color: #fff;
        text-decoration: none;
    }

    main {
        padding: 20px;
    }

    section {
        margin-bottom: 20px;
    }

    .header{
        margin-top: 24px;
        font-size: 24px;
        font-weight: 600;
    }
    .help-center, .user-guide {
        border: 1px solid #ccc;
        padding: 8px;
        border-radius: 4px;
    }
    li {
        text-decoration: underline;
    }
</style>

<div class="header">
    <h3>Help and Support</h3>
</div>


<main>
    <section class="help-center">
        <h2 style="font-weight: 600;">Pusat Bantuan</h2>
        <p style="color: gray; font-size:14px; font-style:italic;">Temukan jawaban untuk pertanyaan umum di sini.</p>
        <ul>
            <!-- svelte-ignore a11y-invalid-attribute -->
            <li><a href="#">Apa itu komunitas kami?</a></li>
            <!-- svelte-ignore a11y-invalid-attribute -->
            <li><a href="#">Bagaimana cara bergabung?</a></li>
            <!-- svelte-ignore a11y-invalid-attribute -->
            <li><a href="#">Bagaimana cara berpartisipasi dalam acara?</a></li>
            <!-- svelte-ignore a11y-invalid-attribute -->
            <li><a href="#">Kontak dukungan teknis</a></li>
        </ul>
    </section>

    <section class="user-guide">
        <h2 style="font-weight: 600;">Panduan Pengguna</h2>
        <ul>
            <!-- svelte-ignore a11y-invalid-attribute -->
            <li><a href="#">Cara membuat akun</a></li>
            <!-- svelte-ignore a11y-invalid-attribute -->
            <li><a href="#">Navigasi forum</a></li>
            <!-- svelte-ignore a11y-invalid-attribute -->
            <li><a href="#">Menggunakan fitur komunitas</a></li>
            <!-- svelte-ignore a11y-invalid-attribute -->
            <li><a href="#">Tips untuk berkontribusi</a></li>
        </ul>
    </section>

    
</main>
