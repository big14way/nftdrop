"use client";

import { useState } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { targetChain } from "@/config/wagmi";
import { NFTMinter } from "@/components/NFTMinter";
import { StorageVault } from "@/components/StorageVault";
import { TipJar } from "@/components/TipJar";
import { Header } from "@/components/Header";
import { WalletStatus } from "@/components/WalletStatus";
import { Wallet, Database, Gift } from "lucide-react";
import clsx from "clsx";

type Tab = "mint" | "storage" | "tips";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("mint");
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { open } = useAppKit();

  const isWrongChain = isConnected && chainId !== targetChain.id;

  const handleConnect = () => {
    open();
  };

  const handleSwitchChain = () => {
    if (switchChain) {
      switchChain({ chainId: targetChain.id });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Base NFT Dropper
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Mint exclusive Builder Badge NFTs on Base chain
          </p>
          <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-base-blue animate-pulse" />
              <span>Powered by WalletConnect AppKit</span>
            </div>
            <span>•</span>
            <span>Built on {targetChain.name}</span>
          </div>
        </div>

        {/* Wallet Status Card */}
        <WalletStatus />

        {/* Connection Required */}
        {!isConnected && (
          <div className="max-w-2xl mx-auto mt-8">
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <div className="w-20 h-20 bg-base-blue-light rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-10 h-10 text-base-blue" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-gray-600 mb-8">
                Connect your wallet to mint NFTs, store messages on-chain, and send tips to creators.
              </p>
              <button
                onClick={handleConnect}
                className="px-8 py-4 bg-base-blue hover:bg-base-blue-dark text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        )}

        {/* Wrong Chain Warning */}
        {isWrongChain && (
          <div className="max-w-2xl mx-auto mt-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
              <p className="text-yellow-800 font-semibold mb-4">
                Wrong Network Detected
              </p>
              <p className="text-yellow-700 mb-4">
                Please switch to {targetChain.name} to continue
              </p>
              <button
                onClick={handleSwitchChain}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors"
              >
                Switch to {targetChain.name}
              </button>
            </div>
          </div>
        )}

        {/* Main Content - Tabs */}
        {isConnected && !isWrongChain && (
          <div className="mt-8">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-white rounded-xl shadow-md p-1 border border-gray-200">
                <button
                  onClick={() => setActiveTab("mint")}
                  className={clsx(
                    "flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all",
                    activeTab === "mint"
                      ? "bg-base-blue text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  <Wallet className="w-5 h-5" />
                  NFT Minter
                </button>
                <button
                  onClick={() => setActiveTab("storage")}
                  className={clsx(
                    "flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all",
                    activeTab === "storage"
                      ? "bg-base-blue text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  <Database className="w-5 h-5" />
                  Storage Vault
                </button>
                <button
                  onClick={() => setActiveTab("tips")}
                  className={clsx(
                    "flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all",
                    activeTab === "tips"
                      ? "bg-base-blue text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  <Gift className="w-5 h-5" />
                  Tip Jar
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-4xl mx-auto">
              {activeTab === "mint" && <NFTMinter />}
              {activeTab === "storage" && <StorageVault />}
              {activeTab === "tips" && <TipJar />}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>
            Built for the WalletConnect + Base Builder Program
          </p>
          <p className="mt-2">
            Deep integration with AppKit • Wagmi • Viem • React Query
          </p>
        </footer>
      </main>
    </div>
  );
}
