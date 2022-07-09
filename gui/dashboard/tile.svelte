<script>
  export let title;
  export let subtitle;
</script>

<div class="tile">
  {#if title}
    <div class="title">{title}</div>
  {/if}

  {#if subtitle}
    <div class="subtitle">{subtitle}</div>
  {/if}
</div>

<style>
  .tile {
    padding: 1rem;
    background-color: var(--tile-bg);
    border-radius: var(--radius);
  }

  .title, .subtitle {
    font-size: 1.3rem;
  }

  .title {
    font-weight: 600;
  }
</style>
