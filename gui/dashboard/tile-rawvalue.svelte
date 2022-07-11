<script>
  import Tile from './tile.svelte';

  export let title;
  export let subtitle;
  export let color;
  export let value;
  export let date;
</script>

<Tile {title} {subtitle} {color} {date}>
  <div class="value {color}">
    {value}
  </div>
</Tile>

<style>
  .value {
    font-size: 3rem;
    font-weight: 600;
  }
</style>
