# ⚡ Quick Start Guide

Get your Base NFT Dropper running in **5 minutes**!

## Prerequisites
- Node.js 18+ installed
- MetaMask wallet
- Base Sepolia ETH ([get from faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet))

## Step 1: Install Dependencies (2 minutes)

```bash
cd base-nft-dropper
npm install
```

## Step 2: Deploy Contracts (2 minutes)

### Option A: Use Remix (Recommended)

1. Open https://remix.ethereum.org
2. Copy-paste `contracts/BaseNFTDrop.sol`
3. Compile (Solidity 0.8.20+)
4. Deploy to Base Sepolia:
   - Connect MetaMask
   - Constructor arg: `ipfs://bafkreiabcdefghijklmnopqrstuvwxyz/` (any IPFS URI)
   - Click Deploy
5. **Copy contract address** → Update `.env.local`:
   ```bash
   NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0xYourAddressHere
   ```

6. Repeat for `StorageVault.sol` → Update `src/components/StorageVault.tsx:10`

### Option B: Use Pre-Deployed Testnet Contract

For quick testing, use a pre-deployed contract:
```bash
# Already set in .env.local (will update after you deploy)
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
```

## Step 3: Run Development Server (30 seconds)

```bash
npm run dev
```

Open http://localhost:3000

## Step 4: Test Features (30 seconds)

1. **Connect Wallet** → Click "Connect" button
2. **Switch to Base Sepolia** → Approve in MetaMask
3. **Mint NFT** → Go to "NFT Minter" tab → Click "Mint"
4. **Check Status** → See transaction on Basescan

## 🎉 You're Done!

Your Base NFT Dropper is running locally.

## Next Steps

- **Deploy to Vercel**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Customize branding**: Edit `src/config/wagmi.ts`
- **Update metadata**: See `metadata/metadata-template.json`
- **Go to mainnet**: Change `NEXT_PUBLIC_CHAIN_ID=8453`

## Troubleshooting

### "WalletConnect Project ID not set"
✅ Already set: `1eebe528ca0ce94a99ceaa2e915058d7`

### "Contract not deployed"
✅ Deploy contracts following Step 2

### "Insufficient funds"
✅ Get test ETH: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

### "Transaction failed"
✅ Check you're on Base Sepolia (Chain ID: 84532)

## Project Structure

```
base-nft-dropper/
├── src/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   ├── config/           # Wagmi & contracts
│   └── providers/        # Web3 providers
├── contracts/            # Solidity contracts
├── metadata/             # NFT metadata
└── .env.local            # Environment variables
```

## Key Files to Edit

1. **Contract Address**: `.env.local`
2. **Creator Tip Address**: `src/components/TipJar.tsx:9`
3. **Storage Vault Address**: `src/components/StorageVault.tsx:10`
4. **Branding**: `src/config/wagmi.ts` metadata
5. **Theme Colors**: `tailwind.config.ts`

## Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Run production build
npm run lint         # Check code quality
npm run type-check   # TypeScript validation
```

## Support

- 📖 **Full Documentation**: [README.md](README.md)
- 🚀 **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- 🌟 **Features**: [FEATURES.md](FEATURES.md)
- 🐛 **Issues**: GitHub Issues

---

**Happy Building! 🎨⚡**
