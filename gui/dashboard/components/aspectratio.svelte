<div class="center">
  <div class="ratio">
    <slot />
  </div>
</div>

<style>
  .center {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
  }

  .ratio {
    border-radius: var(--radius);
    background-color: var(--dark);
    background-color: red;
    height: 56.25vw;
    left: 50%;
    max-height: 100vh;
    max-width: 177.77778vh;
    position: absolute;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 100vw;
  }
</style>
