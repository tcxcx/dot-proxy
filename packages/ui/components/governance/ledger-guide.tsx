"use client";

import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, HardDrive, Info } from "lucide-react";
import { Steps, Step } from "@/components/ui/steps";

export function LedgerGuide() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <HardDrive className="h-5 w-5 text-primary" />
          <CardTitle>Ledger Connection Guide</CardTitle>
        </div>
        <CardDescription>
          How to use your Ledger hardware wallet with Polkadot governance proxies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="setup">
            <AccordionTrigger>Initial Ledger Setup</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <Steps>
                <Step number={1}>
                  <h3 className="font-medium">Install Polkadot App on Ledger</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Open Ledger Live, go to the Manager section, and install the Polkadot app.
                  </p>
                </Step>
                <Step number={2}>
                  <h3 className="font-medium">Setup Account on Ledger</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Open the Polkadot app on your Ledger device. Your device will display &quot;Polkadot Ready&quot;.
                  </p>
                </Step>
                <Step number={3}>
                  <h3 className="font-medium">Connect Browser Extension</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Install and set up the Polkadot.js extension if you haven&apos;t already.
                  </p>
                </Step>
                <Step number={4}>
                  <h3 className="font-medium">Add Ledger Account to Extension</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    In the Polkadot.js extension, click the &quot;+&quot; button and select &quot;Attach external account&quot;, then choose &quot;Attach Ledger account&quot;.
                  </p>
                </Step>
              </Steps>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="connection">
            <AccordionTrigger>Connecting to DOT Proxy Gov</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <Steps>
                <Step number={1}>
                  <h3 className="font-medium">Open DOT Proxy Gov</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Make sure your Ledger is connected and unlocked with the Polkadot app open.
                  </p>
                </Step>
                <Step number={2}>
                  <h3 className="font-medium">Enable WebUSB for Ledger</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    When prompted, allow the website to connect to your Ledger through WebUSB.
                  </p>
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Compatibility Note</AlertTitle>
                    <AlertDescription>
                      Some browsers may have limitations with WebUSB. Chrome is recommended for Ledger connections.
                    </AlertDescription>
                  </Alert>
                </Step>
                <Step number={3}>
                  <h3 className="font-medium">Select Your Ledger Account</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    When connecting your wallet in DOT Proxy Gov, select your Ledger account from the list.
                  </p>
                </Step>
              </Steps>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="proxy">
            <AccordionTrigger>Creating Governance Proxies</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                When creating a governance proxy from your Ledger account:
              </p>
              
              <Steps>
                <Step number={1}>
                  <h3 className="font-medium">Select Your Ledger as Source</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Use your Ledger account as the source/delegator for your proxy.
                  </p>
                </Step>
                <Step number={2}>
                  <h3 className="font-medium">Sign the Transaction</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    When prompted, review and sign the transaction on your Ledger device. Follow the instructions on the device screen.
                  </p>
                  <Alert className="mt-2">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      The Ledger will display the transaction details. Carefully verify these match what you see on screen.
                    </AlertDescription>
                  </Alert>
                </Step>
              </Steps>
              
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important Security Note</AlertTitle>
                <AlertDescription>
                  Keep your Ledger device in a secure location. The proxy account allows participation in governance, but your DOT remains secured by your Ledger hardware wallet.
                </AlertDescription>
              </Alert>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
} 