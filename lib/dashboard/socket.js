'use strict';

const { makeId } = require('core/makeid');

const decoder = new TextDecoder('utf-8');
let uws;
let downIdsBefore = [];
let downIdsAfter = [];

const mapService = (s, beat) => ({
  id: s.id,
  name: s.name,
  cluster: s.cluster,
  lastBeat: beat,
  checked: s.lastChecked,
});

async function createDashboardSocket(server) {
  uws = server.ws({
    route: '/statusdashboard/socket',
    onOpen: async ws => {
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

        const servicesUp = [];
        const servicesDown = [];
        const servicesUnknown = [];
        downIdsAfter = [];

        for (let service of services) {
          const beat = heartbeats.find(b => b.webservice === service.id);
          service = mapService(service, beat);

          if (!beat) {
            servicesUnknown.push(service);
          }
          else if (beat.down) {
            servicesDown.push(service);
            downIdsAfter.push(service.id);
          }
          else {
            servicesUp.push(service);
          }
        }

        const total = [
          ...servicesUp,
          ...servicesDown,
          ...servicesUnknown,
        ].length;

        let newOutage = false;
        for (const id of downIdsAfter) {
          if (!downIdsBefore.includes(id)) {
            newOutage = true;
          }
        }
        downIdsBefore = JSON.parse(JSON.stringify(downIdsAfter));

        try {
          if (newOutage) {
            ws.send(JSON.stringify({ cmd: 'bell' }));
          }

          ws.send(JSON.stringify({
            cmd: 'data',
            servicesUp,
            servicesDown,
            servicesUnknown,
            total,
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
