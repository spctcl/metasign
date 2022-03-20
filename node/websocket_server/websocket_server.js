'use strict';

const dns = require('dns');
const dnsPromises = dns.promises;
const options = {
    family: 4,
    hints: dns.ADDRCONFIG | dns.V4MAPPED
}

options.all = true;

// The following block works, but it's a little vebose.
const { networkInterfaces } = require('os');
const networks = networkInterfaces();
console.log(networks);
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(networks)) {
    for (const network of networks[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (network.family === 'IPv4' && !network.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(network.address);
        }
    }
}

console.log(results)
// console.log(results)

// The following works as a simple server for testing.

// const request = function (req, res) {
//     res.writeHead(200);
//     res.end('Hello');
// }

// const server = http.createServer(request);
// console.log("websocket_server server created.")
// console.log("websocket_server listening on port 3000...")
// server.listen(3000);