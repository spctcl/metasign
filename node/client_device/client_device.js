// We need a host and port. These are the name of the container and the 
// open port, respectively.

const http = require('http');

const request = function (req, res) {
    res.writeHead(200);
    res.end('Hello');
}

const server = http.createServer(request);
console.log("client_device server created.")
console.log("client_device listening on port 3001...")
server.listen(3001);