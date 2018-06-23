// copied from https://nodejs.org/en/about/

const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, () => { // <-- changed this line
  console.log(`Server running at http://${hostname}:${port}/`);
});
