<script>
  import Modal from './modal.svelte';
  import { settings } from './index';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';

  let open = false;
  let showCopyCheck = false;
  let options = {};

  let theme = 'dark';

  onMount(() => {
    ({ theme } = get(settings));
  });

  function fillOptions() {
    options = { theme };
  }

  function toggle() {
    open = !open;
  }

  function copy() {
    if (typeof navigator.clipboard?.writeText === 'function') {
      navigator.clipboard.writeText(JSON.stringify(options));
      showCopyCheck = true;
      setTimeout(() => showCopyCheck = false, 2000);
    }
  }

  function change() {
    fillOptions();
    settings.set(options);
  }
</script>

{#if !open}
  <button class="settings" on:click={toggle}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 262.39 262.39">
      <path fill="currentColor" d="M245.63 103.39h-9.91a107.45 107.45 0 0 0-10.96-26.43l7.02-7.02a16.76 16.76 0 0 0 0-23.7l-15.62-15.62a16.76 16.76 0 0 0-23.7 0l-7.02 7.01A107.48 107.48 0 0 0 159 26.68v-9.92C159 7.5 151.5 0 142.24 0h-22.09c-9.26 0-16.76 7.5-16.76 16.76v9.92a107.47 107.47 0 0 0-26.43 10.95l-7.02-7.01a16.76 16.76 0 0 0-23.7 0L30.62 46.24a16.76 16.76 0 0 0 0 23.7l7.01 7.02a107.45 107.45 0 0 0-10.95 26.43h-9.92c-9.25 0-16.76 7.5-16.76 16.76v22.1C0 151.5 7.5 159 16.76 159h9.92a107.5 107.5 0 0 0 10.95 26.43l-7.01 7.01a16.76 16.76 0 0 0 0 23.7l15.62 15.63a16.76 16.76 0 0 0 23.7 0l7.02-7.02a107.44 107.44 0 0 0 26.43 10.96v9.91c0 9.26 7.5 16.77 16.76 16.77h22.1c9.25 0 16.76-7.51 16.76-16.77v-9.91c9.37-2.49 18.24-6.2 26.43-10.96l7.02 7.02a16.76 16.76 0 0 0 23.7 0l15.62-15.62a16.76 16.76 0 0 0 0-23.7l-7.01-7.02A107.48 107.48 0 0 0 235.72 159h9.91c9.26 0 16.76-7.51 16.76-16.77v-22.09c0-9.26-7.5-16.76-16.76-16.76zm-114.43 87.8c-33.08 0-60-26.91-60-60 0-33.08 26.92-60 60-60s60 26.92 60 60c0 33.09-26.92 60-60 60z"/><path d="M131.2 101.2c-16.54 0-30 13.46-30 30s13.46 30 30 30 30-13.46 30-30-13.46-30-30-30z"/>
    </svg>
  </button>
{/if}

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

  <label for="theme">
    Color theme
    <select id="theme" bind:value={theme} on:change={change}>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
  </label>
</Modal>

<style>
  button.settings {
    position: fixed;
    bottom: 0;
    right: 0;
    opacity: 0.4;
    color: #fff;
  }

  button.settings svg {
    width: 20px;
    height: 20px;
    transition: linear 0.4s;
  }

  button.settings:hover {
    opacity: 0.9;
  }

  button.settings:hover svg {
    transform: rotate(90deg);
  }

  button.copy svg {
    fill: var(--green);
    height: 1rem;
    width: 1rem;
    margin-left: 1rem;
  }
</style>
