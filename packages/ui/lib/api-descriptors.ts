"use client";

import { dot } from "@polkadot-api/descriptors";
import { TypedApi } from "polkadot-api";

// Define available API descriptors
export type ApiDescriptors = "dot";

// Store descriptors by key
export const DESCRIPTORS = {
  dot,
};

// Helper to get the API type from a descriptor
export type ApiOf<Id extends ApiDescriptors> = 
  Id extends "dot" ? TypedApi<typeof dot> : never;

// Descriptor type helper
export type Descriptors<Id extends ApiDescriptors> = 
  Id extends "dot" ? typeof dot : never; 