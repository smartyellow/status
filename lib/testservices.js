'use strict';

const { testService } = require('./testservice');

async function testServices({ server, settings, makeId }) {
  const services = await server
    .storage
    .store('smartyellow/webservice')
    .find({ autotestEnabled: true })
    .toArray();

  services.forEach(async service => {
    if (service.autotestEnabled) {
      testService({ service, server, settings, makeId });
    }
  });
}

module.exports = { testServices };
