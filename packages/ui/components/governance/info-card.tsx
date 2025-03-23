"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, BookOpen, Lock, Vote, HelpCircle } from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ProxyInfoCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <CardTitle>Governance Proxy Guide</CardTitle>
        </div>
        <CardDescription>
          Learn how to securely participate in governance while keeping your DOT staked
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="what-is">
            <AccordionTrigger>What is a governance proxy?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p>
                  A governance proxy is a special relationship between two accounts that allows one 
                  account (the proxy) to vote on behalf of another account (the delegator) in governance.
                </p>
                <p>
                  Unlike a regular transfer, the proxy can <strong>only</strong> perform governance actions and cannot 
                  transfer funds or perform other operations.
                </p>
                <div className="flex mt-4">
                  <div className="bg-primary/10 text-primary rounded-md p-2 text-sm">
                    <BookOpen className="h-4 w-4 inline-block mr-1" />
                    Proxies are a native feature of Polkadot, secured by the blockchain itself.
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="why-use">
            <AccordionTrigger>Why use a governance proxy?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Lock className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <p>
                    <strong>Keep funds secure:</strong> Your DOT can remain staked in cold storage (like a Ledger hardware wallet), while you participate in governance from a hot wallet.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Vote className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <p>
                    <strong>Active participation:</strong> Vote on referenda without unstaking or moving your DOT from secure storage.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <HelpCircle className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <p>
                    <strong>Delegation:</strong> Allow a trusted account to vote on your behalf if you can&apos;t actively monitor governance proposals.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="how-works">
            <AccordionTrigger>How does it work?</AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal pl-5 space-y-2 text-sm">
                <li>
                  <strong>Create a Proxy:</strong> Your main account (with your staked DOT) authorizes a proxy account for governance actions only.
                </li>
                <li>
                  <strong>Vote with the Proxy:</strong> The proxy account can now vote with the weight of your staked DOT, but cannot transfer or spend those tokens.
                </li>
                <li>
                  <strong>Revoke Anytime:</strong> You can remove the proxy relationship at any time from your main account.
                </li>
              </ol>
              <div className="p-2 bg-muted rounded-md mt-4 text-sm">
                <p>
                  <strong>Note:</strong> Creating or removing a proxy requires a transaction from your main account (the one with staked DOT).
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="get-started">
            <AccordionTrigger>Getting started</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 text-sm">
                <p>
                  To create a governance proxy, you&apos;ll need:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>A main account with your staked DOT (e.g., your Ledger account)</li>
                  <li>A second account to use as your proxy (e.g., a Polkadot.js browser extension account)</li>
                  <li>A small amount of DOT for transaction fees</li>
                </ul>
                <div className="pt-2">
                  <Button size="sm" className="text-sm">
                    Create Proxy Now
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
} 