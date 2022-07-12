<script>
  import { formatDuration } from './lib';
  import { onMount } from 'svelte';

  export let title;
  export let subtitle;
  export let color;
  export let date;
  export let since;
  export let center = false;

  let formattedDuration = '';
  $: formattedDate = date ? date.toLocaleTimeString('en-GB', {
    timeStyle: 'short',
  }) : '';

  onMount(() => {
    if (since) {
      function updateDuration() {
        formattedDuration = formatDuration(
          new Date().getTime() - since.getTime()
        );
      }

      updateDuration();
      const interval = setInterval(updateDuration, 100);
      return () => clearInterval(interval);
    }
  });
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

      {#if date || since}
        <div class="time">
          {formattedDate}
          {#if date && since}<br />{/if}
          {formattedDuration}
        </div>
      {/if}
    </div>
  {/if}

  <div class="content" class:center><slot /></div>
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

  .tile.grey .content {
    color: var(--grey);
  }

  .desc {
    margin-bottom: 1rem;
    display: flex;
  }

  .desc .title {
    font-weight: 300;
    font-size: 1.7vw;
  }

  .desc .subtitle {
    font-weight: 200;
    font-size: 1.5vw;
  }

  .desc .time {
    opacity: 0.6;
    margin-left: auto;
    font-size: 1.3vw;
    text-align: right;
  }

  .content {
    flex-grow: 1;
    display: flex;
  }

  .content.center {
    justify-content: center;
    align-items: center;
  }
</style>
