<script>
  import Modal from './modal.svelte';
  import { settings } from './lib';

  let open = false;
  let showCopyCheck = false;

  function toggle() {
    open = !open;
  }

  function copy() {
    if (typeof navigator.clipboard?.writeText === 'function') {
      navigator.clipboard.writeText(JSON.stringify($settings));
      showCopyCheck = true;
      setTimeout(() => showCopyCheck = false, 2000);
    }
  }
</script>

<button class="settings" on:click={toggle}>
  Settings
</button>

<Modal title="Settings" bind:open>
  <div class="mb">
    <button on:click={copy} class="btn copy">
      Copy settings to clipboard
      {#if showCopyCheck}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 405.27 405.27">
          <path d="M393.4 124.42 179.6 338.21a40.57 40.57 0 0 1-57.36 0L11.88 227.84a40.56 40.56 0 0 1 57.35-57.37l81.7 81.7 185.1-185.1a40.57 40.57 0 0 1 57.37 57.36z"/>
        </svg>
      {/if}
    </button>
  </div>

  <label>
    Color theme
    <select bind:value={$settings.theme}>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
  </label>

  <label>
    Columns
    <input type="number" bind:value={$settings.cols} width="10" />
  </label>

  <label>
    Rows
    <input type="number" bind:value={$settings.rows} width="10" />
  </label>

  <label>
    Font size (REMs)
    <input type="number" bind:value={$settings.fontSize} width="10" step="0.1" />
  </label>
</Modal>

<style>
  button.settings {
    opacity: 0.4;
    color: var(--body-fg);
    padding: 0;
    display: grid;
  }

  button.settings:hover {
    opacity: 0.9;
  }

  button.copy svg {
    fill: var(--green);
    height: 1rem;
    width: 1rem;
    margin-left: 1rem;
  }
</style>
