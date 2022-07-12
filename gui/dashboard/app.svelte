<script>
  import { onMount } from 'svelte';
  import TileRawValue from './tile-rawvalue.svelte';
  import Settings from './settings.svelte';
  //import { flip } from 'svelte/animate';
  //import { shuffle } from './lib';

  //const [ send, receive ] = shuffle;
  const size = 3 * 4;
  let lastUpdated = new Date();
  let lastUpdatedFormatted = '';
  let servicesUp = [];
  let servicesDown = [];
  let servicesUnknown = [];
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
          ({ servicesUp, servicesDown, servicesUnknown } = data);
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

      {#each servicesDown as service (service.id)}
        <TileRawValue {...tileProps(service)} />
      {/each}
      {#each servicesUp as service (service.id)}
        <TileRawValue {...tileProps(service)} />
      {/each}
      {#each servicesUnknown as service (service.id)}
        <TileRawValue {...tileProps(service)} />
      {/each}

      <!--{#each services as service (service.id)}
        <div
          in:receive={{ key: service.id }}
          out:send={{ key: service.id }}
          animate:flip
        >
          <TileRawValue {...tileProps(service)} />
        </div>
      {/each}-->
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
