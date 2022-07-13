<script>

import { onMount } from 'svelte';
import { translate, api } from 'helpers/webdesq/stores.js';

export let language = 'en';
export const settings = {
  title: {
    type: 'string',
    label: translate('title', language),
  },
};

const icons = {
  warning: '<path d="M384 0C172.27 0 0 172.25 0 384s172.27 384 384 384 384-172.25 384-384S595.73 0 384 0Zm29.54 605.54a29.55 29.55 0 0 1-59.08 0V576a29.55 29.55 0 0 1 59.08 0Zm0-118.16a29.55 29.55 0 0 1-59.08 0V162.46a29.55 29.55 0 0 1 59.08 0Zm0 0"/>',
  check: '<path d="M655.65 112.36c-149.8-149.8-393.5-149.8-543.3 0-149.8 149.76-149.8 393.53 0 543.3C187.23 730.57 285.62 768 384 768c98.38 0 196.73-37.43 271.65-112.34 149.8-149.77 149.8-393.54 0-543.3Zm-56.92 166.22-224.1 224.1a31.93 31.93 0 0 1-22.65 9.39c-8.2 0-16.39-3.14-22.63-9.39L201.29 374.62a31.98 31.98 0 0 1 0-45.26 31.98 31.98 0 0 1 45.27 0l105.42 105.42 201.48-201.47a31.98 31.98 0 0 1 45.27 0 31.98 31.98 0 0 1 0 45.27Zm0 0"/>',
}
let promise;

async function refresh() {
  promise = await api.get('/status/webservices');
}

onMount(() => {
  refresh();
  const interval = setInterval(() => refresh(), 10_000);
  return () => clearInterval(interval);
});

</script>

{#await promise}
  {translate('Loading...', language)}
{:then data}
  {@const servicesDown = data?.filter(d => d.heartbeat[d.heartbeat.length - 1]?.down == true)}
  {@const servicesUp = data?.filter(d => d.heartbeat[d.heartbeat.length - 1]?.down != true)}

  {#if servicesDown?.length}
    <div class="section outage red">
      <div class="hasicon">
        <svg viewBox="0 0 768 768">{@html icons.warning}</svg>
        <div>
          <div class="title">
            {translate('there are services down', language)}
          </div>
            {#each servicesDown as service}
              <div class="service">
                {service.name[language] || service.name.en}
              </div>
            {/each}
        </div>
      </div>
    </div>
  {/if}

  {#if servicesUp?.length}
    <div class="section up" class:green={!servicesDown?.length}>
      {#if servicesDown.length}
        <div class="title">
          {translate('services up', language)}
        </div>

        {#each servicesUp as service}
          <div class="service">
            {service.name[language] || service.name.en}
          </div>
        {/each}
      {:else}
        <div class="hasicon">
          <svg viewBox="0 0 768 768">{@html icons.check}</svg>
          <div>
            <div class="title">
              {translate('all services are up', language)}
            </div>

            {#each servicesUp as service}
              <div class="service">
                {service.name[language] || service.name.en}
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
{:catch}
  <div class="error">
    {translate('Encountered an error while fetching web service data.', language)}
  </div>
{/await}

<style>
  .section {
    padding: 1em;
  }
  .section.red {
    background-color: #980000;
    color: #fff;
  }
  .section.green {
    color: #007000;
  }

  .hasicon {
    display: flex;
    gap: 2em;
    align-items: center;
  }
  .hasicon svg {
    width: 2em;
    height: 2em;
  }
  .red svg :global(*) {
    fill: #fff;
  }
  .green svg :global(*) {
    fill: #007000;
  }

  .title {
    text-transform: uppercase;
    opacity: .7;
    margin-bottom: .5em;
  }

  .section.outage .service {
    font-size: 1.5em;
  }
</style>
