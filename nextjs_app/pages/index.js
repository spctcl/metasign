import { ethers } from 'ethers'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { EthereumAuthProvider, ThreeIdConnect } from '@3id/connect'
import { WalletConnectProvider } from '@walletconnect/web3-provider';
import Web3Modal from "web3modal";

// import { CeramicClient } from '@ceramicnetwork/http-client'
// import { DID } from 'dids'
// import { getResolver as getKeyResolver } from 'key-did-resolver'
// import { getResolver as get3IDResolver } from '@ceramicnetwork/3id-did-resolver'


export default function Home(props) {
  // const [state, dispatch] = useReducer(reducer, initialState)
  // const { provider, web3Provider, address, chainId } = state
  const infuraId = process.env.NEXT_PUBLIC_ENV_LOCAL_INFURA_ID;

  const authenticate = async () => {
    console.log("Authenticate...");
    console.log("Infura ID: ", infuraId);

    // Connect to Metamask.
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await ethereum.enable;
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log("Account:", await signer.getAddress());   
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>MetaSign</title>
        <meta name="The MetaSign App" content="This is MetaSign" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <button onClick={authenticate}>Authenticate</button>
      </main>

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
