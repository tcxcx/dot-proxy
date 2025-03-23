import { fontUnbounded } from "@/fonts";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProxyDashboard } from "@/components/governance/proxy-dashboard";
import { ReferendumList } from "@/components/governance/referendum-list";
import { TransactionHistory } from "@/components/governance/transaction-history";
import { ProxyInfoCard } from "@/components/governance/info-card";
import { LedgerGuide } from "@/components/governance/ledger-guide";
import { SelfHostingGuide } from "@/components/governance/self-hosting-guide";
import { ShieldCheck } from "lucide-react";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col gap-[32px] p-4 sm:p-8 pb-20">
      {/* Header */}
      <div className="text-center mb-2">
        <h1
          className={cn(
            "text-4xl sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-foreground/70 via-foreground to-foreground/70",
            fontUnbounded.className
          )}
        >
          DOT Proxy Gov
        </h1>
        <div className="flex items-center justify-center gap-2 mt-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <p className="text-sm sm:text-base">Secure governance participation for Polkadot</p>
        </div>
      </div>
      
      {/* Information Card */}
      <ProxyInfoCard />
      
      {/* Main Interface */}
      <Tabs defaultValue="proxies" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="proxies">Proxies</TabsTrigger>
          <TabsTrigger value="referenda">Referenda</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="proxies" className="py-4">
          <ProxyDashboard />
        </TabsContent>
        <TabsContent value="referenda" className="py-4">
          <ReferendumList />
        </TabsContent>
        <TabsContent value="history" className="py-4">
          <TransactionHistory />
        </TabsContent>
      </Tabs>
      
      {/* Guides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LedgerGuide />
        <SelfHostingGuide />
      </div>
    </main>
  );
}
