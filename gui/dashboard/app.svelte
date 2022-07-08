<script>
  import AspectRatio from './components/aspectratio.svelte';
</script>

<AspectRatio>
  <h1>here comes the dashboard</h1>
</AspectRatio>

<style>
  :global(html, body) {
    --radius: 10px;
    --dark: #181818;

    background-color: #000;
    color: #fff;
    padding: 0;
    margin: 0;
  }
</style>
