<script>

import { createEventDispatcher, onMount } from 'svelte';
import { translate, api } from 'helpers/webdesq/stores.js';

import PanelManager from 'components/webdesq/panelmanager.svelte';
import Panel from 'components/webdesq/panel.svelte';

export let language = 'en';

const icons = {
  wrench: '<path d="M175 631c0-15-13-28-29-28s-29 13-29 28 13 27 29 27 29-12 29-27zm294-180L158 743a61 61 0 0 1-41 16c-16 0-31-6-42-16l-48-46a52 52 0 0 1 0-78l310-292c24 57 72 102 132 124zm289-187c0 15-6 32-11 46a206 206 0 0 1-192 129c-113 0-205-86-205-192S442 55 555 55c33 0 76 9 104 27 5 3 7 7 7 12s-3 9-7 12l-134 72v96l88 46c15-8 121-71 130-71s15 7 15 15zm0 0"/>',
  server: '<path d="M0 308.58v150.83a57.73 57.73 0 0 0 10.69 33.38H757.3a57.62 57.62 0 0 0 10.7-33.37V308.58a57.73 57.73 0 0 0-10.69-33.38H10.7A57.76 57.76 0 0 0 0 308.58Zm665.6 81.82a12.8 12.8 0 1 1-.01 25.6 12.8 12.8 0 0 1 .01-25.6ZM640 352a12.8 12.8 0 1 1 0 25.61 12.8 12.8 0 0 1 0-25.61Zm-25.6 38.4a12.8 12.8 0 1 1-.01 25.6 12.8 12.8 0 0 1 0-25.6ZM588.8 352a12.8 12.8 0 1 1 0 25.61 12.8 12.8 0 0 1 0-25.61Zm-25.6 38.4a12.8 12.8 0 1 1 0 25.6 12.8 12.8 0 0 1 0-25.6ZM537.6 352a12.8 12.8 0 1 1-.01 25.6 12.8 12.8 0 0 1 .01-25.6ZM512 390.4a12.8 12.8 0 1 1 0 25.6 12.8 12.8 0 0 1 0-25.6ZM486.4 352a12.8 12.8 0 1 1-.01 25.61 12.8 12.8 0 0 1 0-25.61Zm-25.6 38.4a12.8 12.8 0 1 1 0 25.6 12.8 12.8 0 0 1 0-25.6ZM435.2 352a12.8 12.8 0 1 1 0 25.61 12.8 12.8 0 0 1 0-25.61Zm-300.8-25.6A57.67 57.67 0 0 1 192 384a57.67 57.67 0 0 1-57.6 57.6A57.67 57.67 0 0 1 76.8 384a57.67 57.67 0 0 1 57.6-57.6Zm622.91-76.8A57.76 57.76 0 0 0 768 216.22V65.38A59.05 59.05 0 0 0 709.02 6.4H58.98A59.05 59.05 0 0 0 0 65.38V216.2a57.73 57.73 0 0 0 10.69 33.39H757.3Zm-91.7-102.4a12.8 12.8 0 1 1-.02 25.6 12.8 12.8 0 0 1 .01-25.6ZM640 108.8a12.8 12.8 0 1 1 0 25.61 12.8 12.8 0 0 1 0-25.6Zm-25.6 38.4a12.8 12.8 0 1 1-.01 25.6 12.8 12.8 0 0 1 0-25.6Zm-25.6-38.4a12.8 12.8 0 1 1 0 25.61 12.8 12.8 0 0 1 0-25.6Zm-25.6 38.4a12.8 12.8 0 1 1 0 25.6 12.8 12.8 0 0 1 0-25.6Zm-25.6-38.4a12.8 12.8 0 1 1-.01 25.6 12.8 12.8 0 0 1 .01-25.6ZM512 147.2a12.8 12.8 0 1 1 0 25.6 12.8 12.8 0 0 1 0-25.6Zm-25.6-38.4a12.8 12.8 0 1 1-.01 25.61 12.8 12.8 0 0 1 0-25.6Zm-25.6 38.4a12.8 12.8 0 1 1 0 25.6 12.8 12.8 0 0 1 0-25.6Zm-25.6-38.4a12.8 12.8 0 1 1 0 25.61 12.8 12.8 0 0 1 0-25.6ZM134.4 83.2a57.67 57.67 0 0 1 57.6 57.6 57.67 57.67 0 0 1-57.6 57.6 57.67 57.67 0 0 1-57.6-57.6 57.67 57.67 0 0 1 57.6-57.6ZM10.69 518.4A57.76 57.76 0 0 0 0 551.78v150.83c0 32.53 26.46 59 58.98 59H709a59.05 59.05 0 0 0 58.99-59V551.79a57.73 57.73 0 0 0-10.69-33.38Zm123.7 166.4a57.67 57.67 0 0 1-57.59-57.6 57.67 57.67 0 0 1 57.6-57.6 57.67 57.67 0 0 1 57.6 57.6 57.67 57.67 0 0 1-57.6 57.6Zm300.8-64a12.8 12.8 0 1 1 .02-25.6 12.8 12.8 0 0 1-.01 25.6Zm25.61 38.4a12.8 12.8 0 1 1 0-25.61 12.8 12.8 0 0 1 0 25.6Zm25.6-38.4a12.8 12.8 0 1 1 .01-25.6 12.8 12.8 0 0 1-.01 25.6Zm25.6 38.4a12.8 12.8 0 1 1 0-25.61 12.8 12.8 0 0 1 0 25.6Zm25.6-38.4a12.8 12.8 0 1 1 .01-25.6 12.8 12.8 0 0 1 0 25.6Zm25.6 38.4a12.8 12.8 0 1 1 0-25.61 12.8 12.8 0 0 1 0 25.6Zm25.6-38.4a12.8 12.8 0 1 1 0-25.6 12.8 12.8 0 0 1 0 25.6Zm25.6 38.4a12.8 12.8 0 1 1 .01-25.6 12.8 12.8 0 0 1-.01 25.6Zm25.6-38.4a12.8 12.8 0 1 1 0-25.6 12.8 12.8 0 0 1 0 25.6Zm25.6 38.4a12.8 12.8 0 1 1 .01-25.61 12.8 12.8 0 0 1 0 25.6Zm0 0"/>',
};

const dispatch = createEventDispatcher();
let mounted = false;
let error = false;
let webservices = [];

async function refresh() {
  console.log('refresh');
  try {
    webservices = await api.get('/status/webservices');
  }
  catch (err) {
    console.error(err);
    error = true;
  }
}

function openWebService(title, id) {
  dispatch('openitem', {
    type: 'smartyellow/webservices',
    title: title,
    icon: icons.server,
    closeable: true,
    isNew: false,
    data: { id: id },
  });
}

onMount(async () => {
  await refresh();
  const interval = setInterval(async () => await refresh(), 10_000);

  mounted = true;
  return () => clearInterval(interval);
});

</script>

{#if error}
  <div class="error">
    {translate('Failed to fetch fresh data', language)}
  </div>
{/if}

{#if mounted}

  <PanelManager>
    <Panel>

      {#if webservices.length}
        <div class="servicelist">
          {#each webservices as service}
            {@const name = service.name[language] || service.name.en}
            <div class="service">
              <div class="title">{name}</div>

              <div class="date">
                {@html translate('Status last checked on: <m>', [ `<span>${new Date(service.lastChecked).toLocaleString()}</span>`, language ])}
              </div>

              <div class="tags">
                {#if service.heartbeat[service.heartbeat.length - 1]?.down == true}
                  <span class="tag red">DOWN</span>
                {:else}
                  <span class="tag green">UP</span>
                {/if}

                <span class="tag light link" on:click={() => openWebService(name, service.id)}>
                  open
                </span>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        No webservices
      {/if}

    </Panel>
  </PanelManager>

{:else}
  <h2>Loading...</h2>
{/if}

<style>
  div:not(:last-child) {
    margin-bottom: 9px;
  }

  .servicelist {
    width: 100%;
    overflow-y: scroll;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 3px;
  }
  .servicelist .service {
    background-color: #fff;
    margin-bottom: 1px;
    padding: 1em;
  }
  .servicelist .service .title {
    font-size: 1.5em;
  }

  .tag {
    background-color: #808080;
    color: #fff;
    padding: 2px 5px;
    border-radius: 5px;
    display: inline-block;
  }
  .tag.green {
    background-color: #007000;
  }
  .tag.red {
    background-color: #980000;
  }
  .tag.light {
    background-color: rgba(0, 0, 0, .1);
    color: inherit;
    cursor: pointer;
  }
  .tag.link {
    text-decoration: underline;
    transition: background-color .2s;
  }
  .tag.link.light:hover {
    background-color: rgba(0, 0, 0, .2);
  }
  .tag.link::after {
    content: '';
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z'/%3E%3Cpath fill-rule='evenodd' d='M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: contain;
    width: 1em;
    height: 1em;
    display: inline-block;
    margin-left: .3em;
  }

  .date {
    color: rgba(0, 0, 0, .5);
  }
  .date :global(span) {
    font-style: italic;
    opacity: 1.3;
    color: rgba(0, 0, 0, .8);
  }

  .error {
    padding: 10px;
    color: #fff;
  }

  @media (max-width: 500px) {
    .servicelist {
      grid-template-columns: 1fr;
    }
  }
</style>
