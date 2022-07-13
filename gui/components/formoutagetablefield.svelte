<script>

import { createEventDispatcher, onMount } from 'svelte';
import { api } from 'helpers/webdesq/stores.js';

export let value = ''; // contains webservice id
export let specs = {};
export let language = 'en';
export let translate = s => s;

const icons = {
  server: '<path d="M0 308.58v150.83a57.73 57.73 0 0 0 10.69 33.38H757.3a57.62 57.62 0 0 0 10.7-33.37V308.58a57.73 57.73 0 0 0-10.69-33.38H10.7A57.76 57.76 0 0 0 0 308.58Zm665.6 81.82a12.8 12.8 0 1 1-.01 25.6 12.8 12.8 0 0 1 .01-25.6ZM640 352a12.8 12.8 0 1 1 0 25.61 12.8 12.8 0 0 1 0-25.61Zm-25.6 38.4a12.8 12.8 0 1 1-.01 25.6 12.8 12.8 0 0 1 0-25.6ZM588.8 352a12.8 12.8 0 1 1 0 25.61 12.8 12.8 0 0 1 0-25.61Zm-25.6 38.4a12.8 12.8 0 1 1 0 25.6 12.8 12.8 0 0 1 0-25.6ZM537.6 352a12.8 12.8 0 1 1-.01 25.6 12.8 12.8 0 0 1 .01-25.6ZM512 390.4a12.8 12.8 0 1 1 0 25.6 12.8 12.8 0 0 1 0-25.6ZM486.4 352a12.8 12.8 0 1 1-.01 25.61 12.8 12.8 0 0 1 0-25.61Zm-25.6 38.4a12.8 12.8 0 1 1 0 25.6 12.8 12.8 0 0 1 0-25.6ZM435.2 352a12.8 12.8 0 1 1 0 25.61 12.8 12.8 0 0 1 0-25.61Zm-300.8-25.6A57.67 57.67 0 0 1 192 384a57.67 57.67 0 0 1-57.6 57.6A57.67 57.67 0 0 1 76.8 384a57.67 57.67 0 0 1 57.6-57.6Zm622.91-76.8A57.76 57.76 0 0 0 768 216.22V65.38A59.05 59.05 0 0 0 709.02 6.4H58.98A59.05 59.05 0 0 0 0 65.38V216.2a57.73 57.73 0 0 0 10.69 33.39H757.3Zm-91.7-102.4a12.8 12.8 0 1 1-.02 25.6 12.8 12.8 0 0 1 .01-25.6ZM640 108.8a12.8 12.8 0 1 1 0 25.61 12.8 12.8 0 0 1 0-25.6Zm-25.6 38.4a12.8 12.8 0 1 1-.01 25.6 12.8 12.8 0 0 1 0-25.6Zm-25.6-38.4a12.8 12.8 0 1 1 0 25.61 12.8 12.8 0 0 1 0-25.6Zm-25.6 38.4a12.8 12.8 0 1 1 0 25.6 12.8 12.8 0 0 1 0-25.6Zm-25.6-38.4a12.8 12.8 0 1 1-.01 25.6 12.8 12.8 0 0 1 .01-25.6ZM512 147.2a12.8 12.8 0 1 1 0 25.6 12.8 12.8 0 0 1 0-25.6Zm-25.6-38.4a12.8 12.8 0 1 1-.01 25.61 12.8 12.8 0 0 1 0-25.6Zm-25.6 38.4a12.8 12.8 0 1 1 0 25.6 12.8 12.8 0 0 1 0-25.6Zm-25.6-38.4a12.8 12.8 0 1 1 0 25.61 12.8 12.8 0 0 1 0-25.6ZM134.4 83.2a57.67 57.67 0 0 1 57.6 57.6 57.67 57.67 0 0 1-57.6 57.6 57.67 57.67 0 0 1-57.6-57.6 57.67 57.67 0 0 1 57.6-57.6ZM10.69 518.4A57.76 57.76 0 0 0 0 551.78v150.83c0 32.53 26.46 59 58.98 59H709a59.05 59.05 0 0 0 58.99-59V551.79a57.73 57.73 0 0 0-10.69-33.38Zm123.7 166.4a57.67 57.67 0 0 1-57.59-57.6 57.67 57.67 0 0 1 57.6-57.6 57.67 57.67 0 0 1 57.6 57.6 57.67 57.67 0 0 1-57.6 57.6Zm300.8-64a12.8 12.8 0 1 1 .02-25.6 12.8 12.8 0 0 1-.01 25.6Zm25.61 38.4a12.8 12.8 0 1 1 0-25.61 12.8 12.8 0 0 1 0 25.6Zm25.6-38.4a12.8 12.8 0 1 1 .01-25.6 12.8 12.8 0 0 1-.01 25.6Zm25.6 38.4a12.8 12.8 0 1 1 0-25.61 12.8 12.8 0 0 1 0 25.6Zm25.6-38.4a12.8 12.8 0 1 1 .01-25.6 12.8 12.8 0 0 1 0 25.6Zm25.6 38.4a12.8 12.8 0 1 1 0-25.61 12.8 12.8 0 0 1 0 25.6Zm25.6-38.4a12.8 12.8 0 1 1 0-25.6 12.8 12.8 0 0 1 0 25.6Zm25.6 38.4a12.8 12.8 0 1 1 .01-25.6 12.8 12.8 0 0 1-.01 25.6Zm25.6-38.4a12.8 12.8 0 1 1 0-25.6 12.8 12.8 0 0 1 0 25.6Zm25.6 38.4a12.8 12.8 0 1 1 .01-25.61 12.8 12.8 0 0 1 0 25.6Zm0 0"/>',
};
const severity = {
  major: {
    name: 'major',
    class: 'l1',
  },
  minor: {
    name: 'minor',
    class: 'l2',
  },
  scheduled: {
    name: 'scheduled',
    class: 'l3',
  },
  none: {
    name: 'no impact',
    class: 'l4',
  },
}
const dispatch = createEventDispatcher();
const service = value; // for clarity
let outages = [];

function openOutage(title, id) {
  dispatch('openitem', {
    type: 'smartyellow/webserviceoutages',
    title: title,
    icon: icons.server,
    closeable: true,
    isNew: false,
    data: { id: id },
  });
}

onMount(async () => {
  outages = (await api.get('/status/outages')).filter(o => o.services?.includes(service));
});

</script>

{#if specs.label}
  <span class="label" class:alignright={specs.labelPosition === 'right'}>
    {translate(specs.label, language)}
  </span>
{/if}

<div class="table-container">
  <table class="table">
    <thead>
      <tr>
        <th>{translate('id', language)}</th>
        <th>{translate('name', language)}</th>
        <th>{translate('severity', language)}</th>
        <th class="center"></th>
      </tr>
    </thead>

    <tbody>
      {#each outages as outage}
        {@const name = outage.name[language] || outage.name.en}
        <tr>
          <td>{outage.id}</td>
          <td>{name}</td>
          <td>
            {#if severity[outage.severity]}
              <span class="state {severity[outage.severity]?.class}">
                {severity[outage.severity]?.name}
              </span>
            {:else}
              <span class="state l0">
                {translate('unclassified', language)}
              </span>
            {/if}
          </td>
          <td class="center">
            <button class="small" on:click={() => openOutage(name, outage.id)}>
              {translate('open', language)}
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .table-container {
    overflow: auto;
  }
  .table {
    table-layout: fixed;
    min-width: 100%;
    border-spacing: 0;
    border-top: 1px solid #ccc;
  }
  th {
    padding: 3px 6px;
    border: 1px solid #ccc;
    border-width: 0 1px 1px 0;
    background: #eee;
    font-weight: normal;
    user-select: none;
    box-sizing: border-box;
    text-align: left;
  }
  th:first-child,
  td:first-child {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 3;
    border-left: 1px solid #ccc;
  }
  td {
    position: relative;
    border: 1px solid #ccc;
    border-width: 0 1px 1px 0;
    padding: 3px 6px;
    background: #fff;
    text-align: left;
  }
  tr > td:first-child {
    border-left-width: 1px;
  }

  span.state.l0 {
    background-color: #808080;
    color: rgba(255, 255, 255, 0.9);
  }

  button.small {
    padding: 3px 10px;
    min-width: 20px;
    margin: 2px;
  }

  .center {
    text-align: center;
  }
</style>
