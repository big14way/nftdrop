#!/bin/bash

# Base NFT Dropper - Setup Verification Script
# Run this to verify your environment is correctly configured

echo "🔍 Base NFT Dropper - Setup Verification"
echo "========================================"
echo ""

# Check Node.js version
echo "✓ Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "  Node.js: $NODE_VERSION"
if [[ ! "$NODE_VERSION" =~ ^v1[8-9]|^v2[0-9] ]]; then
  echo "  ⚠️  Warning: Node.js 18+ recommended"
fi
echo ""

# Check npm
echo "✓ Checking npm..."
NPM_VERSION=$(npm -v)
echo "  npm: v$NPM_VERSION"
echo ""

# Check if dependencies installed
echo "✓ Checking dependencies..."
if [ -d "node_modules" ]; then
  echo "  ✅ node_modules found"
else
  echo "  ❌ node_modules not found"
  echo "  Run: npm install"
fi
echo ""

# Check .env.local
echo "✓ Checking environment variables..."
if [ -f ".env.local" ]; then
  echo "  ✅ .env.local found"

  # Check WalletConnect Project ID
  if grep -q "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=1eebe528ca0ce94a99ceaa2e915058d7" .env.local; then
    echo "  ✅ WalletConnect Project ID configured"
  else
    echo "  ⚠️  WalletConnect Project ID may need updating"
  fi

  # Check contract address
  if grep -q "NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000" .env.local; then
    echo "  ⚠️  NFT Contract address not yet deployed"
    echo "     Deploy contracts and update .env.local"
  else
    echo "  ✅ NFT Contract address configured"
  fi

  # Check chain ID
  if grep -q "NEXT_PUBLIC_CHAIN_ID=84532" .env.local; then
    echo "  ✅ Chain ID set to Base Sepolia (testnet)"
  elif grep -q "NEXT_PUBLIC_CHAIN_ID=8453" .env.local; then
    echo "  ✅ Chain ID set to Base Mainnet"
  fi
else
  echo "  ❌ .env.local not found"
  echo "  Create .env.local with required variables"
fi
echo ""

# Check contract files
echo "✓ Checking contract files..."
if [ -f "contracts/BaseNFTDrop.sol" ]; then
  echo "  ✅ BaseNFTDrop.sol found"
else
  echo "  ❌ BaseNFTDrop.sol not found"
fi

if [ -f "contracts/StorageVault.sol" ]; then
  echo "  ✅ StorageVault.sol found"
else
  echo "  ❌ StorageVault.sol not found"
fi
echo ""

# Check component files
echo "✓ Checking component files..."
COMPONENTS=("Header.tsx" "NFTMinter.tsx" "StorageVault.tsx" "TipJar.tsx" "WalletStatus.tsx")
for component in "${COMPONENTS[@]}"; do
  if [ -f "src/components/$component" ]; then
    echo "  ✅ $component found"
  else
    echo "  ❌ $component not found"
  fi
done
echo ""

# Check config files
echo "✓ Checking config files..."
if [ -f "src/config/wagmi.ts" ]; then
  echo "  ✅ wagmi.ts found"
else
  echo "  ❌ wagmi.ts not found"
fi

if [ -f "src/config/contracts.ts" ]; then
  echo "  ✅ contracts.ts found"
else
  echo "  ❌ contracts.ts not found"
fi
echo ""

# Summary
echo "========================================"
echo "📊 Verification Summary"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. If node_modules missing: npm install"
echo "2. Deploy contracts (see contracts/deploy.md)"
echo "3. Update .env.local with contract addresses"
echo "4. Run: npm run dev"
echo "5. Visit: http://localhost:3000"
echo ""
echo "📖 Documentation:"
echo "  - Quick Start: QUICKSTART.md"
echo "  - Deployment: DEPLOYMENT.md"
echo "  - Full Docs: README.md"
echo ""
echo "✨ Happy building! 🚀"
