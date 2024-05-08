"use client";

import { useEffect, useState } from "react";
import { Inter as FontSans } from "next/font/google";
import { Layout } from "./kyklos/templates/layout";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { WagmiProvider } from "wagmi";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { ProgressBar } from "~~/components/scaffold-eth/ProgressBar";
import { useNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { cn } from "~~/utils/utils";

export const ScaffoldEthAppLayout = ({ children }: { children: React.ReactNode }) => {
  const price = useNativeCurrencyPrice();
  const setNativeCurrencyPrice = useGlobalState(state => state.setNativeCurrencyPrice);

  useEffect(() => {
    if (price > 0) {
      setNativeCurrencyPrice(price);
    }
  }, [setNativeCurrencyPrice, price]);

  return (
    <>
      <div className="flex flex-col min-h-screen bg-[oklch(var(--b2))]">
        <Header />
        <main className={"relative flex flex-col flex-1"}>{children}</main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const KyklosLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className={cn("relative", fontSans.variable)}>
        <Layout>{children}</Layout>
      </main>
    </>
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const AppLayoutWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isDarkMode = resolvedTheme === "dark";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const subgraphUri = "http://localhost:8000/subgraphs/name/kyklos";
  const apolloClient = new ApolloClient({
    uri: subgraphUri,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={apolloClient}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <ProgressBar />
          <RainbowKitProvider avatar={BlockieAvatar} theme={lightTheme()}>
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ApolloProvider>
  );
};
