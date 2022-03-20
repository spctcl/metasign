import { Avatar, Button } from '@nextui-org/react'
import { CeramicClient } from '@ceramicnetwork/http-client'
import { DID } from 'dids'
import { DataModel } from '@glazed/datamodel'
import { DIDDataStore } from '@glazed/did-datastore' // This implements the Identity Index (IDX) protocol and allows Ceramic tiles to be associated with a DID.
import { getResolver as get3IDResolver } from '@ceramicnetwork/3id-did-resolver'
import { getResolver as getKeyResolver } from 'key-did-resolver'
import { Container, Grid, Spacer, useTheme, Text } from '@nextui-org/react';
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

    async function getMyDefinitionRecord(did) {
      return await dataStore.get('myDefinition', did)
    }

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
    const document = await createDocument({ name: 'Sam' }, schemaID)
    console.log("document: ", document);
    setAvatarName({value: document.content.name})
    setUserOutput({value: document.content.name})
  }

  // const getUserProfile = async () => {
  //   return await dataStore.get('myDefinition', did)
  // }

  const createDeviceProfile = async () => {
    const schemaID = await createDeviceProfileSchema()
    const deviceProfile = {
      sensor: {
        sensorOutput: [
          {
            name: "Temperature Sensor",
            value: 45,
            units: "Celsius"
          },
          {
            name: "Humidity Sensor",
            value:22,
            units: "Relative Humidity"
          },
          {
            name: "Pressure Sensor",
            value: 723,
            units: "mmHg"
          }
        ],
        deviceName: "Jack's Sensor"
      }
    }
    const document = await createDocument(deviceProfile, schemaID)
    setDocumentId({value: document.id})
    setDeviceName({value: document.content.sensor.deviceName})
    setDeviceOutput({value: document.content.sensor.sensorOutput})
    console.log("deviceOutput: ", deviceOutput);
    console.log("document.content.sensor: ", document.content.sensor.deviceName);
    console.log("document.content.sensor: ", document.content.sensor);
  }

  // This function creates documents of all types.
  const createDocument = async (content, schema) => {
    console.log("ceramic.did: ", ceramic.did);
    const document = await TileDocument.create(ceramic, content, { schema })
    
    return document
  }

  const updateDeviceProfile = async (content) => {
    if (ceramic.did === undefined) {
      await authenticate();
    }
    if (documentId.value !== undefined) {
      const document = await TileDocument.load(ceramic, documentId.value)
      console.log("updateDeviceProfile: document: ", document);
      console.log("document: ", document);
      const deviceProfile = {
        sensor: {
          sensorOutput: [
            {
              name: "Temperature Sensor",
              value: 45,
              units: "Celsius"
            },
            {
              name: "Humidity Sensor",
              value:22,
              units: "Relative Humidity"
            },
            {
              name: "Pressure Sensor",
              value: 759,
              units: "mmHg"
            }
        ],
          deviceName: "Jane's Sensor"
        }
      }
      await document.update(deviceProfile)
      console.log("document.content.deviceName: ", document.content.sensor);
      setDeviceName({value: document.content.sensor.deviceName});
      setDeviceOutput({value: document.content.sensor.sensorOutput});
      console.log("updateDeviceProfile deviceOutput: ", deviceOutput);
    }
  }

  async function updateDocument() {
    if (ceramic.did === undefined) {
      await authenticate();
    }
    console.log("updateDocument() document id: ", documentId)
    const doc = await TileDocument.load(ceramic, documentId)
    console.log("loaded doc: ", doc);
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
          sensor: {
            type: "object",
            properties: {
              sensorOutput: {
                type: "array",
                properties: {
                  name: {
                    type: "string",
                    maxLength: 150
                  },
                  value: {
                    type: "number"
                  }
                }
              },
              deviceName: {
                type: "string",
                maxLength: 150
              }
            }
          }
        },
        required: ['deviceName'],
      })

      console.log("deviceSchema.content: ", deviceSchema.content);
      console.log("deviceSchema.commitID ", deviceSchema.commitId);

      return deviceSchema.commitID
  }


  // Helper methods.

  const getUserName = async () => {
    if (ceramic.did !== undefined) {
      // TODO: Retrieve and return user name.
    }
  }

  // State variables.
  const [userOutput, setUserOutput] = useState("");
  const [avatarName, setAvatarName] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [deviceOutput, setDeviceOutput] = useState([]);


  const handleAvatarChange = (event) => {
    setAvatarName({value: "Avatar Name"})
  }

  const handleTextChange = (event) => {
    setTextOutput({value: "Text has changed"})
  }

  const getFormattedOutput = () => {
    let output = "";
    if (deviceOutput.value !== undefined) {
      deviceOutput.value.forEach(item => {
        //let sensorList = ""
        output += "Type: " + item.name + "\n" + "Value: " + item.value + " " + item.units + "\n\n"
      });
    }
    return output
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>MetaSign</title>
        <meta name="The MetaSign App" content="This is MetaSign" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <main className={styles.main}> */}
        <Spacer y={1}/>
        <Grid.Container gap={2} justify="center">
          <Grid xs>
            <Avatar text={avatarName.value} onChange={handleAvatarChange} color="gradient" size="xl" bordered squared />
            <Container></Container>
            <Button onClick={authenticate}>Authenticate</Button>
          </Grid>
        </Grid.Container>
        <Spacer y={2}/>
        <Grid.Container gap={2} justify="center">
          <Grid xs>
          <Container></Container>
            <Button.Group color="gradient" ghost>
              <Button onClick={createUserProfile}>Create User Profile</Button>
              <Button onClick={createDeviceProfile}>Create Device Profile</Button>
              <Button onClick={updateDeviceProfile}>Update Device Profile</Button>
            </Button.Group>
          <Container></Container>
          </Grid>
          </Grid.Container>
          <Spacer y={2}/>
          <Grid.Container gap={2} justify="center">
            <Grid xs="0">
            </Grid>
            <Grid xs="4">
              <Container>
                <Textarea readOnly label="User:" value={userOutput.value} onChange={handleTextChange} size="lg" minRows={1}/>
              </Container>
            </Grid>
            <Grid xs="4">
              <Container>
                <Textarea readOnly label="Device Name:" value={deviceName.value} size="lg" minRows={1}/>
              </Container>
            </Grid>
            <Grid xs="4">
              <Container>
                <Textarea readOnly label="Device Output:" value={getFormattedOutput()} size="lg" rows={20} minRows={10} />
              </Container>
            </Grid>
          </Grid.Container>
      {/* </main> */}

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}
