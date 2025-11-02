"use client";

import { useAccount, useBalance, useChainId } from "wagmi";
import { targetChain } from "@/config/wagmi";
import { CheckCircle2, XCircle } from "lucide-react";

export function WalletStatus() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });

  if (!isConnected) return null;

  const isCorrectChain = chainId === targetChain.id;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Connected Address</p>
            <p className="font-mono text-sm text-gray-900 break-all">
              {address}
            </p>
          </div>
          {isCorrectChain ? (
            <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-sm text-gray-500 mb-1">Network</p>
            <p className="font-semibold text-gray-900">
              {isCorrectChain ? targetChain.name : "Wrong Network"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Balance</p>
            <p className="font-semibold text-gray-900">
              {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : "0 ETH"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
