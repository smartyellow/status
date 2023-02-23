'use strict';

const fetch = require('node-fetch');
const { operators } = require('./operators');
const { realValues } = require('./realvalues');
const http = require('http');
const https = require('https');

// Force requests over IPv4
const httpAgent = new http.Agent({ family: 4 });
const httpsAgent = new https.Agent({ family: 4 });

async function testEndpoints(endpoints) {
  const output = {
    serviceUp: undefined,
    success: true,
    error: false,
    requirement: undefined,
    realValue: undefined,
  };

  for (const endpoint of endpoints) {
    try {
      const headers = endpoint.headers.reduce((obj, item) => {
        obj[item.name] = item.value;
        return obj;
      }, {});

      const res = await fetch(endpoint.uri, {
        headers,
        agent: url => {
          if (url.protocol === 'http:') {
            return httpAgent;
          }
          return httpsAgent;
        },
      });
      const body = await res.text();

      endpoint.requirements.forEach(requirement => {
        if (output.success === false || output.serviceUp === false) {
          return;
        }

        if (!Object.keys(operators).includes(requirement.operator)) {
          output.success = false;
          output.error = 'unknown operator: ' + requirement.operator;
        }

        if (!Object.keys(realValues).includes(requirement.type)) {
          output.success = false;
          output.error = 'unknown type: ' + requirement.type;
        }

        const realValue = realValues[requirement.type]({ res, body });
        let result = operators[requirement.operator](realValue, requirement.string);

        if (!requirement.truth) {
          result = !result;
        }

        if (!result) {
          output.serviceUp = false;
          output.requirement = requirement;
          output.realValue = realValue;
        }
        else {
          output.serviceUp = true;
        }
      });
    }
    catch (err) {
      output.success = false;
      output.serviceUp = false;
      output.error = err;
      console.error(err);
    }
  }

  return output;
}

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
      process.exit();

    case 'testOne':
      if (!message.service) {
        process.send({ error: 'service is not defined' });
      }
      else {
        const { service } = message;
        const result = await testEndpoints(service.autotest);
        process.send({ outage: result });
      }
      process.exit();

    default:
      console.error('Unknown command:', message.command);
      process.exit();
  }
});
