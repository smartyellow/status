<script>
  export let title = '';
  export let open = false;

  function close() {
    open = false;
  }
</script>

<div class="modal-bg" class:open>
  <div class="modal">
    <div class="header">
      <div class="title">{title}</div>
      <button class="close" on:click={close}>&times;</button>
    </div>

    <div class="body">
      <slot />
    </div>
  </div>
</div>

<style>
  .modal-bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top: 3rem;
    background-color: rgba(0, 0, 0, 0.4);
    align-items: center;
    justify-content: center;
    display: none;
    z-index: 10;
  }

  .modal-bg.open {
    display: flex;
  }

  .modal {
    background-color: var(--tile-bg);
    border-radius: var(--radius);
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 500px;
    z-index: 11;
  }

  .header {
    display: flex;
    align-items: center;
  }

  .header button.close {
    margin-left: auto;
    overflow-y: auto;
  }

  .header .title {
    font-weight: 600;
    font-size: 1.4rem;
    margin-left: 1rem;
  }

  .body {
    flex-grow: 1;
    padding: 1rem;
  }
</style>
