<script lang="ts">
    import Cube from "./Cube.svelte";
</script>

<svelte:head>
    <title>briano</title>
</svelte:head>

<div class="root">
    <center>
        <Cube />
    </center>

    <center class="title">
        ******<br />
        <a href="mailto:b@briano.io">mail:b@briano.io</a>
        <a href="https://github.com/bbriano">github:bbriano</a><br />
        <a href="https://docs.briano.io/cv/cv.pdf">CV</a>
    </center>

    <div class="links">
        <a href="https://docs.briano.io">docs</a>
        <a href="https://publioofficial.com">Publio</a>
        <a href="https://typings.gg">typings.gg</a>
        <a href="https://briano1905.com/gmk-wob-hiragana/">GMK WoB Hiragana</a>
        <a href="https://vce-notes.netlify.app">vce notes</a>
        <a href="https://briano1905.com/vector-3d">Vector 3D</a>
        <a href="https://briano1905.com/internet-usage">Internet Usage</a>
        <a href="https://briano1905.com/gmk-phantom/">GMK Phantom</a>
    </div>
</div>

<style>
    .root {
        font-family: monospace;
        font-size: 1.6rem;
        padding: 1rem;
    }

    .title {
        color: blueviolet;
        margin: 1rem 0;
    }
    .title a {
        color: blue;
    }

    .links {
        max-width: 60rem;
        margin: auto;
        display: flex;
        flex-direction: column;
    }
    .links a {
        color: limegreen;
        text-decoration: none;
        margin: 0.4rem 0;
    }

    a:hover {
        text-decoration: underline;
    }
</style>
