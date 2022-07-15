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

module.exports = { testEndpoints };
