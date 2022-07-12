<script>
  import Tile from './tile.svelte';

  export let title;
  export let subtitle;
  export let color;
  export let value;
  export let date;
  export let center = false;
  export let weight = 600;
</script>

<Tile {title} {subtitle} {color} {date}>
  <div class="value {color}" class:center style:font-weight={weight}>
    {value}
  </div>
</Tile>

<style>
  .value {
    font-size: 3rem;
    font-weight: 600;
  }

  .value.center {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
