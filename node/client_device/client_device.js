// This client code represents a wireless device which
// uses decentralized identity (did) JSON Web Tokens (JWTs) to authenticate to
// a mock service.

// The client device should contain a "wallet".

// We use Ceramic as a data store.
// Import the client.
import { CeramicClient } from '@ceramicnetwork/http-client'
import * as http from 'http'
import { randomBytes } from 'crypto'

const API_URL = 'https://ceramic-clay.3boxlabs.com'
const ceramic = new CeramicClient(API_URL)

// CRUD Operations

// Create a stream.
// For this we need a valid seed. In the browser, this can be accomplished with the
// 3ID Connect, but for the key did method.
const seed = randomBytes(32)

// From the Ceramic docs: In order to update a document, an 
// authenticated DID needs to be attached to the Ceramic 
// client instance to enable transactions (signing commits).
// Update a stream.

// Load a a stream.
async function load(id) {
    return await ceramic.loadStream(id)
}

// We need a host and port. These are the name of the container and the 
// open port, respectively.

const request = function (req, res) {
    res.writeHead(200);
    res.end('Hello');
}

const server = http.createServer(request);
console.log("client_device server created.")
console.log("client_device listening on port 3001...")
server.listen(3001);