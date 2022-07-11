<script>
  import { onMount } from 'svelte';
  import TileRawValue from './tile-rawvalue.svelte';
  import Settings from './settings.svelte';

  const size = 3 * 4;
  let lastUpdated = new Date();
  let lastUpdatedFormatted = '';
  let services = [];
  let pageNum = -1;

  function tileProps(service) {
    let props = {
      title: service.name.en,
      subtitle: service.cluster,
      date: service.lastBeat?.date ? new Date(service.lastBeat.date) : undefined,
    };

    if (!service.lastBeat?.date) {
      props.value = 'no data';
      props.color = 'grey';
      props.sort = 20;
    }
    if (service.lastBeat.down) {
      props.value = 'down';
      props.color = 'red';
      props.sort = 0;
    }
    else {
      props.value = 'up';
      props.color = 'green';
      props.sort = 10;
    }

    return props;
  }

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
          const tempServices = [];
          const d = data.data;
          const ids = Object.keys(d);
          ids.sort((a, b) => tileProps(d[a]).sort - tileProps(d[b]).sort);

          if ((ids.length > size) || (pageNum === -1)) {
            pageNum++;
          }

          if (pageNum * size >= ids.length) {
            pageNum = 0;
          }

          for (let i = pageNum * size; (i < ids.length) && (i < size + size * pageNum); i++) {
            tempServices.push(d[ids[i]]);
          }

          services = tempServices;
          break;

        default:
          break;
      }
    }
  });
</script>

<Settings />

<div class="center">
  <div class="ratio">
    <div class="tiles">
      <TileRawValue title="Last updated" value={lastUpdatedFormatted} />

      {#each services as service}
        <TileRawValue {...tileProps(service)} />
      {/each}
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
