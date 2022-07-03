'use strict';

const { makeId } = require('core/makeid');

async function processOutage({ outage, server, settings }) {
  for (const [ id, testResult ] of Object.entries(outage)) {
    // Update check date
    await server.storage.store('smartyellow/webservice').update(
      { id },
      { $set: { lastChecked: new Date() } }
    );

    // Get service entry
    const service = await server
      .storage
      .store('smartyellow/webservice')
      .findOne({ id });

    // Get last heartbeat
    const heartbeat = await server
      .storage
      .store('smartyellow/webserviceheartbeat')
      .find({ webservice: id })
      .toArray();
    const lastBeat = heartbeat[heartbeat.length - 1];

    // Encountered an error while checking status
    if (testResult.error) {
      server.error('Error while checking status of ' + id);
      server.error(testResult);
    }

    // Service is down
    else if (!testResult.serviceUp) {
      // Don't perform automatic actions if already done
      if ((lastBeat && lastBeat.down == false) || !lastBeat) {
        // Insert heartbeat if last one is not valid anymore
        try {
          await server.storage.store('smartyellow/webserviceheartbeat').insert({
            id: makeId(6),
            down: true,
            webservice: id,
            testResult,
            date: new Date(),
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
              subject: `[outage] ${service.name} is down`,
              body: `<p>Dear recipient,</p>
                    <p>This is to inform you about web service outage.
                        The service <em>${service.name}</em> does not meet the
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
                  en: `[automatic] Outage for ${service.name}`,
                },
                state: 'concept',
                resolved: false,
                services: [ service.id ],
                tags: [ 'automatically created' ],
                notes: [ {
                  date: new Date(),
                  userId: 'system',
                  text: `Automatically created outage. Reason: ${JSON.stringify(testResult, null, 2)}`,
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
      // Don't perform automatic actions if already done
      if ((lastBeat && lastBeat.down == true) || !lastBeat) {
        // Insert heartbeat if last one is not valid anymore
        try {
          await server.storage.store('smartyellow/webserviceheartbeat').insert({
            id: makeId(6),
            down: false,
            webservice: id,
            testResult,
            date: new Date(),
          });
        }
        catch (err) {
          server.error(err);
          server.error('could not save web service heartbeat');
        }
      }
    }
  }
}

module.exports = { processOutage };
