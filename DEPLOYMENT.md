# 🚀 Complete Deployment Guide

## Step-by-Step Deployment to Production

### Phase 1: Prepare Metadata (5-10 minutes)

#### 1.1 Create NFT Image
Use the provided `metadata/sample-image.svg` or create your own 800x800px image.

**Recommended:**
- PNG or SVG format
- 800x800px minimum
- Optimized file size (<1MB)
- Visually represents "Base Builder Badge"

#### 1.2 Upload to Pinata

1. **Sign up:** https://pinata.cloud (free tier: 1GB storage)
2. **Upload image:**
   - Click "Upload" → Select file
   - Pin to IPFS
   - Copy CID (e.g., `QmX5H...`)
   - Full URI: `ipfs://QmX5H.../image.svg`

3. **Update metadata template:**
   - Edit `metadata/metadata-template.json`
   - Replace `"image": "ipfs://QmYourImageCIDHere"`
   - With your image CID

4. **Upload metadata:**
   - Create folder with numbered JSON files:
     ```
     metadata/
     ├── 0.json
     ├── 1.json
     ├── 2.json
     └── ...
     ```
   - Or upload single template (all tokens use same metadata)
   - Upload folder to Pinata
   - Copy folder CID: `QmABC...`
   - **Base URI:** `ipfs://QmABC.../`

**✅ Checkpoint:** You should have `ipfs://YOUR_CID/` ready for contract deployment.

---

### Phase 2: Deploy Smart Contracts (10-15 minutes)

#### 2.1 Get Base Sepolia ETH (Testnet)

**Faucets:**
- Coinbase: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
- Alchemy: https://www.alchemy.com/faucets/base-sepolia
- QuickNode: https://faucet.quicknode.com/base/sepolia

**Need:** ~0.01 ETH for deployment + testing

#### 2.2 Deploy with Remix (Recommended for beginners)

**BaseNFTDrop.sol:**
1. Open https://remix.ethereum.org
2. Create new file: `BaseNFTDrop.sol`
3. Paste contract code from `contracts/BaseNFTDrop.sol`
4. Compiler settings:
   - Version: 0.8.20 or higher
   - EVM: Paris or later
   - Optimization: 200 runs
5. Compile (should auto-resolve OpenZeppelin imports)
6. Deploy tab:
   - Environment: **Injected Provider - MetaMask**
   - Connect wallet
   - Switch to **Base Sepolia** (Chain ID: 84532)
   - Constructor parameters:
     - `baseURI`: `ipfs://YOUR_CID/`
   - Click **Deploy**
   - Confirm in MetaMask
7. **Copy deployed address:** `0xABC123...`

**StorageVault.sol:**
1. Create new file: `StorageVault.sol`
2. Paste contract code from `contracts/StorageVault.sol`
3. Compile (Solidity 0.8.20+)
4. Deploy (no constructor args)
5. **Copy deployed address:** `0xDEF456...`

#### 2.3 Verify Contracts on Basescan

**Why verify?** Allows users to read contract code, builds trust.

1. Go to https://sepolia.basescan.org
2. Search your contract address
3. Click "Contract" tab → "Verify and Publish"
4. Fill in:
   - Compiler: v0.8.20+
   - License: MIT
   - Optimization: Yes (200 runs)
5. Flatten source:
   ```bash
   # In Remix: Right-click contract → "Flatten"
   # Or use forge:
   forge flatten contracts/BaseNFTDrop.sol > flattened.sol
   ```
6. Paste flattened code
7. Constructor args (ABI-encoded):
   - For BaseNFTDrop: Encode `ipfs://YOUR_CID/`
   - Use Remix's "Encode Constructor Args" or https://abi.hashex.org
8. Submit verification

**✅ Checkpoint:** Both contracts verified on Basescan.

---

### Phase 3: Configure Frontend (5 minutes)

#### 3.1 Update Environment Variables

Edit `.env.local`:
```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=1eebe528ca0ce94a99ceaa2e915058d7
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0xYourBaseNFTDropAddress
NEXT_PUBLIC_CHAIN_ID=84532  # Base Sepolia
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
```

#### 3.2 Update Contract Addresses in Code

**StorageVault:** `src/components/StorageVault.tsx` line 10
```typescript
const STORAGE_VAULT_ADDRESS = "0xYourStorageVaultAddress" as `0x${string}`;
```

**Tip Jar (optional):** `src/components/TipJar.tsx` line 9
```typescript
const CREATOR_ADDRESS = "0xYourEthereumAddress" as `0x${string}`;
```

#### 3.3 Test Locally

```bash
npm install
npm run dev
```

1. Open http://localhost:3000
2. Connect MetaMask (Base Sepolia)
3. Mint NFT → Should succeed
4. Check balance updates
5. Store message → Should succeed
6. Send tip → Should succeed

**✅ Checkpoint:** All features working locally.

---

### Phase 4: Deploy to Vercel (5 minutes)

#### 4.1 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Base NFT Dropper"
git branch -M main
git remote add origin https://github.com/yourusername/base-nft-dropper.git
git push -u origin main
```

#### 4.2 Import to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repo
4. Configure:
   - Framework: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

#### 4.3 Add Environment Variables

In Vercel project settings → Environment Variables:

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=1eebe528ca0ce94a99ceaa2e915058d7
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0xYourBaseNFTDropAddress
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
```

#### 4.4 Deploy

Click **Deploy** → Wait 2-3 minutes

**✅ Live URL:** `https://your-project.vercel.app`

---

### Phase 5: Test Production (10 minutes)

#### 5.1 Functional Testing

Visit your live URL:

- [ ] **Landing page loads**
- [ ] **Connect wallet** → MetaMask popup
- [ ] **Wrong chain prompt** → If not on Base Sepolia
- [ ] **Switch chain** → Auto-switches to Base Sepolia
- [ ] **Wallet status** → Shows address, balance, network
- [ ] **Mint NFT:**
  - [ ] Button enabled
  - [ ] Click → MetaMask confirmation
  - [ ] Transaction pending state
  - [ ] Success toast with Basescan link
  - [ ] Balance updates (Your NFTs: 1)
  - [ ] Total supply increments
  - [ ] Token ID displayed
- [ ] **Mint limit:**
  - [ ] Try second mint → Error message
- [ ] **Storage Vault:**
  - [ ] Enter message
  - [ ] Store → Confirm in MetaMask
  - [ ] Message appears in list
- [ ] **Tip Jar:**
  - [ ] Select amount
  - [ ] Send → Confirm
  - [ ] Success message

#### 5.2 Mobile Testing

Test on mobile (Chrome/Safari):
- [ ] Connect via WalletConnect QR code
- [ ] All tabs responsive
- [ ] Buttons accessible
- [ ] No layout issues

#### 5.3 Edge Cases

- [ ] **Disconnect wallet** → Shows connect prompt
- [ ] **Insufficient balance** → Clear error
- [ ] **Refresh page** → Wallet reconnects (cookie storage)
- [ ] **Multiple wallets** → Can switch accounts

**✅ Checkpoint:** All tests passing.

---

### Phase 6: Production (Base Mainnet) - Optional

⚠️ **Only after thorough testnet testing!**

#### 6.1 Deploy Contracts to Base Mainnet

1. Get real ETH on Base:
   - Bridge from Ethereum mainnet: https://bridge.base.org
   - Buy on exchange (Coinbase)
2. Change RPC URL to `https://mainnet.base.org`
3. Deploy same contracts with same baseURI
4. Verify on https://basescan.org

#### 6.2 Update Frontend

```bash
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0xMainnetAddress
NEXT_PUBLIC_CHAIN_ID=8453  # Base Mainnet
```

Redeploy to Vercel.

---

## 📊 Post-Deployment Checklist

### Documentation
- [ ] Update README with live URLs
- [ ] Add contract addresses to README
- [ ] Create demo GIF/video
- [ ] Write Medium/X post

### Monitoring
- [ ] Set up Tenderly alerts
- [ ] Monitor contract events
- [ ] Track gas costs
- [ ] Watch for errors in Vercel logs

### Security
- [ ] Audit contracts (if mainnet)
- [ ] Rate limit sensitive endpoints
- [ ] Monitor for unusual activity
- [ ] Set up multi-sig for contract ownership

### Marketing
- [ ] Tweet launch announcement
- [ ] Submit to WalletConnect Builder Program
- [ ] Share in Base Discord
- [ ] Post on Farcaster/Lens

---

## 🐛 Troubleshooting

### Contract Deployment Issues

**Error: "Insufficient funds"**
- Solution: Get more ETH from faucet

**Error: "Max supply reached"**
- Solution: Increase MAX_SUPPLY in contract or deploy new instance

**OpenZeppelin imports not found (Remix)**
- Solution: Imports auto-resolve. If not, use GitHub imports:
  ```solidity
  import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.0/contracts/token/ERC721/ERC721.sol";
  ```

### Frontend Issues

**"WalletConnect Project ID not set"**
- Solution: Check `.env.local` exists and has correct var name

**"Contract not deployed"**
- Solution: Update contract addresses in code

**Wallet connects but wrong chain**
- Solution: Click "Switch to Base Sepolia" button or manually switch in MetaMask

**Transaction fails with "gas estimation failed"**
- Solution:
  - Check wallet has enough ETH
  - Verify contract address is correct
  - Check mint limit not reached

**IPFS images not loading**
- Solution:
  - Use public gateway: `https://gateway.pinata.cloud/ipfs/`
  - Verify CID is correct
  - Check file is pinned on Pinata

### Vercel Deployment

**Build fails**
- Check Node.js version (18+)
- Run `npm run build` locally first
- Check environment variables set

**App loads but features broken**
- Verify all env vars in Vercel dashboard
- Check browser console for errors
- Verify contract addresses

---

## 📞 Support Resources

- **Base Discord:** https://discord.gg/base
- **WalletConnect Discord:** https://discord.com/invite/walletconnect
- **GitHub Issues:** Report bugs in your repo
- **Remix Support:** https://remix.ethereum.org

---

## ✅ Final Verification

Before submitting to WalletConnect Builder Program:

- [ ] Contracts deployed & verified
- [ ] Frontend live on Vercel
- [ ] All features working
- [ ] Mobile responsive
- [ ] README complete
- [ ] Demo video/GIF created
- [ ] Code well-commented
- [ ] Tests passing
- [ ] Security best practices followed
- [ ] Analytics enabled (AppKit)

**🎉 Congratulations! Your Base NFT Dropper is live!**
