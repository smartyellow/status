<script>
  import { formatDuration } from './lib';
  import { onMount } from 'svelte';

  export let tile;

  let formattedDuration = '';
  $: formattedDate = tile.service?.checked ? tile.service.checked.toLocaleTimeString('en-GB', {
    timeStyle: 'short',
  }) : '';

  onMount(() => {
    function updateDuration() {
      formattedDuration = formatDuration(
        new Date().getTime() - tile.since.getTime()
      );
    }

    if (tile.since) {
      updateDuration();
      const interval = setInterval(updateDuration, 100);
      return () => clearInterval(interval);
    }
  });
</script>

<div class="tile prio{tile.prio}">
  <div class="desc">
    {#if tile.service?.name?.en}
      <div class="title">{tile.service.name.en}</div>
    {/if}

    {#if tile.service?.cluster}
      <div class="subtitle">{tile.service.cluster}</div>
    {/if}

    {#if tile.badges?.length}
      <div class="badges">
        {#each tile.badges as badge}
          <span class="badge">{badge}</span>
        {/each}
      </div>
    {/if}
  </div>

  <div class="bottom">
    <div class="content">
      <div class="statustext">
        {tile.statusText}
      </div>
    </div>

    {#if tile.date || tile.since}
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

  .tile.prio2 {
    background-color: var(--red);
    border-color: var(--red);
    color: #fff;
  }

  .tile.prio1 {
    background-color: var(--orange);
    border-color: var(--orange);
    color: #fff;
  }

  .tile.prio0 {
    border-color: var(--green);
    background-color: var(--green);
    color: #fff;
  }

  .tile.prio-1 {
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

  .badges {
    margin-top: 0.2em;
  }
  .badges .badge {
    display: inline-block;
    margin-right: 0.3em;
    background-color: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(0, 0, 0, 0.4);
    padding: 0.2em 0.4em;
    border-radius: 0.4em;
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

  .statustext {
    font-size: 3em;
    font-weight: 600;
    margin-top: auto;
  }
</style>
