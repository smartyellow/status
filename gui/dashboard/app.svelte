<script>
  import { onMount } from 'svelte';
  import Tile from './tile.svelte';
  import Settings from './settings.svelte';
  import { flip } from 'svelte/animate';
  import { ringBell, settings, shuffle } from './lib';
  import { connect } from './apiclient';

  const [ send, receive ] = shuffle;
  let maxNumberOfTilesOnPage = ($settings.cols || 4) * ($settings.rows || 3);
  let pageNum = -1;
  let pageCount = 1;
  let allTiles = [];
  let tilesOnPage = [];
  let time = '';
  let hasData = false;

  function previousPage() {
    pageNum--;
    if (pageNum < 0) {
      pageNum = pageCount - 1;
    }
  }

  function nextPage() {
    pageNum++;
    if (pageNum >= pageCount) {
      pageNum = 0;
    }
  }

  function organiseGrid(goToNextPage = true) {
    const newTiles = allTiles.sort((a, b) => b.prio - a.prio);
    const pinnedTilesCount = allTiles.filter(t => t.prio > 0).length;
    const placesLeft = maxNumberOfTilesOnPage - pinnedTilesCount;
    pageCount = Math.ceil(newTiles.length / placesLeft);

    if (((newTiles.length >= placesLeft) && goToNextPage) || (pageNum === -1)) {
      nextPage();
    }

    tilesOnPage = [
      ...newTiles.slice(0, pinnedTilesCount),
      ...newTiles.slice(pinnedTilesCount + (pageNum * placesLeft)),
    ].slice(0, maxNumberOfTilesOnPage);
  }

  function keydown(event) {
    switch (event.code) {
      case 'ArrowLeft':
      case 'PageUp':
        event.preventDefault();
        previousPage();
        organiseGrid(false);
        break;

      case 'ArrowRight':
      case 'PageDown':
        event.preventDefault();
        nextPage();
        organiseGrid(false);
        break;

      case 'Home':
        event.preventDefault();
        pageNum = 0;
        organiseGrid(false);
        break;

      case 'End':
        event.preventDefault();
        pageNum = pageCount - 1;
        organiseGrid(false);
        break;

      default:
        if (event.code.startsWith('Digit')) {
          event.preventDefault();
          let num = parseInt(event.code.slice(5));
          if (!isNaN(num)) {
            if (num > pageCount) {
              num = pageCount;
            }
            pageNum = num - 1;
            organiseGrid(false);
          }
        }
        break;
    }
  }

  onMount(async () => {
    await connect({
      onData: ({ tiles, newOutage }) => {
        allTiles = tiles?.map(tile => {
          if (tile?.service?.checked) {
            tile.service.checked = new Date(tile.service.checked);
          }
          return tile;
        });

        if (newOutage) {
          ringBell();
        }

        organiseGrid();
        hasData = true;
      },
    });

    const clockInterval = setInterval(() => {
      time = new Date().toLocaleTimeString('en-GB', { timeStyle: 'medium' });
    }, 100);

    settings.subscribe(s => {
      maxNumberOfTilesOnPage = (s.cols || 4) * (s.rows || 3);
      if (hasData) {
        organiseGrid();
      }
    });

    return () => clearInterval(clockInterval);
  });
</script>

<svelte:window on:keydown={keydown} />

<div
  class="center theme-{$settings.theme}"
  style="
    --cols: {$settings.cols || 4};
    --rows: {$settings.rows || 3};
    font-size: {$settings.fontSize}rem;
  "
>
  <div class="ratio">
    <div class="tiles">
      {#each tilesOnPage || [] as tile (tile.serviceId)}
        <div
          in:receive={{ key: tile.serviceId }}
          out:send={{ key: tile.serviceId }}
          animate:flip={{ duration: $settings.animate ? (d => Math.sqrt(d) * 120) : 0 }}
        >
          <Tile {tile} />
        </div>
      {/each}
    </div>

    <div class="footer">
      <div class="time">{time}</div>
      {#if pageCount > 1}
        <div>
          <span class="pagecount">{pageNum + 1}/{pageCount}</span>
          <span class="pagination">
            {#each Array(pageCount).fill('') as _, i}
              <em class:active={pageNum === i}></em>
            {/each}
          </span>
        </div>
      {/if}
      <Settings />
    </div>
  </div>
</div>

<style>
  .center {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background-color: var(--body-bg);
    color: var(--body-fg);
  }

  .ratio {
    height: calc(56.25vw - 2rem);
    left: 50%;
    max-height: calc(100vh - 2rem);
    max-width: calc(177.77778vh - 2rem);
    position: absolute;
    top: 50%;
    transform: translate(-50%,-50%);
    width: calc(100vw - 2rem);
  }

  .tiles {
    display: grid;
    grid-template-columns: repeat(var(--cols), 1fr);
    grid-template-rows: repeat(var(--rows), 1fr);
    gap: 1rem;
    align-items: stretch;
    justify-content: stretch;
    height: calc(100% - 50px);
  }

  .tiles > * {
    display: flex;
    align-items: stretch;
  }

  .tiles > * > :global(.tile) {
    width: 100%;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    height: 50px;
    font-size: 1.2em;
    align-items: flex-end;
  }

  .footer > .time {
    width: 5em;
  }

  .pagination em {
    display: inline-block;
    margin-left: 0.5rem;
    height: 10px;
    width: 10px;
    border-radius: 5px;
    background-color: #fff;
    opacity: 0.4;
    vertical-align: middle;
  }

  .pagination em.active {
    opacity: 1;
  }

  .pagecount {
    width: 2em;
    display: inline-block;
  }
</style>
