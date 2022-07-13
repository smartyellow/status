import { get, writable } from 'svelte/store';
import { quintOut } from 'svelte/easing';
import { crossfade } from 'svelte/transition';

function createSettingsStore() {
  const defaults = {
    theme: 'dark',
    cols: 4,
    rows: 3,
  };

  const s = writable(defaults);

  function updateStorage(val) {
    window.localStorage.setItem('statusdash', JSON.stringify({
      ...defaults,
      ...val,
    }));
    s.set(val);
  }

  const localStorageString = window.localStorage.getItem('statusdash');
  let localStorage = {};

  try {
    localStorage = JSON.parse(localStorageString);
  }
  catch {
    localStorage = {};
  }

  updateStorage(localStorage);

  return {
    subscribe: s.subscribe,
    set: val => updateStorage(val),
    update: val => updateStorage({ ...get(s), ...val }),
  };
}

export const settings = createSettingsStore();

export const shuffle = crossfade({
  fallback(node) {
    const style = getComputedStyle(node);
    const transform = style.transform === 'none' ? '' : style.transform;

    return {
      duration: 100,
      easing: quintOut,
      css: t => `
        transform: ${transform} scale(${t});
        opacity: ${t}
      `,
    };
  },
});

export function ringBell() {
  const bell = new Audio(window.location.href + '/sound');
  bell.loop = true;
  bell.addEventListener('canplaythrough', () => bell.play());
  window.addEventListener('keydown', () => bell.pause());
}

export function formatDuration(ms) {
  // modified from https://www.30secondsofcode.org/js/s/format-duration

  if (ms < 0) {
    ms = -ms;
  }
  const time = {
    d: Math.floor(ms / 86400000),
    h: Math.floor(ms / 3600000) % 24,
    m: Math.floor(ms / 60000) % 60,
    s: Math.floor(ms / 1000) % 60,
  };
  return Object.entries(time)
    .filter(val => val[1] !== 0)
    .map(([ key, val ]) => `${val} ${key}`)
    .join(' ');
}
