<script>
  import Tile from './tile.svelte';

  export let title;
  export let subtitle;
  export let color;
  export let value;
  export let date;
  export let since;
  export let weight = 600;
</script>

<Tile {title} {subtitle} {color} {date} {since}>
  <div class="value {color}" style:font-weight={weight}>
    {value}
  </div>
</Tile>

<style>
  .value {
    font-size: 3em;
    font-weight: 600;
    margin-top: auto;
  }
</style>
