# 🚀 Base NFT Dropper

**Production-ready dApp for the WalletConnect + Base Builder Program**

A full-stack Web3 application showcasing deep WalletConnect AppKit integration on Base chain. Mint exclusive Builder Badge NFTs, store messages on-chain, and send tips to creators—all with seamless wallet onboarding and robust error handling.

![Base NFT Dropper](https://img.shields.io/badge/Base-0052FF?style=for-the-badge&logo=ethereum&logoColor=white)
![WalletConnect](https://img.shields.io/badge/WalletConnect-3B99FC?style=for-the-badge&logo=walletconnect&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

## ✨ Features

### 🎨 NFT Minter
- **Free mint** Builder Badge NFTs on Base
- **Smart limits**: 1 NFT per wallet, configurable max supply
- **Real-time updates**: Live supply tracking with polling
- **Transaction tracking**: Full tx lifecycle with Basescan links
- **Event parsing**: Extract token IDs from mint events
- **IPFS metadata**: Decentralized storage via Pinata

### 💾 Storage Vault
- **On-chain messages**: Store up to 280 characters permanently
- **Per-wallet storage**: View all your stored messages
- **Gas optimized**: Efficient string storage
- **Event emission**: Track all storage events

### 💝 Tip Jar
- **Direct tips**: Send ETH to creator address
- **Quick amounts**: Coffee, Lunch, Generous presets
- **Custom amounts**: Flexible tip values
- **Balance checks**: Prevent insufficient funds errors

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** (Responsive design)
- **@reown/appkit** + **@reown/appkit-adapter-wagmi** (WalletConnect)
- **Wagmi 2.x** (Contract interactions)
- **Viem** (Ethereum utilities)
- **TanStack Query** (State management & caching)
- **react-hot-toast** (Notifications)
- **lucide-react** (Icons)

**Smart Contracts:**
- **Solidity 0.8.20+**
- **OpenZeppelin** (ERC721, Ownable)
- **Base Sepolia** testnet (84532) or **Base Mainnet** (8453)

**Infrastructure:**
- **Vercel** (Frontend hosting)
- **Pinata/IPFS** (NFT metadata)
- **Basescan** (Contract verification)

### Project Structure

```
base-nft-dropper/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with Web3Provider
│   │   ├── page.tsx             # Main page with tabs
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── Header.tsx           # App header with connect button
│   │   ├── WalletStatus.tsx     # Wallet info display
│   │   ├── NFTMinter.tsx        # NFT minting interface
│   │   ├── StorageVault.tsx     # Message storage UI
│   │   └── TipJar.tsx           # Tipping interface
│   ├── config/
│   │   ├── wagmi.ts             # Wagmi & AppKit config
│   │   └── contracts.ts         # Contract ABIs
│   └── providers/
│       └── Web3Provider.tsx     # Wagmi + AppKit providers
├── contracts/
│   ├── BaseNFTDrop.sol          # ERC721 NFT contract
│   ├── StorageVault.sol         # Message storage contract
│   └── deploy.md                # Deployment guide
├── metadata/
│   ├── metadata-template.json   # NFT metadata template
│   └── sample-image.svg         # Sample badge image
├── .env.local                   # Environment variables
├── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and **npm/yarn/pnpm**
- **MetaMask** or any Web3 wallet
- **Base Sepolia ETH** from [faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)

### 1. Clone & Install

```bash
cd base-nft-dropper
npm install
```

### 2. Configure Environment

Your `.env.local` is already set with the Project ID:

```bash
# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=1eebe528ca0ce94a99ceaa2e915058d7

# Contract Address (update after deployment)
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# Chain ID (84532 = Base Sepolia, 8453 = Base Mainnet)
NEXT_PUBLIC_CHAIN_ID=84532

# IPFS Gateway
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
```

### 3. Deploy Smart Contracts

#### Option A: Remix (Easiest)

1. Go to [Remix IDE](https://remix.ethereum.org)
2. Copy `contracts/BaseNFTDrop.sol`
3. Install OpenZeppelin imports (auto-resolved)
4. Compile with Solidity 0.8.20+
5. Deploy to Base Sepolia:
   - Environment: Injected Provider (MetaMask)
   - Network: Base Sepolia (Chain ID 84532)
   - Constructor: `baseURI` = `ipfs://YOUR_CID/`
6. Copy deployed address
7. Repeat for `StorageVault.sol` (no constructor args)

#### Option B: Foundry

```bash
cd contracts
forge init --force
forge install OpenZeppelin/openzeppelin-contracts

# Deploy BaseNFTDrop
forge create BaseNFTDrop \
  --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY \
  --constructor-args "ipfs://YOUR_CID/" \
  --verify

# Deploy StorageVault
forge create StorageVault \
  --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY \
  --verify
```

**📖 Full deployment guide:** [contracts/deploy.md](contracts/deploy.md)

### 4. Upload NFT Metadata to IPFS

1. Sign up at [Pinata.cloud](https://pinata.cloud) (free)
2. Upload `metadata/sample-image.svg` (or your custom image)
   - Copy CID: `QmXXX...`
3. Update `metadata/metadata-template.json`:
   - Replace `"image": "ipfs://QmYourImageCIDHere"` with your CID
4. Upload `metadata-template.json` to Pinata
   - Copy folder CID
5. Update contract constructor with `ipfs://YOUR_METADATA_CID/`

### 5. Update Frontend Config

In `.env.local`:
```bash
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0xYourDeployedAddress
```

In `src/components/StorageVault.tsx` line 10:
```typescript
const STORAGE_VAULT_ADDRESS = "0xYourStorageVaultAddress" as `0x${string}`;
```

In `src/components/TipJar.tsx` line 9 (optional, change to your address):
```typescript
const CREATOR_ADDRESS = "0xYourAddress" as `0x${string}`;
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 7. Test the dApp

1. **Connect Wallet**: Click "Connect" → Select MetaMask
2. **Switch to Base Sepolia**: App auto-prompts if wrong chain
3. **Mint NFT**: Navigate to "NFT Minter" tab → Click "Mint Builder Badge"
4. **Store Message**: Go to "Storage Vault" → Enter message → Store
5. **Send Tip**: Go to "Tip Jar" → Select amount → Send

## 🎯 Deep WalletConnect Integration

This dApp demonstrates **leaderboard-worthy** integration:

### ✅ AppKit Features
- ✨ **Modal UI**: Full AppKit modal with multi-wallet support
- 🔄 **Auto-switching**: Seamless chain switching to Base
- 🍪 **Session persistence**: Cookie storage for reconnections
- 🎨 **Custom theming**: Base blue branding
- 📊 **Analytics**: Enabled for tracking

### ✅ Wagmi Hooks
- `useAccount` - Wallet address & connection status
- `useChainId` - Active chain detection
- `useSwitchChain` - Chain switching
- `useBalance` - Native balance queries
- `useReadContract` - Contract state reads (totalSupply, balanceOf, etc.)
- `useWriteContract` - Contract writes (mint, store)
- `useWaitForTransactionReceipt` - Transaction confirmation
- `useSendTransaction` - ETH transfers (tips)
- `usePublicClient` - Event log parsing

### ✅ Error Handling
- ❌ Wrong chain detection → Auto-prompt to switch
- ❌ Insufficient balance → Warning before tx
- ❌ Mint limit reached → Clear error message
- ❌ Transaction failures → User-friendly toasts
- ❌ Network offline → Connection status indicators

### ✅ UX Excellence
- ⏳ Loading states on all async actions
- ✅ Success toasts with tx links
- 🔗 Basescan integration for transparency
- 📱 Responsive mobile design
- ⚡ Optimistic UI updates
- 🔄 Real-time data polling (10s intervals)

## 📦 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables:
   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=1eebe528ca0ce94a99ceaa2e915058d7
   NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0xYourAddress
   NEXT_PUBLIC_CHAIN_ID=84532
   NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
   ```
4. Deploy!

### Custom Hosting

```bash
npm run build
npm run start
```

## 🧪 Testing

### Get Test ETH
- [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
- [Alchemy Faucet](https://www.alchemy.com/faucets/base-sepolia)

### Test Checklist
- [ ] Connect MetaMask
- [ ] Switch to Base Sepolia
- [ ] Mint NFT (check balance updates)
- [ ] View transaction on Basescan
- [ ] Try minting second NFT (should fail with limit error)
- [ ] Store message on-chain
- [ ] View stored messages
- [ ] Send tip (0.001 ETH)
- [ ] Disconnect and reconnect (session persistence)

## 🛠️ Development

### Key Files to Customize

**Contract addresses:**
- `.env.local` - NFT contract
- `src/components/StorageVault.tsx:10` - Vault contract
- `src/components/TipJar.tsx:9` - Creator address

**Branding:**
- `src/config/wagmi.ts` - Metadata (name, description, icon)
- `src/app/globals.css` - Colors and animations
- `tailwind.config.ts` - Theme colors

**Contract limits:**
- `contracts/BaseNFTDrop.sol:16-17` - MAX_SUPPLY, MINT_LIMIT
- `contracts/StorageVault.sol:26` - Message length limit

### Useful Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Run production build
npm run lint         # Lint code
npm run type-check   # TypeScript checks
```

## 🔐 Security Best Practices

✅ **Implemented:**
- Input validation (message length, amount checks)
- Mint limits per wallet (contract-level)
- Reentrancy protection (OpenZeppelin standards)
- Max supply enforcement
- Balance checks before transactions
- Proper error handling & user feedback

⚠️ **Production Checklist:**
- [ ] Audit smart contracts (Slither, Mythril)
- [ ] Test on testnet thoroughly
- [ ] Verify contracts on Basescan
- [ ] Set up monitoring (Tenderly, Defender)
- [ ] Rate limit frontend API calls
- [ ] Implement proper access control

## 🤝 Contributing

This project is built for the **WalletConnect + Base Builder Program**. Feel free to:
- Report bugs via GitHub Issues
- Submit PRs for improvements
- Fork for your own projects
- Star ⭐ if you find it useful!

## 📄 License

MIT License - see LICENSE file

## 🔗 Links

- **Base Chain**: https://base.org
- **WalletConnect**: https://walletconnect.com
- **AppKit Docs**: https://docs.reown.com/appkit/overview
- **Wagmi Docs**: https://wagmi.sh
- **Base Faucet**: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
- **Basescan**: https://basescan.org

## 💬 Support

Questions? Reach out:
- GitHub Issues
- WalletConnect Discord
- Base Discord

---

**Built with ❤️ for the WalletConnect + Base Builder Program**

*Showcasing deep AppKit integration, robust error handling, and production-ready Web3 UX*
