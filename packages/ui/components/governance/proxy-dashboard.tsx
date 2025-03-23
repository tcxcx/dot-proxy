"use client";

import { useState } from "react";
import { useGovernanceProxy } from "@/providers/governance-proxy-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePolkadotExtension } from "@/providers/polkadot-extension-provider";
import { useTxContext } from "@/providers/tx-provider";
import { trimAddress } from "@/lib/utils";

export function ProxyDashboard() {
  const { proxies, isLoadingProxies, addProxy, removeProxy } = useGovernanceProxy();
  const { selectedAccount } = usePolkadotExtension();
  const { isProcessing } = useTxContext();
  
  const [newProxyAddress, setNewProxyAddress] = useState("");
  const [newProxyName, setNewProxyName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleAddProxy = async () => {
    if (!newProxyAddress.trim()) return;
    
    await addProxy(newProxyAddress, newProxyName.trim() || undefined);
    setNewProxyAddress("");
    setNewProxyName("");
    setIsDialogOpen(false);
  };
  
  const handleRemoveProxy = async (proxyAddress: string) => {
    await removeProxy(proxyAddress);
  };
  
  if (!selectedAccount) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Proxy Management</CardTitle>
          <CardDescription>Connect your wallet to manage governance proxies</CardDescription>
        </CardHeader>
        <CardContent className="py-8 flex justify-center">
          <p>Please connect your wallet first</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Governance Proxy Management</CardTitle>
            <CardDescription>
              Create and manage governance proxies to vote in referenda while your DOT remains secure
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={isProcessing}>
                <Plus className="mr-2 h-4 w-4" /> Add Proxy
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a new governance proxy</DialogTitle>
                <DialogDescription>
                  Add an account that can vote on your behalf in governance referenda.
                  This proxy will NOT be able to transfer funds.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="proxy-address">Proxy Address</Label>
                  <Input
                    id="proxy-address"
                    placeholder="Enter address (e.g., 15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5)"
                    value={newProxyAddress}
                    onChange={(e) => setNewProxyAddress(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proxy-name">Name (Optional)</Label>
                  <Input
                    id="proxy-name"
                    placeholder="e.g., My Voting Proxy"
                    value={newProxyName}
                    onChange={(e) => setNewProxyName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProxy} disabled={!newProxyAddress.trim() || isProcessing}>
                  {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Add Proxy
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoadingProxies ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : proxies.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No proxies found</p>
            <p className="text-xs text-muted-foreground mt-2">
              Create a proxy to vote in governance referenda while your DOT remains secure
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {proxies.map((proxy) => (
              <div 
                key={proxy.address} 
                className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{proxy.name || "Unnamed Proxy"}</span>
                    <Badge variant="outline" className="text-xs">Governance</Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {trimAddress(proxy.address)}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                  onClick={() => handleRemoveProxy(proxy.address)}
                  disabled={isProcessing}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t px-6 py-4">
        <p className="text-xs text-muted-foreground">
          A Governance proxy can vote on your behalf but cannot transfer your funds
        </p>
        <p className="text-xs text-muted-foreground">
          {proxies.length} {proxies.length === 1 ? "proxy" : "proxies"}
        </p>
      </CardFooter>
    </Card>
  );
} 