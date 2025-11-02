import type { Metadata } from "next";
import { Web3Provider } from "@/providers/Web3Provider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Base NFT Dropper | WalletConnect Builder Program",
  description:
    "Mint exclusive Builder Badge NFTs on Base chain. Deep WalletConnect integration with AppKit, storage vault, and creator tips.",
  keywords: ["Base", "NFT", "WalletConnect", "Web3", "Builder Badge", "Ethereum", "dApp"],
  authors: [{ name: "Base Builder" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Base NFT Dropper",
    description: "Mint Builder Badge NFTs on Base with WalletConnect",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Web3Provider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: "#fff",
                color: "#363636",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              },
              success: {
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
