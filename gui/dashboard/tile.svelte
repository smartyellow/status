<script>
  export let title;
  export let subtitle;
  export let color;
</script>

<div class="tile {color}">
  {#if title || subtitle}
    <div class="desc">
      {#if title}
        <div class="title">{title}</div>
      {/if}

      {#if subtitle}
        <div class="subtitle">{subtitle}</div>
      {/if}
    </div>
  {/if}

  <slot />
</div>

<style>
  .tile {
    padding: 1rem;
    background-color: var(--tile-bg);
    border-radius: var(--radius);
    border: 2px solid var(--tile-bg);
  }

  .tile.red {
    background-color: var(--red);
    border-color: var(--red);
    color: #fff;
  }

  .tile.green {
    border-color: var(--green);
  }

  .desc {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }

  .desc .title {
    font-weight: 200;
  }

  .desc .subtitle {
    font-weight: 100;
  }
</style>
