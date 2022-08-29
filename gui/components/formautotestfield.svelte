<script>

import { createEventDispatcher } from 'svelte';
import Toggle from 'components/webdesq/toggle.svelte';
import { operatorNames } from '../../lib/operators';
import { realValueNames } from '../../lib/realvalues';
import { fade } from 'svelte/transition';

export let value = [];
export let specs = {};
export let readonly = true;
export let language = 'en';
export let translate = s => s;
export let error = false;

const dispatch = createEventDispatcher();
const defaultEndpoint = {
  uri: '',
  headers: [],
  requirements: [
    { type: 'httpstatus',
      truth: 'true',
      operator: 'equal',
      string: '200',
    },
  ],
};
const defaultReq = {
  type: 'httpstatus',
  truth: 'true',
  operator: 'equal',
  string: '',
};
const defaultHeader = {
  name: '',
  value: '',
};

const changeValue = e => dispatch('changeValue', value) && e.target.focus();
const appendEndpoint = () => value = [ ...value, defaultEndpoint ];

function removeEndpoint(i) {
  value.splice(i, 1);
  value = value;
}

</script>

{#if specs.label}
  <span class="label" class:alignright={specs.labelPosition === 'right'}>
    {translate(specs.label, language)}
  </span>
{/if}

{#each value as endpoint, iEndpoint (endpoint)}
  <div class="endpoint">
    <div>
      <label for="uri-{iEndpoint}">
        {translate('Endpoint URI', language)}
      </label>
      <div class="flex">
        <input
          id="uri-{iEndpoint}"
          type="text"
          placeholder="https://"
          disabled={readonly}
          bind:value={endpoint.uri}
          on:focus
          on:blur={changeValue}
        />
        <button on:click={() => removeEndpoint(iEndpoint)}>
          &times;
        </button>
      </div>
    </div>

    {#if endpoint.headers?.length > 0}
      <strong>{translate('Headers', language)}</strong>
      <table>
        <thead>
          <tr>
            <th>{translate('Header name', language)}</th>
            <th>{translate('Value', language)}</th>
          </tr>
        </thead>

        <tbody>
          {#each endpoint.headers as header, iHeader (header)}
            <tr>
              <td>
                <input
                  type="text"
                  placeholder={translate('name...', language)}
                  disabled={readonly}
                  bind:value={header.name}
                  on:focus
                  on:blur={changeValue}
                />
              </td>

              <td>
                <div class="flex">
                  <input
                    type="text"
                    placeholder={translate('value...', language)}
                    disabled={readonly}
                    bind:value={header.value}
                    on:focus
                    on:blur={changeValue}
                  />
                  <button on:click={() => {
                    endpoint.headers.splice(iHeader, 1);
                    // eslint-disable-next-line no-self-assign
                    endpoint = endpoint;
                  }}>
                    &times;
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}

    <div>
      <button on:click={() => endpoint.headers = [ ...endpoint.headers, defaultHeader ]}>
        {translate('add request header', language)}
      </button>
    </div>

    {#if endpoint.requirements?.length > 0}
      <strong>{translate('Requirements', language)}</strong>
      <table>
        <thead>
          <tr>
            <th>{translate('Real value', language)}</th>
            <th class="center">{translate('Truth', language)}</th>
            <th>{translate('Operator', language)}</th>
            <th>{translate('Value', language)}</th>
          </tr>
        </thead>

        <tbody>
          {#each endpoint.requirements as req, iReq (req)}
            <tr>
              <td>
                <select
                  bind:value={req.type}
                  disabled={readonly}
                  on:focus
                  on:change={changeValue}
                >
                  {#each Object.keys(realValueNames) as valName}
                    <option value={valName}>{realValueNames[valName]}</option>
                  {/each}
                </select>
              </td>

              <td class="center">
                <Toggle
                  inline
                  labels={{
                    on: translate('is', language),
                    off: translate('isn\'t', language),
                  }}
                  bind:value={req.truth}
                  on:change={changeValue}
                  {readonly}
                  {language}
                  {translate}
                />
              </td>

              <td>
                <select
                  bind:value={req.operator}
                  disabled={readonly}
                  on:focus
                  on:change={changeValue}
                >
                  {#each Object.keys(operatorNames) as opName}
                    <option value={opName}>{operatorNames[opName]}</option>
                  {/each}
                </select>
              </td>

              <td>
                <div class="flex">
                  <input
                    type="text"
                    placeholder={translate('value...', language)}
                    disabled={readonly}
                    bind:value={req.string}
                    on:focus
                    on:blur={changeValue}
                  />
                  <button on:click={() => {
                    endpoint.requirements.splice(iReq, 1);
                    // eslint-disable-next-line no-self-assign
                    endpoint = endpoint;
                  }}>
                    &times;
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}

    <div>
      <button on:click={() => endpoint.requirements = [ ...endpoint.requirements, defaultReq ]}>
        {translate('add requirement', language)}
      </button>
    </div>
  </div>
{/each}

<div>
  <button on:click={appendEndpoint}>
    {translate('add endpoint', language)}
  </button>
</div>

{#if error}
  <span transition:fade class="error">{error}</span>
{/if}

<style>
  div:not(:last-child) {
    margin-bottom: 10px;
  }
  label, strong {
    font-weight: 700;
    line-height: 1em;
    margin-bottom: .7em;
    display: block;
  }
  label:not(:first-child), strong:not(:first-child) {
    margin-top: 1em;
    padding-top: 1em;
    border-top: 1px solid rgba(0, 0, 0, .2);
  }
  input, select {
    padding: 0.4em;
  }
  .endpoint {
    border: 1px solid rgba(226, 226, 226, .76);
    background-color: rgba(70, 90, 131, .07);
    border-radius: 3px;
    padding: .5rem;
  }
  table {
    margin-left: -2px;
    width: calc(100% + 2px);
  }
  thead tr th {
    text-align: left;
    font-weight: 400;
    font-style: italic;
  }
  .flex {
    display: flex;
    gap: 3px;
  }
  .flex input {
    flex: 1 0;
  }
  .flex button {
    min-width: 35px;
    flex: 0 1;
  }
  .center {
    text-align: center;
  }
</style>
