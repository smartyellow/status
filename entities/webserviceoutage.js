'use strict';

const { makeId } = require('core/makeid');

const states = {
  concept: 'concept',
  online: 'online',
  offline: 'offline',
};

const severity = {
  major: 'major outage',
  minor: 'minor outage',
  scheduled: 'scheduled maintenance',
  none: 'no impact on end user',
};

module.exports = {
  format: 5,
  author: 'Romein van Buren',
  vendor: 'Smart Yellow',
  purpose: 'Keep track of web service outage',
  store: 'webserviceoutage',

  forms: ({ settings }) => ({
    default: {
      pages: [
        { label: 'meta',
          sections: [
            'id',
            'name',
            'state',
            'severity',
            'resolved',
            'services',
            'tags',
          ],
        },
        { label: 'description',
          sections: [
            'summary',
            'visual',
            'body',
          ],
        },
        { label: 'updates',
          sections: [ 'updates' ],
        },
        { label: 'internal notes',
          sections: [ 'notes' ],
        },
      ],

      sections: {
        id: {
          label: 'id',
          fields: [
            { key: 'id',
              editor: 'string',
              validator: '',
              visible: false,
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

        severity: {
          label: 'severity',
          fields: [
            { key: 'severity',
              editor: 'select',
              options: severity,
              translate: true,
            },
          ],
        },

        resolved: {
          label: 'resolved?',
          fields: [
            { key: 'resolved',
              editor: 'checkbox',
            },
          ],
        },

        services: {
          label: 'services',
          fields: [
            { key: 'services',
              editor: 'multiselect',
              placeholder: 'Add one or more web services this outage message belongs to.',
              options: async ({ storage, user }) => await storage({ user })
                .store('smartyellow/webservice')
                .find({ 'log.deleted': { $exists: false } })
                .toObject('id', 'name'),
            },
          ],
        },

        name: {
          label: 'name',
          fields: [
            { key: 'name',
              editor: 'string',
              placeholder: 'a really brief description of the outage',
              localized: true,
            },
          ],
        },

        tags: {
          label: 'tags',
          fields: [
            { key: 'tags',
              editor: 'multiselect',
              placeholder: 'enter tags...',
              visible: !!(settings.outageTags && Object.keys(settings.outageTags).length),
              options: settings.outageTags,
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

        updates: {
          label: 'updates',
          fields: [
            { key: 'updates',
              editor: 'notes',
              userId: true,
              placeholder: 'updates',
            },
          ],
        },

        notes: {
          label: 'notes',
          fields: [
            { key: 'notes',
              editor: 'notes',
              userId: true,
              //localized: true,
              placeholder: 'notes',
            },
          ],
        },
      },
    },
  }),

  schema: () => ({
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
          const r = storage ? await storage.store('webdesq/blog').get(newValues.id) : null;
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

    severity: {
      type: 'string',
      required: true,
      default: '',
      filter: {
        title: 'severity',
        options: severity,
      },
      format: {
        label: 'severity',
        type: 'state',
        align: 'left',
        sortable: 'text',
        minWidth: 90,
        enabled: true,
        options: {
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
        },
      },
    },

    resolved: {
      type: 'boolean',
      default: true,
      format: {
        type: 'checkbox',
        sortable: 'boolean',
        align: 'center',
        label: 'resolved?',
        minWidth: 90,
        enabled: true,

        //type: 'state',
        //options: {
        //  true: {
        //    name: 'yes',
        //    class: 'l5',
        //  },
        //  false: {
        //    name: 'no',
        //    class: 'l1',
        //  },
        //},
      },
    },

    tags: {
      type: 'array',
      of: 'string',
      default: [],
      filter: {
        title: 'tags',
        match: '^[a-z]',
        options: async ({ storage }) => (await storage.store('smartyellow/webserviceoutage').find({ 'log.deleted': { $exists: false } }, { keys: [ 'id', 'tags' ] }).sort({ name: 1 }).toArray())
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

    notes: {
      type: 'array',
      of: {},
      default: [],
    },

    updates: {
      type: 'array',
      of: {},
      default: [],
    },
  }),
};
