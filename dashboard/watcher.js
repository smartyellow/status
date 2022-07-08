'use strict';

const chokidar = require('chokidar');
const dashboard = require('./index');

let watcher;
const handler = async () => {
  console.log('status dashboard watcher triggered, rebuilding...');
  await dashboard.cleanup();
  await dashboard.build();
  process.send({ command: 'reload' });
};

process.on('message', message => {
  switch (message.command) {
    case 'start':
      if (message.path) {
        watcher = chokidar.watch(message.path, {
          ignored: [ /node_modules/, /build/ ],
        });

        watcher.on('add', handler);
        watcher.on('change', handler);
        watcher.on('unlink', handler);
      }
      break;

    default:
      console.log(`Status dashboard watcher received unknown command ${message.command}`);
      break;
  }
});
