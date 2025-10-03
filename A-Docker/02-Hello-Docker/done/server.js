// copied from https://nodejs.org/en/about/

const { createServer } = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, () => { // <-- change this line
  console.log(`Server running at http://${hostname}:${port}/`);
});
