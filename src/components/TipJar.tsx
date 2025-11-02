"use client";

import { useState, useEffect } from "react";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt, useBalance } from "wagmi";
import { parseEther } from "viem";
import { toast } from "react-hot-toast";
import { targetChain } from "@/config/wagmi";
import { Loader2, Gift, Heart, ExternalLink } from "lucide-react";

// Creator address (change to your address or make it configurable)
const CREATOR_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" as `0x${string}`;

const PRESET_AMOUNTS = [
  { label: "Coffee", value: "0.001" },
  { label: "Lunch", value: "0.005" },
  { label: "Generous", value: "0.01" },
];

export function TipJar() {
  const { address } = useAccount();
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");

  const { data: balance } = useBalance({ address });

  const {
    sendTransaction,
    data: hash,
    isPending: isSendPending,
    error: sendError,
  } = useSendTransaction();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSendTip = async () => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    const finalAmount = amount || customAmount;

    if (!finalAmount || parseFloat(finalAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      const value = parseEther(finalAmount);

      // Check balance
      if (balance && value > balance.value) {
        toast.error("Insufficient balance");
        return;
      }

      sendTransaction({
        to: CREATOR_ADDRESS,
        value,
      });
    } catch (error) {
      console.error("Send error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to send tip";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (sendError) {
      toast.error(sendError.message || "Transaction failed");
    }
  }, [sendError]);

  useEffect(() => {
    if (hash && isConfirming) {
      toast.loading("Sending tip...", { id: hash });
    }
  }, [hash, isConfirming]);

  useEffect(() => {
    if (isConfirmed) {
      toast.dismiss(hash);
      toast.success("Tip sent successfully! Thank you! 💙");
      setAmount("");
      setCustomAmount("");
    }
  }, [isConfirmed, hash]);

  const selectedAmount = amount || customAmount;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Gift className="w-8 h-8" />
          <h2 className="text-3xl font-bold">Tip Jar</h2>
        </div>
        <p className="text-pink-100">
          Support the creator with ETH on Base
        </p>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Creator Info */}
        <div className="mb-8 p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Base Builder</p>
              <p className="text-sm text-gray-600">Creator of Base NFT Dropper</p>
            </div>
          </div>
          <p className="text-xs font-mono text-gray-500 break-all">
            {CREATOR_ADDRESS}
          </p>
        </div>

        {/* Preset Amounts */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Quick Amount
          </label>
          <div className="grid grid-cols-3 gap-3">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => {
                  setAmount(preset.value);
                  setCustomAmount("");
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  amount === preset.value
                    ? "border-pink-600 bg-pink-50"
                    : "border-gray-200 hover:border-pink-300"
                }`}
              >
                <p className="font-semibold text-gray-900">{preset.label}</p>
                <p className="text-sm text-gray-600">{preset.value} ETH</p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Custom Amount (ETH)
          </label>
          <input
            type="number"
            step="0.001"
            min="0"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setAmount("");
            }}
            placeholder="0.001"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        {/* Balance Display */}
        {balance && (
          <div className="mb-6 text-sm text-gray-600">
            Your balance: {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
          </div>
        )}

        {/* Send Button */}
        <button
          onClick={handleSendTip}
          disabled={!selectedAmount || isSendPending || isConfirming}
          className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold rounded-xl transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          {(isSendPending || isConfirming) && (
            <Loader2 className="w-5 h-5 animate-spin" />
          )}
          {!isSendPending && !isConfirming && <Heart className="w-5 h-5" />}
          {isSendPending && "Confirm in Wallet..."}
          {isConfirming && "Sending..."}
          {!isSendPending && !isConfirming && `Send ${selectedAmount || "0"} ETH`}
        </button>

        {/* Transaction Status */}
        {hash && (
          <div className="mt-6 p-4 bg-pink-50 rounded-xl border border-pink-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                {isConfirmed ? "✓ Tip sent!" : "Pending..."}
              </span>
              <a
                href={`${targetChain.blockExplorers.default.url}/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-700 font-semibold text-sm flex items-center gap-1"
              >
                View
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            {isConfirmed && (
              <p className="text-sm text-gray-600 mt-2">
                Thank you for your support! 💙
              </p>
            )}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-sm text-blue-900">
            <strong>💡 Tip:</strong> All transactions are processed on {targetChain.name} with low fees and fast confirmation times.
          </p>
        </div>
      </div>
    </div>
  );
}
