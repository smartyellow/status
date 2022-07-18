<script>
  import { onMount } from 'svelte';
  import TileRawValue from './tile-rawvalue.svelte';
  import Settings from './settings.svelte';
  import { flip } from 'svelte/animate';
  import { settings, shuffle, ringBell } from './lib';

  const [ send, receive ] = shuffle;
  let size = ($settings.cols || 4) * ($settings.rows || 3);
  let placesLeft = size;
  let pageNum = -1;
  let pageCount = 1;
  let pageCountFreePlaces = 1;
  let tiles = [];
  let time = '';
  let globalData = {};
  let hasData = false;

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
    pageCount = Math.ceil(upOrUnknown.length / size);
    placesLeft = size - servicesTemp.length;
    pageCountFreePlaces = Math.ceil(upOrUnknown.length / placesLeft);

    if (pageNum === -1 || total >= size) {
      pageNum++;

      if (pageNum > pageCount) {
        pageNum = 0;
      }
    }

    const offset = placesLeft * pageNum;
    if (placesLeft > 0) {
      servicesTemp.push(
        ...upOrUnknown.slice(offset, placesLeft + offset)
      );
    }

    tiles = servicesTemp;
  }

  onMount(() => {
    const ws = new WebSocket(
      window.location.href.replace('http', 'ws') + '/socket'
    );

    ws.onmessage = async evt => {
      const data = JSON.parse(evt.data || '""');

      switch (data.cmd) {
        case 'data':
          globalData = data;
          organiseGrid();
          hasData = true;
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
      size = (s.cols || 4) * (s.rows || 3);
      if (hasData) organiseGrid();
    });

    return () => clearInterval(clockInterval);
  });
</script>

<div
  class="center theme-{$settings.theme}"
  style="
    --cols: {$settings.cols || 4};
    --rows: {$settings.rows || 3};
    font-size: {$settings.fontSize}rem;
  "
>
  <div class="ratio">
    <div class="tiles">
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

    <div class="footer">
      <div class="time">{time}</div>
      {#if pageCountFreePlaces > 1}
        <div class="pagination">
          {#each Array(pageCountFreePlaces).fill('') as _, i}
            <em class:active={pageNum === i}></em>
          {/each}
        </div>
      {/if}
      <Settings />
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
    height: calc(56.25vw - 2rem);
    left: 50%;
    max-height: calc(100vh - 2rem);
    max-width: calc(177.77778vh - 2rem);
    position: absolute;
    top: 50%;
    transform: translate(-50%,-50%);
    width: calc(100vw - 2rem);
  }

  .tiles {
    display: grid;
    grid-template-columns: repeat(var(--cols), 1fr);
    grid-template-rows: repeat(var(--rows), 1fr);
    gap: 1rem;
    align-items: stretch;
    justify-content: stretch;
    height: calc(100% - 50px);
  }

  .tiles > * {
    display: flex;
    align-items: stretch;
  }

  .tiles > * > :global(.tile) {
    width: 100%;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    height: 50px;
    font-size: 1.2em;
  }

  .pagination em {
    display: inline-block;
    margin-left: 0.5rem;
    height: 10px;
    width: 10px;
    border-radius: 5px;
    background-color: #fff;
    opacity: 0.4;
  }

  .pagination em.active {
    opacity: 1;
  }
</style>
