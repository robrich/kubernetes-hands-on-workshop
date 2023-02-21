#!/usr/bin/env node

import app from './app.js';
import debug from 'debug';
import http from 'http';

debug('backend:server');

const port = process.env.PORT || '5000';
app.set('port', port);

const server = http.createServer(app);

server.on('error', function onError(error) {
  console.error(err);
  process.exit(1);
});
server.listen(port, function onListening() {
  console.log(`Listening on http://+:${port}/`);
});
