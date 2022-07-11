<script>
  import TileRawValue from './tile-rawvalue.svelte';

  export let services;
</script>

{#each Object.entries(services) as [ id, service ] (id)}
  {@const isDown = service.lastBeat.down}
  <TileRawValue
    title={service.name.en}
    value={isDown ? 'down' : 'up'}
    color={isDown ? 'red' : 'green'}
  />
{/each}
