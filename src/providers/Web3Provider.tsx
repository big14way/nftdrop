"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { config, metadata, projectId, targetChain } from "@/config/wagmi";

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 30000,
    },
  },
});

// Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks: [targetChain],
  projectId,
  ssr: true,
});

// Create AppKit instance
createAppKit({
  adapters: [wagmiAdapter],
  networks: [targetChain],
  projectId,
  metadata,
  features: {
    analytics: true,
    email: false,
    socials: [],
    onramp: false,
  },
  themeMode: "light",
  themeVariables: {
    "--w3m-accent": "#0052FF",
    "--w3m-border-radius-master": "2px",
  },
});

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
