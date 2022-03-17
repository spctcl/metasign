'use strict';

// Import Ceramic HTTP client so that we can connect to a Ceramic node.
import { CeramicClient } from '@ceramicnetwork/http-client';
 
import { randomBytes } from 'crypto'

// Import 3ID DID libraries so that we can create, resolve, and use 3ID DID accounts.
import { DID } from 'dids';
import { getResolver as getKeyResolver } from 'key-did-resolver'
import { getResolver as get3IDResolver} from '@ceramicnetwork/3id-did-resolver'
import ThreeIdProvider from '3id-did-provider'

// We connect to the clay test network.
const API_URL = 'https://ceramic-clay.3boxlabs.com'
const ceramic = new CeramicClient(API_URL)

// DID Functions

// 3ID DID Provider

// We need an auth secret. This is 32 bytes of entropy that we use to authenticate.
const seed = randomBytes(32)
const authId = 'myAuthID'

async function authenticateWithSecret(seed) {
  const threeID = await ThreeIdProvider.create({
    authSecret,
    getPermission: ( request ) => Promise.resolve(request.payload.paths),
  })

  const did = new DID({
    provider: threeID.getDidProvider(),
    resolver: {
      ...get3IDResolver(ceramic),
      ...getKeyResolver(),
    },
  })

  // We use the 3ID Provider to authenticate the DID.
  await did.authenticate()
  
  ceramic.did = did
}

console.log(ceramic);

// 3ID DID Resolver
function createCeramicWith3ID() {
  const did = new DID({
    resolver: {
      ...get3IDResolver(ceramic),
      ...getKeyResolver(),
    },
  })
}

async function load(id) {
  await ceramic.loadStream(id);
}

// import { DID } from 'dids'
// import KeyDidResolver from 'key-did-resolver'
// import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'
import os from 'os'
import http from 'http'

// Create a ThreeIdConnect connect instance as soon as possible in your app to start loading assets
// const threeID = new ThreeIdConnect()

async function authenticateWithEthereum(ethereumProvider) {
    // Request accounts from the Ethereum provider
    const accounts = await ethereumProvider.request({
      method: 'eth_requestAccounts',
    })
    // Create an EthereumAuthProvider using the Ethereum provider and requested account
    const authProvider = new EthereumAuthProvider(ethereumProvider, accounts[0])
    // Connect the created EthereumAuthProvider to the 3ID Connect instance so it can be used to
    // generate the authentication secret
    await threeID.connect(authProvider)
  
    const ceramic = new CeramicClient()
    const did = new DID({
      // Get the DID provider from the 3ID Connect instance
      provider: threeID.getDidProvider(),
      resolver: {
        ...get3IDResolver(ceramic),
        ...getKeyResolver(),
      },
    })
    ceramic.did = did
}

// Enumerate assigned IP addresses.
const { networkInterfaces } = os
// const networks = networkInterfaces();
// console.log(networks);
// const results = Object.create(null); // Or just '{}', an empty object

// for (const name of Object.keys(networks)) {
//     for (const network of networks[name]) { 
//         // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses.
//         if (network.family === 'IPv4' && !network.internal) {
//             if (!results[name]) {
//                 results[name] = [];
//             }
//             results[name].push(network.address);
//         }
//     }
// }

// console.log(results)

// The following works as a simple server for testing.

const request = function (req, res) {
    res.writeHead(200);
    res.end('Hello');
}

const server = http.createServer(request);
console.log("websocket_server server created.")
console.log("websocket_server listening on port 3000...")
server.listen(3000);