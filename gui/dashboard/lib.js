import { get, writable } from 'svelte/store';
import { quintOut } from 'svelte/easing';
import { crossfade } from 'svelte/transition';

function createSettingsStore() {
  const s = writable({
    theme: 'dark',
    cols: 4,
    rows: 3,
  });

  function updateStorage(val) {
    window.localStorage.setItem('statusdash', JSON.stringify(val));
    s.set(val);
  }

  updateStorage(JSON.parse(window.localStorage.getItem('statusdash')));

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
      duration: 400,
      easing: quintOut,
      css: t => `
        transform: ${transform} scale(${t});
        opacity: ${t}
      `,
    };
  },
});

export function ringBell() {
  const bell = new Audio('http://__SERVER__/statusdashboard/sound');
  bell.addEventListener('canplaythrough', () => bell.play());
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

export function proportionalGrid() {
  const container = document.querySelector('.center');
  const w = container.clientWidth;
  const h = container.clientHeight;
  const tileW = 400;
  const tileH = 300;
  const availableCols = Math.floor(w / tileW);
  const availableRows = Math.floor(h / tileH);
  console.log(w, h, availableCols, availableRows);

  settings.update({
    cols: availableCols,
    rows: availableRows,
  });
}
