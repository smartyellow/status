'use strict';

const { makeId } = require('core/makeid');
const { url } = require('core/types');

const states = {
  concept: 'concept',
  enabled: 'enabled',
  disabled: 'disabled',
};

module.exports = {
  format: 5,
  author: 'Romein van Buren',
  vendor: 'Smart Yellow',
  purpose: 'Store web services for use on a status page',
  store: 'webservices',

  forms: ({ settings }) => ({
    default: {
      pages: [
        { label: 'about',
          sections: [
            'id',
            'name',
            'state',
            'public',
            'cluster',
            'tags',
            'channels',
            'summary',
          ],
        },
        { label: 'endpoints to test',
          sections: [
            'autotestInterval',
            'testNow',
            'autotest',
          ],
        },
        { label: 'statistics',
          sections: [
            'lastChecked',
            'outageStats',
            'outageTable',
          ],
        },
      ],

      sections: {
        id: {
          label: 'id',
          fields: [
            { key: 'id',
              editor: 'string',
              validator: '',
              readonly: true,
            },
          ],
        },

        state: {
          label: 'status',
          fields: [
            { key: 'state',
              editor: 'select',
              options: states,
              translate: true,
            },
          ],
        },

        name: {
          label: 'name',
          fields: [
            { key: 'name',
              editor: 'string',
              placeholder: 'service name',
              localized: true,
            },
          ],
        },

        public: {
          label: 'publish on dashboard?',
          hint: 'If checked, this service will be shown on the status dashboard.',
          fields: [
            { key: 'public',
              editor: 'checkbox',
            },
          ],
        },

        cluster: {
          label: 'cluster',
          fields: [
            { key: 'cluster',
              editor: 'select',
              placeholder: 'select a cluster for this service...',
              visible: !!(settings.clusters && Object.keys(settings.clusters).length),
              options: settings.clusters,
            },
          ],
        },

        tags: {
          label: 'tags',
          fields: [
            { key: 'tags',
              editor: 'multiselect',
              placeholder: 'enter tags...',
              visible: !!(settings.serviceTags && Object.keys(settings.serviceTags).length),
              options: settings.serviceTags,
            },
          ],
        },

        channels: {
          label: 'channels',
          fields: [
            { key: 'channels',
              editor: 'multiselect',
              placeholder: 'enter channels...',
              visible: !!(settings.channels && Object.keys(settings.channels).length),
              options: settings.channels,
            },
          ],
        },

        summary: {
          label: 'summary',
          hint: 'A short summary of what this web service is about.',
          fields: [
            { key: 'summary',
              editor: 'text',
              localized: true,
            },
          ],
        },

        lastChecked: {
          label: 'status last checked on',
          fields: [
            { key: 'lastChecked',
              editor: 'date',
              readonly: true,
              format: 'datetime',
            },
          ],
        },

        outageStats: {
          label: 'number of outages',
          fields: [
            { key: 'outages',
              editor: 'string',
              visible: ({ newEntity }) => !newEntity,
              readonly: true,
              placeholder: 'all outages',
              default: 0,
            },

            { key: 'outagesOpen',
              editor: 'string',
              visible: ({ newEntity }) => !newEntity,
              readonly: true,
              label: 'open',
              placeholder: '0',
            },

            { key: 'outagesResolved',
              editor: 'string',
              visible: ({ newEntity }) => !newEntity,
              readonly: true,
              label: 'closed',
              placeholder: '0',
            },
          ],
        },

        outageTable: {
          label: 'outage list',
          fields: [
            { key: 'id',
              editor: 'smartyellow/outagetable',
            },
          ],
        },

        autotest: {
          label: 'endpoint requirements',
          fields: [
            { key: 'autotest',
              editor: 'smartyellow/autotest',
            },
          ],
        },

        autotestInterval: {
          label: 'test interval',
          hint: 'Interval between 2 automatic tests in minutes.',
          fields: [
            { key: 'autotestInterval',
              editor: 'number',
              label: 'minutes',
              labelPosition: 'right',
            },
          ],
        },

        testNow: {
          label: 'test now',
          fields: [
            { key: 'id',
              label: 'click to test this endpoint now',
              editor: 'button',
              method: 'post',
              url: '/status/webservices/:id/testnow',
              translate: true,
            },
          ],
        },
      },
    },
  }),

  schema: ({ settings }) => ({
    id: {
      type: 'string',
      required: ({ newEntity }) => newEntity,
      lowercase: true,
      trim: true,
      filter: {
        title: 'id',
        match: '^[a-zA-Z0-9]{6}$',
        order: 999,
      },
      default: () => makeId(6),
      validate: async ({ newValues, oldValues, newEntity, storage }) => {
        if (newEntity) {
          const r = storage ? await storage.store('smartyellow/webservice').get(newValues.id) : null;
          return (r == null ? true : 'id already exists');
        }
        else {
          // ID cannot be changed if record was already created
          return (newValues.id == oldValues.id ? true : 'id cannot be changed');
        }
      },
    },

    name: {
      type: 'stringset',
      trim: true,
      required: [ true, 'Name is missing!' ],
      default: '',
      filter: {
        title: 'title',
        match: '^[a-zA-Z0-9]*',
        localized: true,
      },
      format: {
        label: 'name',
        type: 'text',
        sortable: 'string',
        align: 'left',
        minWidth: 150,
        enabled: true,
        priority: 1,
      },
    },

    state: {
      type: 'string',
      required: true,
      default: 'concept',
      filter: {
        title: 'state',
        options: states,
      },
      format: {
        label: 'state',
        type: 'state',
        align: 'left',
        sortable: 'text',
        sorted: 'down',
        minWidth: 90,
        enabled: true,
        options: {
          concept: {
            name: 'concept',
            class: 'l2',
          },
          online: {
            name: 'online',
            class: 'l4',
          },
          offline: {
            name: 'offline',
            class: 'l1',
          },
        },
      },
    },

    tags: {
      type: 'array',
      of: 'string',
      default: [],
      filter: {
        title: 'tags',
        match: '^[a-z]',
        options: async ({ storage }) => (await storage.store('smartyellow/webservice').find({ 'log.deleted': { $exists: false } }, { keys: [ 'id', 'tags' ] }).sort({ name: 1 }).toArray())
          .reduce((acc, curr) => {
            if (curr.tags) {
              for (let i = 0; i < curr.tags.length; i++) {
                acc[curr.tags[i]] = curr.tags[i];
              }
            }
            return acc;
          }, {}),
      },
      format: {
        type: 'text',
        label: 'tags',
        sortable: 'text',
        enabled: true,
        minWidth: 100,
      },
    },

    channels: {
      type: 'array',
      of: 'string',
      default: () => {
        const keys = settings.channels ? Object.keys(settings.channels) : [];
        if (keys.length == 1) {
          return [ keys[0] ];
        }
        else {
          return [];
        }
      },
      filter: {
        title: 'channel',
        match: settings.channels && Object.keys(settings.channels).length ? '^[' + Object.keys(settings.channels).join('|') + ']' : null,
      },
      validate: async ({ newValues }) => (newValues.channels.every(key => !!settings.channels[key]) ? true : 'One or more invalid channels'),
      format: {
        label: 'channels',
        type: 'text',
        sortable: 'text',
        minWidth: 80,
        enabled: true,
      },
    },

    summary: {
      type: 'stringset',
      default: '',
    },

    autotest: {
      default: [],
      type: 'array',
      validate: ({ newValues }) => {
        if (newValues.autotest && !Array.isArray(newValues.autotest)) {
          return 'autotest must be an array';
        }
        else if (newValues.autotest) {
          for (const endpoint of newValues.autotest) {
            if (!url.test(endpoint.uri)) {
              return 'not a valid url';
            }

            if (!Array.isArray(endpoint.headers)) {
              return 'endpoint headers must be an array';
            }

            const foundHeaders = [];
            for (const header of endpoint.headers) {
              if (foundHeaders.includes(header.name)) {
                return 'found duplicate headers in endpoint ' + endpoint.uri;
              }
              else if (!header.name || !header.name.trim || !header.name.trim()) {
                return 'empty header name in endpoint ' + endpoint.uri;
              }
              else {
                foundHeaders.push(header.name);
              }
            }

            if (!Array.isArray(endpoint.requirements)) {
              return 'requirements must be an object';
            }
          }
        }

        return true;
      },
    },

    outages: {
      type: 'computed',
      default: 0,
      format: {
        label: 'outages',
        type: 'number',
        align: 'left',
        sortable: 'number',
        minWidth: 100,
        enabled: true,
      },
      generator: async ({ values, storage, user }) => {
        const outages = await storage({ user })
          .store('smartyellow/webserviceoutage')
          .find({ services: values.id })
          .toArray();
        return outages.length || 0;
      },
    },

    outagesOpen: {
      type: 'computed',
      default: 0,
      format: {
        label: 'open outages',
        type: 'number',
        align: 'left',
        sortable: 'number',
        minWidth: 100,
        enabled: true,
      },
      generator: async ({ values, storage, user }) => {
        const outages = await storage({ user })
          .store('smartyellow/webserviceoutage')
          .find({ services: values.id, resolved: false })
          .toArray();
        return outages.length || 0;
      },
    },

    outagesResolved: {
      type: 'computed',
      default: 0,
      format: {
        label: 'resolved outages',
        type: 'number',
        align: 'left',
        sortable: 'number',
        minWidth: 100,
        enabled: true,
      },
      generator: async ({ values, storage, user }) => {
        const outages = await storage({ user })
          .store('smartyellow/webserviceoutage')
          .find({ services: values.id, resolved: true })
          .toArray();
        return outages.length || 0;
      },
    },
  }),
};
