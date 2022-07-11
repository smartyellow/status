'use strict';

const { fork } = require('child_process');
const { processOutage } = require('./lib/processoutage');
const buildDashboard = require('./dashboard/build');
const createDashboardSocket = require('./dashboard/socket');
const { minifyHtml } = require('core/strings');
const { readFile } = require('fs/promises');

const guiCluster = 'web service status';
const icons = {
  server: '<path d="M0 308.58v150.83a57.73 57.73 0 0 0 10.69 33.38H757.3a57.62 57.62 0 0 0 10.7-33.37V308.58a57.73 57.73 0 0 0-10.69-33.38H10.7A57.76 57.76 0 0 0 0 308.58Zm665.6 81.82a12.8 12.8 0 1 1-.01 25.6 12.8 12.8 0 0 1 .01-25.6ZM640 352a12.8 12.8 0 1 1 0 25.61 12.8 12.8 0 0 1 0-25.61Zm-25.6 38.4a12.8 12.8 0 1 1-.01 25.6 12.8 12.8 0 0 1 0-25.6ZM588.8 352a12.8 12.8 0 1 1 0 25.61 12.8 12.8 0 0 1 0-25.61Zm-25.6 38.4a12.8 12.8 0 1 1 0 25.6 12.8 12.8 0 0 1 0-25.6ZM537.6 352a12.8 12.8 0 1 1-.01 25.6 12.8 12.8 0 0 1 .01-25.6ZM512 390.4a12.8 12.8 0 1 1 0 25.6 12.8 12.8 0 0 1 0-25.6ZM486.4 352a12.8 12.8 0 1 1-.01 25.61 12.8 12.8 0 0 1 0-25.61Zm-25.6 38.4a12.8 12.8 0 1 1 0 25.6 12.8 12.8 0 0 1 0-25.6ZM435.2 352a12.8 12.8 0 1 1 0 25.61 12.8 12.8 0 0 1 0-25.61Zm-300.8-25.6A57.67 57.67 0 0 1 192 384a57.67 57.67 0 0 1-57.6 57.6A57.67 57.67 0 0 1 76.8 384a57.67 57.67 0 0 1 57.6-57.6Zm622.91-76.8A57.76 57.76 0 0 0 768 216.22V65.38A59.05 59.05 0 0 0 709.02 6.4H58.98A59.05 59.05 0 0 0 0 65.38V216.2a57.73 57.73 0 0 0 10.69 33.39H757.3Zm-91.7-102.4a12.8 12.8 0 1 1-.02 25.6 12.8 12.8 0 0 1 .01-25.6ZM640 108.8a12.8 12.8 0 1 1 0 25.61 12.8 12.8 0 0 1 0-25.6Zm-25.6 38.4a12.8 12.8 0 1 1-.01 25.6 12.8 12.8 0 0 1 0-25.6Zm-25.6-38.4a12.8 12.8 0 1 1 0 25.61 12.8 12.8 0 0 1 0-25.6Zm-25.6 38.4a12.8 12.8 0 1 1 0 25.6 12.8 12.8 0 0 1 0-25.6Zm-25.6-38.4a12.8 12.8 0 1 1-.01 25.6 12.8 12.8 0 0 1 .01-25.6ZM512 147.2a12.8 12.8 0 1 1 0 25.6 12.8 12.8 0 0 1 0-25.6Zm-25.6-38.4a12.8 12.8 0 1 1-.01 25.61 12.8 12.8 0 0 1 0-25.6Zm-25.6 38.4a12.8 12.8 0 1 1 0 25.6 12.8 12.8 0 0 1 0-25.6Zm-25.6-38.4a12.8 12.8 0 1 1 0 25.61 12.8 12.8 0 0 1 0-25.6ZM134.4 83.2a57.67 57.67 0 0 1 57.6 57.6 57.67 57.67 0 0 1-57.6 57.6 57.67 57.67 0 0 1-57.6-57.6 57.67 57.67 0 0 1 57.6-57.6ZM10.69 518.4A57.76 57.76 0 0 0 0 551.78v150.83c0 32.53 26.46 59 58.98 59H709a59.05 59.05 0 0 0 58.99-59V551.79a57.73 57.73 0 0 0-10.69-33.38Zm123.7 166.4a57.67 57.67 0 0 1-57.59-57.6 57.67 57.67 0 0 1 57.6-57.6 57.67 57.67 0 0 1 57.6 57.6 57.67 57.67 0 0 1-57.6 57.6Zm300.8-64a12.8 12.8 0 1 1 .02-25.6 12.8 12.8 0 0 1-.01 25.6Zm25.61 38.4a12.8 12.8 0 1 1 0-25.61 12.8 12.8 0 0 1 0 25.6Zm25.6-38.4a12.8 12.8 0 1 1 .01-25.6 12.8 12.8 0 0 1-.01 25.6Zm25.6 38.4a12.8 12.8 0 1 1 0-25.61 12.8 12.8 0 0 1 0 25.6Zm25.6-38.4a12.8 12.8 0 1 1 .01-25.6 12.8 12.8 0 0 1 0 25.6Zm25.6 38.4a12.8 12.8 0 1 1 0-25.61 12.8 12.8 0 0 1 0 25.6Zm25.6-38.4a12.8 12.8 0 1 1 0-25.6 12.8 12.8 0 0 1 0 25.6Zm25.6 38.4a12.8 12.8 0 1 1 .01-25.6 12.8 12.8 0 0 1-.01 25.6Zm25.6-38.4a12.8 12.8 0 1 1 0-25.6 12.8 12.8 0 0 1 0 25.6Zm25.6 38.4a12.8 12.8 0 1 1 .01-25.61 12.8 12.8 0 0 1 0 25.6Zm0 0"/>',
  outage: '<path d="M601.6 435.2c-91.75 0-166.4 74.65-166.4 166.4S509.85 768 601.6 768 768 693.35 768 601.6s-74.65-166.4-166.4-166.4Zm0 307.2c-77.63 0-140.8-63.17-140.8-140.8 0-77.63 63.17-140.8 140.8-140.8 77.63 0 140.8 63.17 140.8 140.8 0 77.63-63.17 140.8-140.8 140.8Zm0 0"/><path d="M664.96 538.25c-5-5-13.1-5-18.1 0L601.6 583.5l-45.26-45.25a12.79 12.79 0 1 0-18.1 18.1l45.26 45.25-45.26 45.25a12.79 12.79 0 0 0 9.05 21.85 12.8 12.8 0 0 0 9.05-3.75l45.26-45.25 45.26 45.25a12.77 12.77 0 0 0 18.1 0c5-5 5-13.1 0-18.1L619.7 601.6l45.26-45.25c5-5 5-13.1 0-18.1ZM709.02 0H58.98A59.05 59.05 0 0 0 0 58.98V209.8a57.76 57.76 0 0 0 10.69 33.4H757.3a57.68 57.68 0 0 0 10.7-33.38V58.98A59.05 59.05 0 0 0 709.02 0ZM134.4 192a57.67 57.67 0 0 1-57.6-57.6 57.67 57.67 0 0 1 57.6-57.6 57.67 57.67 0 0 1 57.6 57.6 57.67 57.67 0 0 1-57.6 57.6Zm300.8-64a12.8 12.8 0 1 1 0-25.61 12.8 12.8 0 0 1 0 25.61Zm25.6 38.4a12.8 12.8 0 1 1 0-25.61 12.8 12.8 0 0 1 0 25.6Zm25.6-38.4a12.8 12.8 0 1 1 .01-25.6 12.8 12.8 0 0 1-.01 25.6Zm25.6 38.4a12.8 12.8 0 1 1 0-25.61 12.8 12.8 0 0 1 0 25.6Zm25.6-38.4a12.8 12.8 0 1 1 .01-25.61 12.8 12.8 0 0 1 0 25.61Zm25.6 38.4a12.8 12.8 0 1 1 0-25.61 12.8 12.8 0 0 1 0 25.6Zm25.6-38.4a12.8 12.8 0 1 1 0-25.61 12.8 12.8 0 0 1 0 25.61Zm25.6 38.4a12.8 12.8 0 1 1 .01-25.6 12.8 12.8 0 0 1-.01 25.6ZM640 128a12.8 12.8 0 1 1 0-25.61 12.8 12.8 0 0 1 0 25.61Zm25.6 38.4a12.8 12.8 0 1 1 0-25.61 12.8 12.8 0 0 1 0 25.6ZM396.8 601.6c0-32.15 7.65-62.5 20.93-89.6H10.69A57.76 57.76 0 0 0 0 545.38V696.2c0 32.54 26.46 59 58.98 59h407.6c-42.67-37.57-69.78-92.41-69.78-153.6Zm-262.4 76.8a57.67 57.67 0 0 1-57.6-57.6 57.67 57.67 0 0 1 57.6-57.6 57.67 57.67 0 0 1 57.6 57.6 57.67 57.67 0 0 1-57.6 57.6ZM10.69 268.8A57.75 57.75 0 0 0 0 302.18V453a57.75 57.75 0 0 0 10.69 33.4h421.7c36.92-54.04 98.98-89.6 169.2-89.6 65.57 0 123.9 31.1 161.4 79.2a56.8 56.8 0 0 0 5-22.98V302.18a57.73 57.73 0 0 0-10.69-33.38Zm123.7 166.4a57.67 57.67 0 0 1-57.59-57.6 57.67 57.67 0 0 1 57.6-57.6 57.67 57.67 0 0 1 57.6 57.6 57.67 57.67 0 0 1-57.6 57.6Zm300.8-64a12.8 12.8 0 1 1 .02-25.61 12.8 12.8 0 0 1-.01 25.6Zm51.2 0a12.8 12.8 0 1 1 .02-25.6 12.8 12.8 0 0 1-.01 25.6Zm51.21 0a12.8 12.8 0 1 1 .01-25.61 12.8 12.8 0 0 1 0 25.6Zm51.2 0a12.8 12.8 0 1 1 0-25.61 12.8 12.8 0 0 1 0 25.6Zm51.2 0a12.8 12.8 0 1 1 0-25.61 12.8 12.8 0 0 1 0 25.6Zm0 0"/>',
  checks: '<path d="M601.6 435.2c-48.18 0-93.66 20.24-124.8 55.53a12.82 12.82 0 0 0 19.2 16.94c26.28-29.78 64.78-46.87 105.6-46.87 77.63 0 140.8 63.17 140.8 140.8 0 77.63-63.17 140.8-140.8 140.8-63.9 0-120.4-43.1-137.49-102.4h60.7v-25.6H422.4v102.4H448v-46.9c26.79 58 86.8 98.1 153.6 98.1 91.75 0 166.4-74.65 166.4-166.4s-74.65-166.4-166.4-166.4Zm0 0"/><path d="M10.69 268.8A57.75 57.75 0 0 0 0 302.18V453a57.75 57.75 0 0 0 10.69 33.4h406.64C455.85 425.02 523.94 384 601.6 384c66.38 0 125.83 29.96 165.76 76.96.37-2.6.64-5.24.64-7.96V302.18a57.73 57.73 0 0 0-10.69-33.38Zm123.7 166.4a57.67 57.67 0 0 1-57.59-57.6 57.67 57.67 0 0 1 57.6-57.6 57.67 57.67 0 0 1 57.6 57.6 57.67 57.67 0 0 1-57.6 57.6Zm300.8-64a12.8 12.8 0 1 1 .02-25.61 12.8 12.8 0 0 1-.01 25.6Zm51.2 0a12.8 12.8 0 1 1 .02-25.6 12.8 12.8 0 0 1-.01 25.6Zm51.21 0a12.8 12.8 0 1 1 .01-25.61 12.8 12.8 0 0 1 0 25.6Zm51.2 0a12.8 12.8 0 1 1 0-25.61 12.8 12.8 0 0 1 0 25.6Zm51.2 0a12.8 12.8 0 1 1 0-25.61 12.8 12.8 0 0 1 0 25.6ZM709.02 0H58.98A59.05 59.05 0 0 0 0 58.98V209.8a57.76 57.76 0 0 0 10.69 33.4H757.3a57.68 57.68 0 0 0 10.7-33.38V58.98A59.05 59.05 0 0 0 709.02 0ZM134.4 192a57.67 57.67 0 0 1-57.6-57.6 57.67 57.67 0 0 1 57.6-57.6 57.67 57.67 0 0 1 57.6 57.6 57.67 57.67 0 0 1-57.6 57.6Zm300.8-64a12.8 12.8 0 1 1 0-25.61 12.8 12.8 0 0 1 0 25.61Zm25.6 38.4a12.8 12.8 0 1 1 0-25.61 12.8 12.8 0 0 1 0 25.6Zm25.6-38.4a12.8 12.8 0 1 1 .01-25.6 12.8 12.8 0 0 1-.01 25.6Zm25.6 38.4a12.8 12.8 0 1 1 0-25.61 12.8 12.8 0 0 1 0 25.6Zm25.6-38.4a12.8 12.8 0 1 1 .01-25.61 12.8 12.8 0 0 1 0 25.61Zm25.6 38.4a12.8 12.8 0 1 1 0-25.61 12.8 12.8 0 0 1 0 25.6Zm25.6-38.4a12.8 12.8 0 1 1 0-25.61 12.8 12.8 0 0 1 0 25.61Zm25.6 38.4a12.8 12.8 0 1 1 .01-25.6 12.8 12.8 0 0 1-.01 25.6ZM640 128a12.8 12.8 0 1 1 0-25.61 12.8 12.8 0 0 1 0 25.61Zm25.6 38.4a12.8 12.8 0 1 1 0-25.61 12.8 12.8 0 0 1 0 25.6ZM403.53 512H10.7A57.76 57.76 0 0 0 0 545.38V696.2c0 32.54 26.46 59 58.98 59h388.64C408.33 715.8 384 661.5 384 601.6c0-31.96 7.1-62.23 19.53-89.6ZM134.4 678.4a57.67 57.67 0 0 1-57.6-57.6 57.67 57.67 0 0 1 57.6-57.6 57.67 57.67 0 0 1 57.6 57.6 57.67 57.67 0 0 1-57.6 57.6Zm0 0"/>',
};

let renderedDashboard = null;

module.exports = {

  // Friendly name
  name: 'Status',

  // Brief description of this plugin
  purpose: 'Keep track of the status of your web services automatically and get notified when a service is down.',

  // Version of this plugin
  version: '1.0.0',

  // Name of the plugin author
  author: 'Romein van Buren',

  // Name of vendor of this plugin
  vendor: 'Smart Yellow',

  // Array of plugins this plugin depends on
  requires: [ 'webdesq/storage' ],

  // Features this plugin offers
  features: {
    seeServices: {
      description: 'See all web services',
    },
    createServices: {
      description: 'Create new web services',
      requires: [ 'seeServices' ],
    },
    editServices: {
      description: 'Edit web services',
      requires: [ 'seeServices' ],
    },
    deleteServices: {
      description: 'Delete web services',
      requires: [ 'editServices' ],
    },

    seeOutages: {
      description: 'See all outages',
      requires: [ 'seeServices' ],
    },
    createOutages: {
      description: 'Create new outages',
      requires: [ 'seeServices', 'seeOutages' ],
    },
    editOutages: {
      description: 'Edit outages',
      requires: [ 'seeServices', 'seeOutages' ],
    },
    deleteOutages: {
      description: 'Delete outages',
      requires: [ 'seeServices', 'editOutages' ],
    },

    seeMonitor: {
      description: 'See the monitor',
    },
  },

  icon: icons.server,

  entities: {
    webservice: 'webservice.js',
    webserviceoutage: 'webserviceoutage.js',
    webserviceheartbeat: 'webserviceheartbeat.js',
  },

  settings: {
    clusters: {
      type: 'keys',
      label: 'clusters',
      description: 'Clusters can be used to catogorise web services into groups.',
      default: {},
    },
    serviceTags: {
      type: 'keys',
      label: 'service tags',
      description: 'Tags that can be assigned to web services to categorise them.',
      default: {},
    },
    outageTags: {
      type: 'keys',
      label: 'outage tags',
      description: 'Tags that can be assigned to outage messages to categorise them.',
      default: {},
    },
    emailSender: {
      type: 'string',
      label: 'notification sender',
      description: 'Sender of notifications about service statuses. Format: Name <email@example.com>',
      default: '',
    },
    emailRecipient: {
      type: 'array',
      label: 'notification recipients',
      description: 'Recipients of notifications about service statuses. Format: Name <email@example.com>',
      default: [],
    },
    draftOutageEntries: {
      type: 'boolean',
      label: 'draft outage entries',
      description: 'Automatically draft an outage entry when a service is down?',
      default: true,
    },
  },

  gui: {
    components: [
      'formautotestfield.svelte',
      'formoutagetablefield.svelte',
    ],

    modules: () => [
      { path: 'webservices.svelte',
        requires: [ 'seeServices', 'editServices' ],
        menu: {
          cluster: guiCluster,
          icon: icons.server,
          title: 'web services',
        },
      },

      { path: 'webserviceoutages.svelte',
        requires: [ 'seeServices', 'editServices' ],
        menu: {
          cluster: guiCluster,
          icon: icons.outage,
          title: 'outages',
        },
      },

      { path: 'webservicemonitor.svelte',
        requires: [ 'seeMonitor' ],
        menu: {
          cluster: guiCluster,
          icon: icons.checks,
          title: 'monitor',
        },
      },
    ],

    widgets: () => [
      { path: 'webservicestatus.svelte',
        title: 'Web service status',
        purpose: 'Monitor web service status',
        defaults: {
          title: 'Web service status',
        },
      },
    ],
  },

  jobs: ({ server, settings }) => [
    { id: 'autotest',
      purpose: 'Check whether services are up and send a notification if not.',
      mandatory: false,
      runAtBoot: true,
      active: true,
      interval: 60 * 1000,
      action: async () => {
        const services = await server
          .storage
          .store('smartyellow/webservice')
          .find({ autotestEnabled: true })
          .toArray();

        if (!services.length) {
          return;
        }

        const runtime = fork(__dirname + '/lib/runtime.js');
        runtime.send({ command: 'testAll', services });

        runtime.on('message', message => {
          if (message.error) {
            server.error(message.error);
          }
          else if (message.outage) {
            processOutage({ outage: message.outage, server, settings });
          }
        });
      },
    },
  ],

  hooks: ({ server, settings }) => [
    { id: 'startDashboardSocket',
      event: 'boot',
      order: 100,
      purpose: 'Start the websocket for the dashboard after boot',
      handler: () => createDashboardSocket(server),
    },

    { id: 'autotestOnSave',
      order: 500,
      event: 'saveEntity',
      entity: [ 'smartyellow/webservice' ],
      purpose: 'Check whether services are up and send a notification if not.',
      handler: ({ item }) => {
        const runtime = fork(__dirname + '/lib/runtime.js');
        runtime.send({ command: 'testOne', service: item });
        runtime.on('message', message => {
          if (message.error) {
            server.error(message.error);
          }
          else if (message.outage) {
            processOutage({
              outage: {
                [item.id]: message.outage,
              },
              server,
              settings,
            });
          }
        });
      },
    },
  ],

  routes: ({ server, settings }) => [

    // Get all services
    { route: '/webservices',
      method: 'get',
      requires: 'smartyellow/status/seeServices',
      handler: async (req, res, user) => {
        const services = server.storage({ user }).store('smartyellow/webservice').find();
        const result = await (req.headers['format'] == 'object' ? services.toObject() : services.toArray());

        if (req.headers['format'] == 'object') {
          for (const service of Object.keys(result)) {
            result[service].heartbeat = await server
              .storage
              .store('smartyellow/webserviceheartbeat')
              .find({ service: service.id })
              .toArray();
          }
        }
        else {
          for (const [ i, service ] of result.entries()) {
            result[i].heartbeat = await server
              .storage
              .store('smartyellow/webserviceheartbeat')
              .find({ webservice: service.id })
              .toArray();
          }
        }

        res.json(result);
      },
    },

    // Get details for specific service
    { route: '/webservices/:id',
      method: 'get',
      requires: 'smartyellow/status/seeServices',
      handler: async (req, res, user) => {
        const doc = await server.storage({ user }).store('smartyellow/webservice').get(req.params[0]);
        const result = await server.validateEntity({
          entity: 'smartyellow/webservice',
          id: req.params[0],
          data: doc,
          validateOnly: true,
          user: user,
          isNew: false,
        });
        res.json(result);
      },
    },

    { route: '/webservices/search',
      method: 'post',
      requires: 'smartyellow/status/seeServices',
      handler: async (req, res, user) => {
        const filters = await server.getFilters({
          entity: 'smartyellow/webservice',
          user: user,
        });
        const q = server.storage({ user }).prepareQuery(filters, req.body.query, req.body.languages || false);
        const result = await server.storage({ user }).store('smartyellow/webservice').find(q).sort({ 'log.created.on': -1 }).toArray();
        res.json(result);
      },
    },

    // Get filters for services
    { route: '/webservices/filters',
      method: 'get',
      requires: 'smartyellow/status/seeServices',
      handler: async (req, res, user) => {
        res.json(await server.getFilters({
          entity: 'smartyellow/webservice',
          user: user,
        }));
      },
    },

    // Get formats for services
    { route: '/webservices/formats',
      method: 'get',
      requires: 'smartyellow/status/seeServices',
      handler: async (req, res, user) => {
        const formats = await server.getFormats({
          entity: 'smartyellow/webservice',
          user: user,
        });
        res.json(formats);
      },
    },

    // Create new service
    { route: '/webservices',
      method: 'post',
      requires: 'smartyellow/status/createServices',
      handler: async (req, res, user) => {

        // Validate the posted data
        const result = await server.validateEntity({
          entity: 'smartyellow/webservice',
          data: req.body,
          storeIfValid: true,
          validateOnly: req.headers['init'],
          form: req.headers['form'] || 'default',
          isNew: true,
          user: user,
        });

        if (!result.errors) {
          // broadcast message to all clients to notify users have been changed
          server.publish('cms', 'smartyellow/status/reload');
        }

        return res.json(result);
      },
    },

    // Update existing service
    { route: '/webservices/:id',
      method: 'put',
      requires: 'smartyellow/status/editServices',
      handler: async (req, res, user) => {

        // Validate the posted data
        const result = await server.validateEntity({
          entity: 'smartyellow/webservice',
          id: req.params[0],
          data: req.body,
          storeIfValid: true,
          validateOnly: req.headers['init'],
          form: req.headers['form'] || 'default',
          isNew: false,
          user: user,
        });

        if (!result.errors) {
          // broadcast message to all clients to notify users have been changed
          server.publish('cms', 'smartyellow/status/reload');
        }

        return res.json(result);
      },
    },

    // Delete specific service
    { route: '/webservices/:id',
      method: 'delete',
      requires: 'smartyellow/status/deleteServices',
      handler: async (req, res, user) => {
        const result = await server.storage({ user }).store('smartyellow/webservice').delete({ id: req.params[0] });

        if (!result.errors) {
          // broadcast message to all clients to notify users have been changed
          server.publish('cms', 'smartyellow/status/reload');
        }

        res.json(result);
      },
    },

    // Get all outages
    { route: '/outages',
      method: 'get',
      requires: 'smartyellow/status/seeOutages',
      handler: async (req, res, user) => {
        const outages = server.storage({ user }).store('smartyellow/webserviceoutage').find();
        const result = await (req.headers['format'] == 'object' ? outages.toObject() : outages.toArray());
        res.json(result);
      },
    },

    // Get details for specific outage
    { route: '/outages/:id',
      method: 'get',
      requires: 'smartyellow/status/seeOutages',
      handler: async (req, res, user) => {
        const doc = await server.storage({ user }).store('smartyellow/webserviceoutage').get(req.params[0]);
        const result = await server.validateEntity({
          entity: 'smartyellow/webserviceoutage',
          id: req.params[0],
          data: doc,
          validateOnly: true,
          user: user,
          isNew: false,
        });
        res.json(result);
      },
    },

    { route: '/outages/search',
      method: 'post',
      requires: 'smartyellow/status/seeOutages',
      handler: async (req, res, user) => {
        const filters = await server.getFilters({
          entity: 'smartyellow/webserviceoutage',
          user: user,
        });
        const q = server.storage({ user }).prepareQuery(filters, req.body.query, req.body.languages || false);
        const result = await server.storage({ user }).store('smartyellow/webserviceoutage').find(q).sort({ 'log.created.on': -1 }).toArray();
        res.json(result);
      },
    },

    // Get filters for outages
    { route: '/outages/filters',
      method: 'get',
      requires: 'smartyellow/status/seeOutages',
      handler: async (req, res, user) => {
        res.json(await server.getFilters({
          entity: 'smartyellow/webserviceoutage',
          user: user,
        }));
      },
    },

    // Get formats for outages
    { route: '/outages/formats',
      method: 'get',
      requires: 'smartyellow/status/seeOutages',
      handler: async (req, res, user) => {
        const formats = await server.getFormats({
          entity: 'smartyellow/webserviceoutage',
          user: user,
        });
        res.json(formats);
      },
    },

    // Create new service
    { route: '/outages',
      method: 'post',
      requires: 'smartyellow/status/createOutages',
      handler: async (req, res, user) => {

        // Validate the posted data
        const result = await server.validateEntity({
          entity: 'smartyellow/webserviceoutage',
          data: req.body,
          storeIfValid: true,
          validateOnly: req.headers['init'],
          form: req.headers['form'] || 'default',
          isNew: true,
          user: user,
        });

        if (!result.errors) {
          // broadcast message to all clients to notify users have been changed
          server.publish('cms', 'smartyellow/status/reload');
        }

        return res.json(result);
      },
    },

    // Update existing service
    { route: '/outages/:id',
      method: 'put',
      requires: 'smartyellow/status/editOutages',
      handler: async (req, res, user) => {

        // Validate the posted data
        const result = await server.validateEntity({
          entity: 'smartyellow/webserviceoutage',
          id: req.params[0],
          data: req.body,
          storeIfValid: true,
          validateOnly: req.headers['init'],
          form: req.headers['form'] || 'default',
          isNew: false,
          user: user,
        });

        if (!result.errors) {
          // broadcast message to all clients to notify users have been changed
          server.publish('cms', 'smartyellow/status/reload');
        }

        return res.json(result);
      },
    },

    // Delete specific service
    { route: '/outages/:id',
      method: 'delete',
      requires: 'smartyellow/status/deleteOutages',
      handler: async (req, res, user) => {
        const result = await server.storage({ user }).store('smartyellow/webserviceoutage').delete({ id: req.params[0] });

        if (!result.errors) {
          // broadcast message to all clients to notify users have been changed
          server.publish('cms', 'smartyellow/status/reload');
        }

        res.json(result);
      },
    },

    { route: '/statusdashboard',
      method: 'get',
      handler: async (req, res) => {
        try {
          if (!renderedDashboard) {
            renderedDashboard = await buildDashboard({ server, settings });
            renderedDashboard.globalCss = await readFile(
              __dirname + '/gui/dashboard/app.css'
            );
          }
          const dashboardHtml = minifyHtml(`
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Web service status dashboard</title>
                <style>${renderedDashboard.globalCss || ''}</style>
                <style>${renderedDashboard.css || ''}</style>
              </head>
              <body>
                <script>
                  ${renderedDashboard.code || ''}
                  //# sourceMappingURL=${renderedDashboard.map || ''}
                </script>
              </body>
            </html>
          `);
          res.send(dashboardHtml);
        }
        catch (error) {
          server.error('could not compile web service status dashboard', error);
        }
      },
    },

  ],

};
