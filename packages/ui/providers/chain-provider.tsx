"use client";

import { createClient, PolkadotClient, CompatibilityToken } from "polkadot-api";
import {
  getWsProvider,
  StatusChange,
  WsJsonRpcProvider,
} from "polkadot-api/ws-provider/web";
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat";

import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import {
  chainConfig,
  type ChainConfig,
  type AvailableApis,
} from "@/papi-config";

// Chain info interface similar to the original hook
interface ChainInfoHuman {
  ss58Format: number;
  tokenDecimals: number;
  tokenSymbol: string;
  isEthereum: boolean;
}

// Ethereum chains to check against
const ethereumChains = ["Moonbeam", "Moonriver", "Moonbase Alpha", "Astar", "Shiden"];

interface ChainProviderType {
  connectionStatus: StatusChange | undefined;
  activeChain: ChainConfig | null;
  setActiveChain: (chain: ChainConfig) => void;
  client: PolkadotClient | null;
  wsProvider: WsJsonRpcProvider | null;
  api: AvailableApis | null;
  compatibilityToken: CompatibilityToken | undefined;
  chainInfo: ChainInfoHuman | undefined;
  resetApi: () => void;
}

const ChainContext = createContext<ChainProviderType | undefined>(undefined);

export function ChainProvider({ children }: { children: React.ReactNode }) {
  const wsProviderRef = useRef<WsJsonRpcProvider | null>(null);
  const [activeChain, setActiveChain] = useState<ChainConfig | null>(
    chainConfig[0]
  );
  const [activeApi, setActiveApi] = useState<AvailableApis | null>(null);
  const clientRef = useRef<PolkadotClient | null>(null);
  const [compatibilityToken, setCompatibilityToken] = useState<CompatibilityToken>();
  const [chainInfo, setChainInfo] = useState<ChainInfoHuman>();

  const [connectionStatus, setConnectionStatus] = useState<
    StatusChange | undefined
  >(undefined);

  // Reset API function
  const resetApi = useCallback(() => {
    setActiveApi(null);
    clientRef.current = null;
    wsProviderRef.current = null;
    setCompatibilityToken(undefined);
    setChainInfo(undefined);
  }, []);

  // Connection setup
  useEffect(() => {
    if (!activeChain) {
      console.error(
        "Error: No active chain. Please set one in your `/papi-config.ts` file."
      );
      return;
    }

    console.log("Switching chain to", activeChain.name);

    try {
      // Check for custom endpoint in URL, fallback to chain's default endpoints
      const wsEndpoint = handleWsEndpoint({
        defaultEndpoint: activeChain.endpoints[0],
      });
      const endpoints = [wsEndpoint, ...activeChain.endpoints.slice(1)];

      const _wsProvider = getWsProvider(endpoints, setConnectionStatus);

      wsProviderRef.current = _wsProvider;

      const client = createClient(withPolkadotSdkCompat(_wsProvider));
      // @ts-ignore - Intentionally empty interface
      const api = client.getTypedApi(activeChain.descriptors);

      clientRef.current = client;
      // @ts-ignore - Intentionally empty interface
      setActiveApi(api);
    } catch (error) {
      console.error("Error connecting to chain", error);
    }
  }, [activeChain]);

  // Fetch and set compatibility token when API changes
  useEffect(() => {
    if (!activeApi) return;
    
    const fetchCompatibilityToken = async () => {
      try {
        // @ts-ignore - Using compatibilityToken like in the example
        const token = await activeApi.compatibilityToken;
        setCompatibilityToken(token);
      } catch (error) {
        console.error("Error getting compatibility token:", error);
      }
    };

    fetchCompatibilityToken();
  }, [activeApi]);

  // Fetch chain info when client and token are available
  useEffect(() => {
    if (!clientRef.current || !activeApi || !compatibilityToken) return;

    const fetchChainInfo = async () => {
      try {
        const { properties, name } = await clientRef.current!.getChainSpecData();
        if (!properties) return;

        // @ts-ignore - Accessing SS58Prefix like in the example
        const ss58prefix = activeApi.constants.System.SS58Prefix(compatibilityToken);
        
        const tokenDecimals = Array.isArray(properties?.tokenDecimals)
          ? properties?.tokenDecimals[0]
          : properties?.tokenDecimals;

        const tokenSymbol = Array.isArray(properties?.tokenSymbol)
          ? properties?.tokenSymbol[0]
          : properties?.tokenSymbol;

        const isEthereum = ethereumChains.includes(name);

        setChainInfo({
          ss58Format: Number(ss58prefix) || 0,
          tokenDecimals: Number(tokenDecimals) || 0,
          tokenSymbol: tokenSymbol || '',
          isEthereum
        });
      } catch (error) {
        console.error("Error fetching chain info:", error);
      }
    };

    fetchChainInfo();
  }, [clientRef.current, activeApi, compatibilityToken]);

  return (
    <ChainContext.Provider
      value={{
        connectionStatus,
        api: activeApi,
        wsProvider: wsProviderRef.current,
        client: clientRef.current,
        activeChain,
        setActiveChain,
        compatibilityToken,
        chainInfo,
        resetApi,
      }}
    >
      {children}
    </ChainContext.Provider>
  );
}

export function useChain() {
  const context = useContext(ChainContext);
  if (!context) {
    throw new Error("useChain must be used within a ChainProvider");
  }
  return context;
}

/**
 * Get or set the WebSocket endpoint from URL search params
 * Default endpoint will be used if none is specified
 */
export function handleWsEndpoint({
  defaultEndpoint = "wss://rpc.casinojam.io",
}: {
  defaultEndpoint?: string;
} = {}) {
  if (typeof window === "undefined") return defaultEndpoint;

  const params = new URLSearchParams(window.location.search);
  const wsEndpoint = params.get("rpc");

  console.log("wsEndpoint", wsEndpoint);

  if (!wsEndpoint) return defaultEndpoint;

  // Validate endpoint is a valid WSS URL
  try {
    const url = new URL(wsEndpoint);
    if (url.protocol !== "wss:") return defaultEndpoint;
    return wsEndpoint;
  } catch {
    return defaultEndpoint;
  }
}
