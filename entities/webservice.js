'use strict';

const { makeId } = require('core/makeid');

const states = {
  concept: 'concept',
  online: 'online',
  offline: 'offline',
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
        { label: 'meta',
          sections: [
            'id',
            'name',
            'state',
            'public',
            'tags',
            'channels',
          ],
        },
        { label: 'description',
          sections: [
            'summary',
            'visual',
            'body',
          ],
        },
        { label: 'auto testing',
          sections: [
            'autotestEnabled',
            'lastChecked',
            'autotest',
          ],
        },
        { label: 'statistics',
          sections: [
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
          label: 'is public?',
          hint: 'If checked, this service will be shown on the status dashboard.',
          fields: [
            { key: 'public',
              editor: 'checkbox',
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
          fields: [
            { key: 'summary',
              editor: 'text',
              localized: true,
            },
          ],
        },

        body: {
          label: 'body',
          fields: [
            { key: 'body',
              editor: 'text',
              type: 'string',
              localized: true,
              markup: true,
            },
          ],
        },

        visual: {
          label: 'visual',
          fields: [
            { key: 'visual',
              editor: 'file',
              accept: [ 'image/*' ],
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

        autotestEnabled: {
          label: 'autotesting enabled?',
          fields: [
            { key: 'autotestEnabled',
              editor: 'checkbox',
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

    body: {
      type: 'stringset',
      default: '',
      filter: {
        title: 'message contains',
        match: '[a-z0-9A-Z]*',
        localized: true,
      },
    },

    autotest: {
      default: [],
    },

    visual: {
      type: 'array',
      of: [ 'string' ],
      default: [],
      skip: true,
      onDataValid: async ({ newValues, storage, user }) => {
        newValues.visual = newValues.visual || [];
        for (let i = 0; i < newValues.visual.length; i++) {
          if (newValues.visual[i].data) {
            if (storage) {
              // If storage is available, insert the new file into storage and collect id
              const result = await storage({ user }).bucket('webdesq/media').insert({
                id: makeId(6),
                filename: newValues.visual[i].name,
                metadata: {
                  contentType: newValues.visual[i].type,
                },
              }, newValues.visual[i].data)
                .catch(error => {
                  if (error.code !== 'DUPLICATE_FILE') {
                    throw error;
                  }
                  newValues.visual[i] = error.file.id;
                });
              if (result) {
                newValues.visual[i] = result.id;
              }
            }
            else {
              // If no storage is available, remove slot by setting it to null
              newValues.visual[i] = null;
            }
          }
          // remove empty slots in photo array
          newValues.visual = newValues.visual.filter(i => i != null);
          newValues.visual = [ ...new Set(newValues.visual) ];
        }
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
