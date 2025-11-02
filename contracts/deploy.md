# Smart Contract Deployment Guide

## Prerequisites

1. **Get Base Sepolia ETH** (Testnet)
   - Faucet: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
   - Or use Alchemy/QuickNode faucets

2. **Install Foundry** (Recommended) or use **Remix IDE**
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

## Option 1: Deploy with Remix (Easiest)

### Step 1: Prepare OpenZeppelin Imports

1. Go to https://remix.ethereum.org
2. Install OpenZeppelin contracts:
   - In Remix, the imports will auto-resolve from npm

### Step 2: Deploy BaseNFTDrop

1. Copy `BaseNFTDrop.sol` to Remix
2. Compile with Solidity 0.8.20+
3. Deploy tab:
   - Environment: "Injected Provider - MetaMask"
   - Connect to Base Sepolia (Chain ID: 84532)
   - Constructor args:
     - `baseURI`: `ipfs://YOUR_CID/` (see metadata section below)
4. Click "Deploy" and confirm in wallet
5. Copy deployed contract address

### Step 3: Deploy StorageVault

1. Copy `StorageVault.sol` to Remix
2. Compile with Solidity 0.8.20+
3. Deploy (no constructor args)
4. Copy deployed contract address

### Step 4: Verify on BaseScan

1. Go to https://sepolia.basescan.org
2. Search your contract address
3. Click "Contract" → "Verify and Publish"
4. Select:
   - Compiler: v0.8.20
   - License: MIT
   - Paste flattened source code
5. Submit

## Option 2: Deploy with Foundry

### Setup

```bash
cd contracts
forge init --force
forge install OpenZeppelin/openzeppelin-contracts
```

### foundry.toml

```toml
[profile.default]
src = "."
out = "out"
libs = ["node_modules", "lib"]
remappings = [
    "@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/"
]

[rpc_endpoints]
base_sepolia = "https://sepolia.base.org"

[etherscan]
base_sepolia = { key = "${BASESCAN_API_KEY}", url = "https://api-sepolia.basescan.org/api" }
```

### Deploy Script

```bash
# Set your private key (NEVER commit this!)
export PRIVATE_KEY="your_private_key"
export BASE_URI="ipfs://YOUR_CID/"

# Deploy BaseNFTDrop
forge create BaseNFTDrop \
  --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY \
  --constructor-args "$BASE_URI" \
  --verify

# Deploy StorageVault
forge create StorageVault \
  --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY \
  --verify
```

## Metadata Setup (IPFS)

### Step 1: Create metadata.json

```json
{
  "name": "Base Builder Badge #{{id}}",
  "description": "Exclusive Builder Badge NFT minted on Base blockchain. Part of the WalletConnect + Base Builder Program.",
  "image": "ipfs://YOUR_IMAGE_CID",
  "attributes": [
    {
      "trait_type": "Program",
      "value": "WalletConnect Builder"
    },
    {
      "trait_type": "Chain",
      "value": "Base"
    },
    {
      "trait_type": "Year",
      "value": "2024"
    }
  ]
}
```

### Step 2: Upload to IPFS via Pinata

1. Go to https://pinata.cloud (free account)
2. Upload your NFT image (PNG/SVG)
   - Copy the CID (e.g., `QmXxx...`)
   - Update `metadata.json` image field to `ipfs://YOUR_IMAGE_CID`
3. Upload `metadata.json`
   - Copy the CID
   - Your baseURI is: `ipfs://YOUR_METADATA_CID/`
   - For numbered tokens, use: `ipfs://YOUR_FOLDER_CID/` where folder contains 0.json, 1.json, etc.

### Step 3: Update Frontend

In `.env.local`:
```bash
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0xYourDeployedAddress
NEXT_PUBLIC_CHAIN_ID=84532  # Base Sepolia
```

In `src/components/StorageVault.tsx`:
```typescript
const STORAGE_VAULT_ADDRESS = "0xYourStorageVaultAddress" as `0x${string}`;
```

## Testing

### Get Test ETH
```bash
# Base Sepolia Faucet
https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
```

### Interact with Contract

```bash
# Read total supply
cast call $CONTRACT_ADDRESS "totalSupply()" --rpc-url https://sepolia.base.org

# Mint NFT
cast send $CONTRACT_ADDRESS "safeMint(address)" $YOUR_ADDRESS \
  --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY
```

## Production Deployment (Base Mainnet)

1. Change RPC URL to `https://mainnet.base.org`
2. Update chain ID to `8453`
3. Update `.env.local`: `NEXT_PUBLIC_CHAIN_ID=8453`
4. Get real ETH on Base mainnet
5. Follow same deployment steps

## Troubleshooting

- **"Max supply reached"**: Contract has minted all 10,000 NFTs
- **"Mint limit reached"**: Wallet already minted 1 NFT (limit)
- **Gas estimation failed**: Check wallet has enough ETH
- **Wrong chain**: Make sure MetaMask is on Base Sepolia (84532)

## Contract Addresses (Update after deployment)

```
Base Sepolia Testnet:
- BaseNFTDrop: 0x...
- StorageVault: 0x...

Base Mainnet:
- BaseNFTDrop: 0x...
- StorageVault: 0x...
```
