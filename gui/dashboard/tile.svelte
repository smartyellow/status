<script>
  export let title;
  export let subtitle;
  export let color;
  export let date;
</script>

<div class="tile {color}">
  {#if title || subtitle || date}
    <div class="desc">
      <div>
        {#if title}
          <div class="title">{title}</div>
        {/if}

        {#if subtitle}
          <div class="subtitle">{subtitle}</div>
        {/if}
      </div>

      {#if date}
        <div class="time">{date.toLocaleTimeString('en-GB', {
          timeStyle: 'short',
        })}</div>
      {/if}
    </div>
  {/if}

  <div class="content"><slot /></div>
</div>

<style>
  .tile {
    padding: 1rem;
    background-color: var(--tile-bg);
    border-radius: var(--radius);
    border: 2px solid var(--tile-bg);
    display: flex;
    flex-direction: column;
  }

  .tile.red {
    background-color: var(--red);
    border-color: var(--red);
    color: #fff;
  }

  .tile.green {
    border-color: var(--green);
    background-color: var(--green);
  }

  .tile.grey {
    opacity: 0.5;
    border-color: var(--grey);
  }

  .tile.grey .content {
    color: var(--grey);
  }

  .desc {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    display: flex;
  }

  .desc .title {
    font-weight: 300;
  }

  .desc .subtitle {
    font-weight: 100;
  }

  .desc .time {
    opacity: 0.6;
    margin-left: auto;
  }

  .content {
    flex-grow: 1;
  }
</style>
