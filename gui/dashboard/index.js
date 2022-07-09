import App from './app.svelte';

document.addEventListener('DOMContentLoaded', () => {
  new App({
    target: document.getElementsByTagName('body')[0],
  });
});
