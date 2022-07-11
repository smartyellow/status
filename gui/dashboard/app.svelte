<script>
  import { onMount } from 'svelte';
  import TileRawValue from './tile-rawvalue.svelte';
  import Tiles from './tiles.svelte';
  import Settings from './settings.svelte';

  let lastUpdated = new Date();
  let lastUpdatedFormatted = '';
  let services = {};
  let servicesUp = {};
  let servicesDown = {};
  let servicesUnknown = {};
  let servicesInCluster = {};
  let servicesInClusterUnknown = {};
  const clusters = JSON.parse('__CLUSTERS__');
  const clusterKeys = clusters ? Object.keys(clusters) : false;
  let currentClusterIndex = -1;
  let loading = true;
  let lock = false;

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
          while (lock) {}

          services = data.data;
          const ids = Object.keys(services);

          for (const id of ids) {
            const service = services[id];
            if (!service.lastBeat || !service.lastBeat.date) {
              servicesUnknown = {
                ...servicesUnknown,
                [id]: service,
              };
            }
            else if (service.lastBeat.down) {
              servicesDown = {
                ...servicesDown,
                [id]: service,
              };
            }
            else {
              servicesUp = {
                ...servicesUp,
                [id]: service,
              };
            }
          }

          loading = false;
          break;

        default:
          break;
      }
    }
  });

  $: if (clusterKeys?.length && !loading) {
      function nextCluster() {
        lock = true;
        currentClusterIndex++;

        if (currentClusterIndex >= clusterKeys.length) {
          currentClusterIndex = 0;
        }

        const inClusterTemp = {};
        const inClusterTempUnknown = {};
        const currentClusterKey = clusterKeys[currentClusterIndex];

        for (const [ id, s ] of Object.entries(services)) {
          if (s.cluster === currentClusterKey) {
            if (!s.lastBeat || !s.lastBeat.date) {
              inClusterTempUnknown[id] = s;
            }
            else {
              inClusterTemp[id] = s;
            }
          }
        }

        servicesInCluster = inClusterTemp;
        servicesInClusterUnknown = inClusterTempUnknown;
        lock = false;
      }

      nextCluster();
      setInterval(() => nextCluster, 10_000);
    }
</script>

<Settings />

<div class="center">
  <div class="ratio">
    <div class="tiles">
      <TileRawValue title="Last updated" value={lastUpdatedFormatted} />

      {#if !loading}
        <Tiles services={servicesDown} color="red" value="down" />

        {#if !clusterKeys?.length}
          <Tiles services={servicesUp} color="green" value="up" />
          <Tiles services={servicesUnknown} color="grey" value="no data" />
        {:else}
          <Tiles services={servicesInCluster} color="green" value="up" />
          <Tiles services={servicesInClusterUnknown} color="grey" value="no data" />
        {/if}
      {:else}
        loading
      {/if}
    </div>
  </div>
</div>

<style>
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
