<script>
  import { onMount } from 'svelte';

  onMount(() => console.log('test'));
</script>

<div class="center">
  <div class="ratio">

  </div>
</div>

<style>
  :global(html, body) {
    --radius: 10px;
    --dark: #181818;

    background-color: #000;
    color: #fff;
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  }

  .center {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
  }

  .ratio {
    height: 56.25vw;
    left: 50%;
    max-height: 100vh;
    max-width: 177.77778vh;
    position: absolute;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 100vw;
  }
</style>
