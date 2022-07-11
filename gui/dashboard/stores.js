import { get, writable } from 'svelte/store';

function createSettingsStore() {
  const s = writable(0);

  function updateStorage(val) {
    window.localStorage.setItem('statusdash', JSON.stringify(val));
    s.set(val);
  }

  return {
    subscribe: s.subscribe,
    set: val => updateStorage(val),
    update: val => updateStorage({ ...get(s), val }),
  };
}

export const settings = createSettingsStore();
