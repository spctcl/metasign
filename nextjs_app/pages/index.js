import { Button } from '@nextui-org/react'
import { CeramicClient } from '@ceramicnetwork/http-client'
import { DID } from 'dids'
import { DataModel } from '@glazed/datamodel'
import { DIDDataStore } from '@glazed/did-datastore' // This implements the Identity Index (IDX) protocol and allows Ceramic tiles to be associated with a DID.
import { getResolver as get3IDResolver } from '@ceramicnetwork/3id-did-resolver'
import { getResolver as getKeyResolver } from 'key-did-resolver'
import { Grid, Spacer } from '@nextui-org/react';
import { ethers } from 'ethers'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { EthereumAuthProvider, ThreeIdConnect } from '@3id/connect'
import { Textarea } from '@nextui-org/react'
import { useState } from "react";
import { TileDocument } from '@ceramicnetwork/stream-tile';
import { WalletConnectProvider } from '@walletconnect/web3-provider';
import Web3Modal from "web3modal";

export default function Home(props) {
  const infuraId = process.env.NEXT_PUBLIC_ENV_LOCAL_INFURA_ID;

  // Instantiate Ceramic HTTP client.
  const API_URL = "http://localhost:7007"
  const ceramic = new CeramicClient(API_URL);

  const authenticate = async () => {
    console.log("Authenticate...");

    // Connect to Metamask.
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    
    // Get accounts.
    console.log(await provider.listAccounts());
    await ethereum.enable;
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log("signer: ", signer);
    const address = await signer.getAddress();
    console.log("account address:", address); 

    const threeIDConnect = new ThreeIdConnect();

    // Instantiate Web3Modal with the desired providers.
    const providerOptions = {
      package: WalletConnectProvider,
      options: {
        infuraId: infuraId,
      }
    }

    const web3Modal = new Web3Modal({
      walletconnect: {
        network: 'mainnet',
        cacheProvider: true,
        providerOptions: providerOptions
      }
    })

    // Connect using Web3Modal.
    const ethProvider = await web3Modal.connect();
    const addresses = await ethProvider.enable();
    console.log("addresses[0]: ", addresses[0]);
    const ethereumAuthProvider = new EthereumAuthProvider(ethProvider, addresses[0]);
    await threeIDConnect.connect(ethereumAuthProvider)

    const did = new DID({
      provider: threeIDConnect.getDidProvider(),
      resolver: {
        ...get3IDResolver(ceramic),
        ...getKeyResolver(),
      }
    })

    // Trigger the authentication flow for the DID using 3ID Connect's 3ID provider. 
    const res = await did.authenticate()
    console.log("res: ", res);
    
    // Set DID instance on the Ceramic HTTP client.
    ceramic.did = did;
    console.log(ceramic.did);
  }

  const createUserProfile = async () => {
    const schemaID = await createUserProfileSchema()
    const documentID = await createDocument({ name: 'User 1' }, schemaID)
    console.log("documentID: ", documentID);
  }

  const createDeviceProfile = async () => {
    const schemaID = await createDeviceProfileSchema()
    const documentID = await createDocument({ deviceName: 'Device 1' }, schemaID)
    console.log("documentID: ", documentID);
  }

  // This function creates documents of all types.
  const createDocument = async (content, schema) => {

    console.log("ceramic.did: ", ceramic.did);
    const document = await TileDocument.create(ceramic, content, { schema })

    setTextOutput({value: document.id})
    return document.id
  }

  // Schema creation.
  const createUserProfileSchema = async () => {
        if (ceramic.did === undefined) {
          await authenticate();
        }
        const userSchema = await TileDocument.create(ceramic, {
          $schema: 'http://json-schema.org/draft-07/schema#',
          title: 'UserSchema',
          type: 'object',
          properties: {
            name: {
              type: 'string',
              maxLength: 150.
            },
          },
          required: ['name'],
        })

        console.log("userSchema: ", userSchema);
        console.log("userSchema.commitID ", userSchema.commitId);

        return userSchema.commitID
  }

  const createDeviceProfileSchema = async () => {
    if (ceramic.did === undefined) {
      await authenticate();
    }
      const deviceSchema = await TileDocument.create(ceramic, {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'DeviceSchema',
        type: 'object',
        properties: {
          name: {
            type: 'string',
            maxLength: 150.
          },
        },
        required: ['deviceName'],
      })

      console.log("deviceSchema: ", deviceSchema);
      console.log("deviceSchema.commitID ", deviceSchema.commitId);

      return deviceSchema.commitID
  }

  const [textOutput, setTextOutput] = useState("");

  const handleTextChange = (event) => {
    setTextOutput({value: "Text has changed"})
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>MetaSign</title>
        <meta name="The MetaSign App" content="This is MetaSign" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <main className={styles.main}> */}
        <Grid.Container gap={2} justify="center">
            <Grid xs={12}>
              <Button.Group color="gradient" ghost>
                <Button onClick={authenticate}>Authenticate</Button>
                <Button onClick={createUserProfile}>Create User Profile</Button>
                <Button onClick={createDeviceProfile}>Create Device Profile</Button>
              </Button.Group>
            </Grid>
            <Grid xs={12}>
              <Textarea readOnly label="Output text appears here." value={textOutput.value} onChange={handleTextChange}/>
            </Grid>
        </Grid.Container>
      {/* </main> */}

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
