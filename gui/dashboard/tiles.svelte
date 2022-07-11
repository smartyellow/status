<script>
  import TileRawValue from './tile-rawvalue.svelte';

  export let services;
  export let color;
  export let value;
</script>

{#each Object.entries(services) as [ id, service ] (id)}
  <TileRawValue
    title={service.name.en}
    date={service.lastBeat.date ? new Date(service.lastBeat.date) : false}
    {value}
    {color}
  />
{/each}
