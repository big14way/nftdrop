"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from "wagmi";
import { toast } from "react-hot-toast";
import { NFT_CONTRACT_ADDRESS, targetChain } from "@/config/wagmi";
import { BASE_NFT_DROP_ABI } from "@/config/contracts";
import { Loader2, CheckCircle2, ExternalLink, Image as ImageIcon } from "lucide-react";
import { parseEventLogs } from "viem";

export function NFTMinter() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [mintedTokenId, setMintedTokenId] = useState<bigint | null>(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

  // Read contract data
  const { data: totalSupply, refetch: refetchSupply } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: BASE_NFT_DROP_ABI,
    functionName: "totalSupply",
    query: {
      refetchInterval: 10000, // Poll every 10s
    },
  });

  const { data: userBalance, refetch: refetchBalance } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: BASE_NFT_DROP_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 10000,
    },
  });

  const { data: maxSupply } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: BASE_NFT_DROP_ABI,
    functionName: "MAX_SUPPLY",
  });

  const { data: mintLimit } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: BASE_NFT_DROP_ABI,
    functionName: "MINT_LIMIT_PER_WALLET",
  });

  const { data: userMintCount } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: BASE_NFT_DROP_ABI,
    functionName: "mintCount",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Write contract
  const {
    writeContract,
    data: hash,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle mint
  const handleMint = async () => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    // Check limits
    if (userMintCount !== undefined && mintLimit !== undefined) {
      if (userMintCount >= mintLimit) {
        toast.error(`Mint limit reached (${mintLimit} per wallet)`);
        return;
      }
    }

    if (totalSupply !== undefined && maxSupply !== undefined) {
      if (totalSupply >= maxSupply) {
        toast.error("Max supply reached!");
        return;
      }
    }

    try {
      writeContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: BASE_NFT_DROP_ABI,
        functionName: "safeMint",
        args: [address],
        value: BigInt(0), // Free mint
      });
    } catch (error: any) {
      console.error("Mint error:", error);
      toast.error(error.message || "Failed to mint NFT");
    }
  };

  // Handle transaction status
  useEffect(() => {
    if (writeError) {
      toast.error(writeError.message || "Transaction failed");
    }
  }, [writeError]);

  useEffect(() => {
    if (hash && isConfirming) {
      toast.loading("Confirming transaction...", { id: hash });
    }
  }, [hash, isConfirming]);

  useEffect(() => {
    if (isConfirmed && receipt) {
      toast.dismiss(hash);
      toast.success("NFT minted successfully!");

      // Extract token ID from event logs
      const logs = parseEventLogs({
        abi: BASE_NFT_DROP_ABI,
        logs: receipt.logs,
        eventName: "NFTMinted",
      });

      if (logs.length > 0) {
        const tokenId = logs[0].args.tokenId;
        setMintedTokenId(tokenId);
      }

      // Refetch balances
      refetchSupply();
      refetchBalance();
    }
  }, [isConfirmed, receipt, hash, refetchSupply, refetchBalance]);

  const canMint = userMintCount !== undefined && mintLimit !== undefined && userMintCount < mintLimit;
  const progress = maxSupply ? Number((totalSupply || BigInt(0)) * BigInt(100) / maxSupply) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-base-blue to-indigo-600 p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Builder Badge NFT</h2>
        <p className="text-blue-100">
          Mint your exclusive Base Builder Badge
        </p>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-1">Total Minted</p>
            <p className="text-2xl font-bold text-gray-900">
              {totalSupply?.toString() || "0"}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-1">Max Supply</p>
            <p className="text-2xl font-bold text-gray-900">
              {maxSupply?.toString() || "∞"}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-1">Your NFTs</p>
            <p className="text-2xl font-bold text-gray-900">
              {userBalance?.toString() || "0"}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {maxSupply && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Minting Progress</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-base-blue to-indigo-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Mint Button */}
        <button
          onClick={handleMint}
          disabled={!canMint || isWritePending || isConfirming}
          className="w-full py-4 bg-base-blue hover:bg-base-blue-dark text-white font-bold rounded-xl transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          {(isWritePending || isConfirming) && (
            <Loader2 className="w-5 h-5 animate-spin" />
          )}
          {isWritePending && "Confirm in Wallet..."}
          {isConfirming && "Minting..."}
          {!isWritePending && !isConfirming && (canMint ? "Mint Builder Badge (Free)" : "Mint Limit Reached")}
        </button>

        {/* Mint info */}
        {userMintCount !== undefined && mintLimit !== undefined && (
          <p className="text-center text-sm text-gray-500 mt-4">
            You've minted {userMintCount.toString()} / {mintLimit.toString()} NFTs
          </p>
        )}

        {/* Transaction Hash */}
        {hash && (
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isConfirmed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                )}
                <span className="text-sm font-semibold text-gray-700">
                  {isConfirmed ? "Transaction Confirmed" : "Transaction Pending"}
                </span>
              </div>
              <a
                href={`${targetChain.blockExplorers.default.url}/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base-blue hover:text-base-blue-dark font-semibold text-sm flex items-center gap-1"
              >
                View on Explorer
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-2 font-mono break-all">
              {hash}
            </p>
          </div>
        )}

        {/* Minted NFT Preview */}
        {isConfirmed && mintedTokenId !== null && (
          <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <ImageIcon className="w-6 h-6 text-green-600" />
              <h3 className="font-bold text-lg text-gray-900">
                Congratulations! 🎉
              </h3>
            </div>
            <p className="text-gray-700 mb-2">
              You've successfully minted Builder Badge #{mintedTokenId.toString()}
            </p>
            <p className="text-sm text-gray-600">
              Your NFT is now stored on the {targetChain.name} blockchain.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
