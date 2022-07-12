import { get, writable } from 'svelte/store';
//import { quintOut } from 'svelte/easing';
//import { crossfade } from 'svelte/transition';

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

/*
export const shuffle = crossfade({
  fallback(node) {
    const style = getComputedStyle(node);
    const transform = style.transform === 'none' ? '' : style.transform;

    return {
      duration: 600,
      easing: quintOut,
      css: t => `
        transform: ${transform} scale(${t});
        opacity: ${t}
      `,
    };
  },
});
*/
