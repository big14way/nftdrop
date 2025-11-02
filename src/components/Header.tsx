"use client";

import { useAppKit } from "@reown/appkit/react";
import { useAccount } from "wagmi";
import { Wallet } from "lucide-react";

export function Header() {
  const { open } = useAppKit();
  const { isConnected } = useAccount();

  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-base-blue rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">Base NFT Dropper</h1>
            <p className="text-xs text-gray-500">WalletConnect Builder</p>
          </div>
        </div>

        <button
          onClick={() => open()}
          className="flex items-center gap-2 px-5 py-2.5 bg-base-blue hover:bg-base-blue-dark text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          <Wallet className="w-4 h-4" />
          {isConnected ? "Wallet" : "Connect"}
        </button>
      </div>
    </header>
  );
}
