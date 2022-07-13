'use strict';

const { testEndpoints } = require('./testendpoints');

process.on('message', async message => {
  switch (message.command) {
    case 'testAll':
      if (!message.services) {
        process.send({ error: 'services is not defined' });
      }
      else {
        const ids = [];
        const promises = [];

        for (const service of message.services) {
          const lastChecked = new Date(service.lastChecked);
          let timePassed = new Date().getTime() - lastChecked.getTime();
          timePassed = timePassed / 1000 / 60;
          const interval = service.autotestInterval;
          const needsCheck = timePassed >= interval;

          if (needsCheck) {
            ids.push(service.id);
            promises.push(testEndpoints(service.autotest));
          }
        }

        const result = await Promise.all(promises);
        const mapped = {};
        for (const [ i, id ] of ids.entries()) {
          mapped[id] = result[i];
        }

        process.send({ outage: mapped });
      }
      break;

    case 'testOne':
      if (!message.service) {
        process.send({ error: 'service is not defined' });
      }
      else {
        const { service } = message;
        const result = await testEndpoints(service.autotest);
        process.send({ outage: result });
      }
      break;

    default:
      console.error('Unknown command:', message.command);
      break;
  }
});
