'use strict';

const { makeId } = require('core/makeid');

module.exports = {
  format: 5,
  author: 'Romein van Buren',
  vendor: 'Smart Yellow',
  purpose: 'Store the heartbeat of web services',
  store: 'webserviceheartbeat',

  schema: () => ({
    id: {
      type: 'string',
      required: ({ newEntity }) => newEntity,
      lowercase: true,
      trim: true,
      filter: {
        title: 'id',
        match: '^[a-zA-Z0-9]{10}$',
        order: 999,
      },
      default: () => makeId(10),
      validate: async ({ newValues, oldValues, newEntity, storage }) => {
        if (newEntity) {
          const r = storage ? await storage.store('smartyellow/webserviceheartbeat').get(newValues.id) : null;
          return (r == null ? true : 'id already exists');
        }
        else {
          // ID cannot be changed if record was already created
          return (newValues.id == oldValues.id ? true : 'id cannot be changed');
        }
      },
    },

    down: {
      type: 'boolean',
      default: true,
      required: [ true, 'is the service up or down?' ],
      format: {
        type: 'state',
        options: {
          true: {
            name: 'yes',
            class: 'l1',
          },
          false: {
            name: 'no',
            class: 'l5',
          },
        },
      },
    },

    webservice: {
      type: 'string',
      default: '',
      required: [ true, 'webservice id is missing' ],
      validate: async ({ storage, newValues }) => {
        const r = storage ? await storage.store('smartyellow/webservice').get(newValues.webservice) : null;
        return r == null ? 'service id does not exist' : true;
      },
    },

    date: {
      type: 'date',
      default: '',
      required: [ true, 'date is missing' ],
    },
  }),
};
