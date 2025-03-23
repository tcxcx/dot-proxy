"use client";

import { useChain } from "@/providers/chain-provider";
import { useCallback, useMemo } from "react";

/**
 * Interface for the API context similar to the original hook
 */
export interface IApiContext {
  apiDescriptor?: string;
  api?: any;
  chainInfo?: {
    ss58Format: number;
    tokenDecimals: number;
    tokenSymbol: string;
    isEthereum: boolean;
  };
  client?: any;
  compatibilityToken?: any;
  resetApi: () => void;
  isApiReady: boolean;
  isChainReady: boolean;
  error?: Error;
}

/**
 * Type guard to check if a context is of a specific API descriptor
 */
export const isContextOf = (
  ctx: unknown,
  descriptor: string
): ctx is IApiContext => {
  return !!ctx && (ctx as IApiContext).apiDescriptor === descriptor;
};

/**
 * Type guard to check if a context uses one of several API descriptors
 */
export const isContextIn = (
  ctx: unknown,
  descriptors: string[]
): ctx is IApiContext => {
  return descriptors.some((descriptor) => isContextOf(ctx, descriptor));
};

/**
 * Hook that provides API access in a format similar to the original useApi hook
 * but leverages our existing ChainProvider
 */
export function useApi(): IApiContext {
  const { 
    api, 
    client, 
    activeChain, 
    compatibilityToken, 
    chainInfo,
    resetApi,
    connectionStatus 
  } = useChain();

  // Define ready states
  const isApiReady = !!api && !!compatibilityToken;
  const isChainReady = !!chainInfo && isApiReady;

  // Convert connection errors to a proper Error object with safe type checking
  const error = useMemo(() => {
    // Handle connection status in a type-safe way
    if (!connectionStatus) return undefined;
    
    try {
      // Use type checking that doesn't depend on specific string literals
      if (typeof connectionStatus === 'object' && connectionStatus !== null) {
        const statusObj = connectionStatus as Record<string, unknown>;
        if (statusObj.type && statusObj.type === 'error') {
          return new Error('Connection error');
        }
      }
    } catch (e) {
      console.error("Error processing connection status:", e);
    }
    
    return undefined;
  }, [connectionStatus]);

  // Define apiDescriptor based on activeChain
  const apiDescriptor = activeChain?.key;

  return {
    api,
    apiDescriptor,
    chainInfo,
    client,
    compatibilityToken,
    resetApi,
    isApiReady,
    isChainReady,
    error
  };
}

export default useApi; 