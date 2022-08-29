<script>
  import { formatDuration } from './lib';
  import { onMount } from 'svelte';

  export let title;
  export let subtitle;
  export let color;
  export let date;
  export let since;

  let formattedDuration = '';
  $: formattedDate = date ? date.toLocaleTimeString('en-GB', {
    timeStyle: 'short',
  }) : '';

  onMount(() => {
    function updateDuration() {
      formattedDuration = formatDuration(
        new Date().getTime() - since.getTime()
      );
    }

    if (since) {
      updateDuration();
      const interval = setInterval(updateDuration, 100);
      return () => clearInterval(interval);
    }
  });
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

  <div class="bottom">
    <div class="content"><slot /></div>
    {#if date || since}
      <div class="time">
        {#if formattedDate}<div>{formattedDate}</div>{/if}
        {#if formattedDuration}<div>{formattedDuration}</div>{/if}
      </div>
    {/if}
  </div>
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
    color: #fff;
  }

  .tile.grey {
    opacity: 0.5;
    border-color: var(--grey);
  }

  .tile.grey .bottom {
    color: var(--grey);
  }

  .desc {
    margin-bottom: 1rem;
  }

  .desc .title {
    font-weight: 300;
    font-size: 1.3em;
  }

  .desc .subtitle {
    font-weight: 300;
    font-size: 1.1em;
    opacity: 0.7;
  }

  .bottom {
    display: flex;
    margin-top: auto;
  }

  .bottom .time {
    margin: auto 0 0 auto;
    opacity: 0.6;
    font-size: 1em;
    text-align: right;
    display: flex;
    align-items: flex-end;
    flex-direction: column;
  }

  .bottom .content {
    flex-grow: 1;
    display: flex;
  }
</style>
