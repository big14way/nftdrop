import { cookieStorage, createStorage } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { http } from "viem";

// Determine which chain to use based on env
const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "84532");
export const targetChain = chainId === 8453 ? base : baseSepolia;

// Wagmi config
export const config = {
  chains: [targetChain] as const,
  transports: {
    [targetChain.id]: http(),
  },
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
} as const;

// Metadata for WalletConnect
export const metadata = {
  name: "Base NFT Dropper",
  description:
    "Mint exclusive Builder Badge NFTs on Base, store messages on-chain, and send tips to creators.",
  url: typeof window !== "undefined" ? window.location.origin : "https://base-nft-dropper.vercel.app",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// Project ID from Reown
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

if (!projectId) {
  throw new Error("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set");
}

// Contract address
export const NFT_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS ||
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

// IPFS Gateway
export const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || "https://gateway.pinata.cloud/ipfs/";
