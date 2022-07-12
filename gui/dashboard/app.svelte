<script>
  import { onMount } from 'svelte';
  import TileRawValue from './tile-rawvalue.svelte';
  import Settings from './settings.svelte';
  import { flip } from 'svelte/animate';
  import { proportionalGrid, settings, shuffle, ringBell } from './lib';

  const [ send, receive ] = shuffle;
  let size = ($settings.cols || 4) * ($settings.rows || 3) - 1;
  let pageNum = -1;
  let tiles = [];
  let time = '';
  let globalData = {};

  function tileProps(service) {
    let props = {
      title: service.name.en,
      subtitle: service.cluster,
      date: service.lastBeat?.date ? new Date(service.lastBeat.date) : undefined,
      since: service.checked ? new Date(service.checked) : undefined,
    };

    if (!service.lastBeat?.date) {
      props.value = 'no data';
      props.color = 'grey';
      props.sort = 20;
    }
    else if (service.lastBeat.down) {
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

  function organiseGrid() {
    let servicesTemp = [];
    const { servicesUp, servicesDown, servicesUnknown, total } = globalData;
    const upOrUnknown = [ ...servicesUp, ...servicesUnknown ];
    servicesTemp = servicesDown.slice(0, size);

    if (pageNum === -1 || total >= size) {
      pageNum++;

      if (pageNum > Math.ceil(upOrUnknown.length / size)) {
        pageNum = 0;
      }
    }

    const placesLeft = size - servicesTemp.length;
    const offset = placesLeft * pageNum;
    if (placesLeft > 0) {
      servicesTemp.push(
        ...upOrUnknown.slice(offset, placesLeft + offset)
      );
    }

    tiles = servicesTemp;
  }

  onMount(() => {
    const ws = new WebSocket('ws://__SERVER__/statusdashboard/socket');

    ws.onmessage = async evt => {
      const data = JSON.parse(evt.data || '""');

      switch (data.cmd) {
        case 'data':
          globalData = data;
          organiseGrid();
          break;

        case 'bell':
          ringBell();
          break;

        default:
          break;
      }
    }

    const clockInterval = setInterval(() => {
      time = new Date().toLocaleTimeString('en-GB', {
        timeStyle: 'medium',
      });
    }, 100);

    settings.subscribe(s => {
      size = (s.cols || 4) * (s.rows || 3) - 1;
      organiseGrid();
    });

    return () => clearInterval(clockInterval);
  });
</script>

<svelte:window on:resize={proportionalGrid} />
<Settings />

<div
  class="center theme-{$settings.theme}"
  style="--cols: {$settings.cols || 4}; --rows: {$settings.rows || 3};"
>
  <div class="ratio">
    <div class="tiles">
      <TileRawValue value={time} center weight={200} />

      {#each tiles as tile (tile.id)}
        <div
          in:receive={{ key: tile.id }}
          out:send={{ key: tile.id }}
          animate:flip
        >
          <TileRawValue {...tileProps(tile)} />
        </div>
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
    background-color: var(--body-bg);
    color: var(--body-fg);
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
    margin: 1rem 0;
    display: flex;
    justify-content: center;
  }

  .tiles {
    display: grid;
    grid-template-columns: repeat(var(--cols), 1fr);
    grid-template-rows: repeat(var(--rows), 1fr);
    gap: 1rem;
    justify-items: stretch;
    height: calc(100% - 2rem);
    width: calc(100% - 2rem);
  }

  .tiles > * {
    display: flex;
    align-items: stretch;
  }

  .tiles > * > :global(.tile) {
    width: 100%;
  }
</style>
