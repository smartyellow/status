import App from './app.svelte';
import { writable } from 'svelte-local-storage-store';

new App({ target: document.body });

export const settings = writable('settings', {
  theme: 'dark',
});
