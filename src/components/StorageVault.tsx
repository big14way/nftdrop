"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { toast } from "react-hot-toast";
import { targetChain } from "@/config/wagmi";
import { STORAGE_VAULT_ABI } from "@/config/contracts";
import { Loader2, Send, Database, ExternalLink } from "lucide-react";

// Note: Deploy StorageVault contract and update this address
const STORAGE_VAULT_ADDRESS = "0x6559B28fd6bEc8ff450D4f654841AADa273ac876" as `0x${string}`;

export function StorageVault() {
  const { address } = useAccount();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // Read stored messages
  const { data: storedMessages, refetch: refetchMessages } = useReadContract({
    address: STORAGE_VAULT_ADDRESS,
    abi: STORAGE_VAULT_ABI,
    functionName: "getMessages",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && STORAGE_VAULT_ADDRESS !== "0x0000000000000000000000000000000000000000",
    },
  });

  useEffect(() => {
    if (storedMessages) {
      setMessages(storedMessages as string[]);
    }
  }, [storedMessages]);

  // Write message
  const {
    writeContract,
    data: hash,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const handleStore = async () => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (message.length > 280) {
      toast.error("Message too long (max 280 characters)");
      return;
    }

    if (STORAGE_VAULT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      toast.error("Storage Vault contract not deployed yet");
      return;
    }

    try {
      writeContract({
        address: STORAGE_VAULT_ADDRESS,
        abi: STORAGE_VAULT_ABI,
        functionName: "storeMessage",
        args: [message],
        value: BigInt(0),
      });
    } catch (error: any) {
      console.error("Store error:", error);
      toast.error(error.message || "Failed to store message");
    }
  };

  useEffect(() => {
    if (writeError) {
      toast.error(writeError.message || "Transaction failed");
    }
  }, [writeError]);

  useEffect(() => {
    if (hash && isConfirming) {
      toast.loading("Storing message on-chain...", { id: hash });
    }
  }, [hash, isConfirming]);

  useEffect(() => {
    if (isConfirmed) {
      toast.dismiss(hash);
      toast.success("Message stored on-chain!");
      setMessage("");
      refetchMessages();
    }
  }, [isConfirmed, hash, refetchMessages]);

  const isContractDeployed = STORAGE_VAULT_ADDRESS !== "0x0000000000000000000000000000000000000000";

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Database className="w-8 h-8" />
          <h2 className="text-3xl font-bold">Storage Vault</h2>
        </div>
        <p className="text-purple-100">
          Store messages permanently on the Base blockchain
        </p>
      </div>

      {/* Content */}
      <div className="p-8">
        {!isContractDeployed && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-yellow-800 font-semibold">
              ⚠️ Storage Vault contract not deployed yet
            </p>
            <p className="text-yellow-700 text-sm mt-1">
              Deploy the StorageVault.sol contract and update the address in StorageVault.tsx
            </p>
          </div>
        )}

        {/* Store Message Form */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter a message to store on-chain forever..."
            maxLength={280}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-500">
              {message.length} / 280 characters
            </p>
            <button
              onClick={handleStore}
              disabled={!isContractDeployed || !message.trim() || isWritePending || isConfirming}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {(isWritePending || isConfirming) && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              {!isWritePending && !isConfirming && <Send className="w-4 h-4" />}
              {isWritePending && "Confirm in Wallet..."}
              {isConfirming && "Storing..."}
              {!isWritePending && !isConfirming && "Store Message"}
            </button>
          </div>
        </div>

        {/* Transaction Status */}
        {hash && (
          <div className="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                {isConfirmed ? "✓ Stored on-chain" : "Pending..."}
              </span>
              <a
                href={`${targetChain.blockExplorers.default.url}/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-1"
              >
                View
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* Stored Messages */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Your Stored Messages ({messages.length})
          </h3>
          {messages.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Database className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No messages stored yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Your messages will appear here once stored
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100"
                >
                  <p className="text-gray-800">{msg}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Message #{idx + 1}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
