"use client";

import { ApiExample } from "@/components/examples/ApiExample";

export default function ApiExamplePage() {
  return (
    <main className="container mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Polkadot API Example</h1>
      <p className="text-muted-foreground mb-8">
        This example demonstrates how to use the useApi hook to interact with the Polkadot blockchain.
      </p>
      
      <ApiExample />
    </main>
  );
} 