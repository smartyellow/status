<script>
  import { onMount } from 'svelte';
  import TileRawValue from './tile-rawvalue.svelte';

  let lastUpdated = new Date();
  let lastUpdatedFormatted = '';
  let services = {};
  let loading = true;

  $:console.log(services);

  onMount(() => {
    const ws = new WebSocket('ws://__SERVER__/statusdashboard/socket');

    ws.onmessage = async evt => {
      const data = JSON.parse(evt.data || '""');

      switch (data.cmd) {
        case 'time':
          lastUpdated = new Date(data.time);
          lastUpdatedFormatted = lastUpdated.toLocaleTimeString('en-GB', {
            timeStyle: 'short',
          });
          break;

        case 'data':
          services = data.data;
          loading = false;
          break;

        default:
          break;
      }
    }
  });
</script>

<div class="center">
  <div class="ratio">
    <div class="tiles">
      <TileRawValue title="Last updated" value={lastUpdatedFormatted} />

      {#if !loading}
        {#each Object.entries(services) as [ id, service ] (id)}
          {@const isDown = service.lastBeat.down}
          <TileRawValue
            title={service.name.en}
            value={isDown ? 'down' : 'up'}
            color={isDown ? 'red' : 'green'}
          />
        {/each}
      {:else}
        loading
      {/if}
    </div>
  </div>
</div>

<style>
  :global(html), :global(body) {
    --tile-bg: #181818;
    --red: red;
    --green: green;
    --radius: 10px;
    --cols: 4;
    --rows: 3;

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

  .tiles {
    margin: 1rem;
    display: grid;
    grid-template-columns: repeat(var(--cols), 1fr);
    grid-template-rows: repeat(var(--rows), 1fr);
    gap: 1rem;
    justify-items: stretch;
  }
</style>
