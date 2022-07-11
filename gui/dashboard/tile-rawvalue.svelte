<script>
  import Tile from './tile.svelte';

  export let title;
  export let subtitle;
  export let color;
  export let value;
</script>

<Tile {title} {subtitle}>
  <div class="value {color}">
    {value}
  </div>
</Tile>

<style>
  .value {
    font-size: 3rem;
    font-weight: 600;
  }

  .red {
    color: var(--red);
  }

  .green {
    color: var(--green);
  }
</style>
