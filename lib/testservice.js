'use strict';

const { testEndpoints } = require('./testendpoints');
const { roundDate } = require('./utils');

async function testService({ service, server, settings, makeId }) {
  if (!service.autotestEnabled) {
    return;
  }

  try {
    // Autotest the service
    const result = await testEndpoints(service.autotest);
    const name = service.name.en;

    // Insert check date
    await server.storage.store('smartyellow/webservice').update(
      { id: service.id },
      { $set: { lastChecked: new Date() } }
    );

    // Get all heartbeats plus the last one
    const heartbeat = await server
      .storage
      .store('smartyellow/webserviceheartbeat')
      .find({ webservice: service.id })
      .toArray();
    const lastBeat = heartbeat[heartbeat.length - 1];

    // Get date
    const date = roundDate(new Date());

    // Error
    if (result.error) {
      server.error('Error while checking status: ' + name);
      server.error(result);
    }

    // Service down
    else if (!result.serviceUp) {
      server.warn('Service down: ' + name);
      server.warn(result);

      // Don't perform automatic actions if already done
      if ((lastBeat && lastBeat.down == false) || !lastBeat) {
        // Insert heartbeat if last one is not valid anymore
        try {
          await server.storage.store('smartyellow/webserviceheartbeat').insert({
            id: makeId(6),
            down: true,
            webservice: service.id,
            testResult: result,
            date: date,
          });
        }
        catch (err) {
          server.error(err);
          server.error('could not save web service heartbeat');
        }

        // Send e-mail notification
        if (server.sendEmail && settings.emailSender && settings.emailRecipient) {
          try {
            await server.sendEmail({
              sender: settings.emailSender,
              to: settings.emailRecipient,
              subject: `[outage] ${name} is down`,
              body: `<p>Dear recipient,</p>
                    <p>This is to inform you about web service outage.
                        The service <em>${name}</em> does not meet the
                        requirements for being considered as 'working'.</p>
                    <p>Please always check this before taking action.</p>`,
            });
          }
          catch (err) {
            server.error(err);
            server.error('could not send endpoint status notification e-mail');
          }
        }

        // Draft outage entry
        if (settings.draftOutageEntries) {
          try {
            await server
              .storage
              .store('smartyellow/webserviceoutage')
              .insert({
                id: makeId(6),
                name: {
                  en: `[automatic] Outage for ${name}`,
                },
                state: 'concept',
                resolved: false,
                services: [ service.id ],
                tags: [ 'automatically created' ],
                notes: [ {
                  date: new Date(),
                  userId: 'system',
                  text: `Automatically created outage. Reason: ${JSON.stringify(result, null, 2)}`,
                } ],
              });
          }
          catch (err) {
            server.error(err);
            server.error('could not automatically draft outage entry');
          }
        }
      }
    }

    // Service up
    else {
      server.info('Service up: ' + name);

      // Insert heartbeat if last one is not valid anymore
      if ((lastBeat && lastBeat.down == true) || !lastBeat) {
        try {
          await server.storage.store('smartyellow/webserviceheartbeat').insert({
            id: makeId(6),
            down: false,
            webservice: service.id,
            date: date,
            testResult: result,
          });
        }
        catch (err) {
          server.error(err);
          server.error('could not save web service heartbeat');
        }
      }
    }
  }
  catch (err) {
    server.error(err);
  }
}

module.exports = { testService };
