<script>
  export let title;
  export let subtitle;
</script>

<div class="tile">
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
  .desc {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }

  .tile {
    padding: 1rem;
    background-color: var(--tile-bg);
    border-radius: var(--radius);
  }

  .title {
    font-weight: 200;
  }

  .subtitle {
    font-weight: 100;
  }
</style>
