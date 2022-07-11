'use strict';

const { makeId } = require('core/makeid');

const decoder = new TextDecoder('utf-8');
let uws;

async function createDashboardSocket(server) {
  uws = server.ws({
    route: '/statusdashboard/socket',
    onOpen: async ws => {
      function sendTime() {
        try {
          ws.send(JSON.stringify({
            cmd: 'time',
            time: new Date().getTime(),
          }));
        }
        catch {
          return;
        }
      }

      sendTime();
      setInterval(sendTime, 5000);

      async function sendStatuses() {
        const services = await server.storage
          .store('smartyellow/webservice')
          .find()
          .toArray();
        const heartbeats = await server.storage
          .store('smartyellow/webserviceheartbeat')
          .find({ webservice: { $in: services.map(s => s.id) } })
          .sort({ date: -1 })
          .toArray();
        const mappedServices = {};

        for (const s of services) {
          const lastBeat = heartbeats.find(h => h.webservice === s.id);
          mappedServices[s.id] = {
            name: s.name,
            lastBeat: lastBeat || {},
            cluster: s.cluster,
          };
        }

        try {
          ws.send(JSON.stringify({
            cmd: 'data',
            data: mappedServices,
          }));
        }
        catch {
          return;
        }
      }

      sendStatuses();
      setInterval(sendStatuses, 5000);
    },
    onUpgrade: async () => ({ id: makeId(10) }),
    onMessage: async (ws, msg) => {
      msg = JSON.parse(decoder.decode(msg));

      if (!msg || !msg.command) {
        return;
      }

      switch (msg.command) {
        case 'data':
          ws.send('data');
          return;

        default:
          return;
      }
    },
  });
}

module.exports = createDashboardSocket;
