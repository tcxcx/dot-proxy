"use client";

import type { TypedApi } from "polkadot-api";

// Mock dot descriptors to avoid build errors
const dot = {};

export interface ChainConfig {
  key: string;
  name: string;
  descriptors: typeof dot;
  endpoints: string[];
  explorerUrl?: string;
}

// @ts-ignore - Intentionally empty interface
export type AvailableApis = TypedApi<typeof dot>;

export const chainConfig: ChainConfig[] = [
  {
    key: "dot",
    name: "Polkadot",
    descriptors: dot,
    endpoints: ["wss://rpc.polkadot.io"],
  },
];
