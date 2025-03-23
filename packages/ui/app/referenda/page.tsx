"use client";

import { ReferendumList } from "@/components/governance/referendum-list";

export default function ReferendaPage() {
  return (
    <main className="container mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-6">OpenGov Referenda</h1>
      <p className="text-muted-foreground mb-8">
        View and vote on active Polkadot governance proposals using your proxy accounts
      </p>
      
      <ReferendumList />
    </main>
  );
} 