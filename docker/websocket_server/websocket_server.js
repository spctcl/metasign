// We need a host and port. These are the name of the container and the 
// open port, respectively.

const http = require('http');

const request = function (req, res) {
    res.writeHead(200);
    res.end('Hello');
}

const server = http.createServer(request);
console.log("websocket_server server created.")
console.log("websocket_server listening on port 3000...")
server.listen(3000)