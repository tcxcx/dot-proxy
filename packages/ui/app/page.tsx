
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProxyDashboard } from "@/components/governance/proxy-dashboard";
import { ReferendumList } from "@/components/governance/referendum-list";
import { TransactionHistory } from "@/components/governance/transaction-history";
import { ProxyInfoCard } from "@/components/governance/info-card";
import { LedgerGuide } from "@/components/governance/ledger-guide";
import { SelfHostingGuide } from "@/components/governance/self-hosting-guide";
import SplineHero from "@/components/spline/hero";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col gap-[32px] p-4 sm:p-8 pb-20">
      {/* Header */}
      <SplineHero />
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
      
            {/* Information Card */}
            <ProxyInfoCard />
      {/* Guides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LedgerGuide />
        <SelfHostingGuide />
      </div>
    </main>
  );
}
