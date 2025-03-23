"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function ApiExample() {
  const { 
    api, 
    chainInfo, 
    apiDescriptor, 
    compatibilityToken, 
    isApiReady,
    isChainReady,
    error: connectionError
  } = useApi();
  
  const [blockNumber, setBlockNumber] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isApiReady) return;
    
    setIsLoading(true);
    setError(null);
    
    const fetchBlockNumber = async () => {
      try {
        if (api?.query?.System?.Number && compatibilityToken) {
          // Type-safe example of fetching the block number
          const header = await api.query.System.Number(compatibilityToken);
          setBlockNumber(Number(header));
        } else {
          throw new Error("Required API methods not available");
        }
      } catch (err) {
        console.error("Error fetching block number:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch block number");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlockNumber();

    // Set up subscription only if the required methods are available
    let unsubFn: (() => void) | undefined;

    if (api?.query?.System?.Number?.subscribe && compatibilityToken) {
      const setupSubscription = async () => {
        try {
          const unsub = await api.query.System.Number.subscribe(
            compatibilityToken,
            (newHeader: any) => {
              setBlockNumber(Number(newHeader));
            }
          );
          unsubFn = unsub;
        } catch (subErr) {
          console.error("Subscription error:", subErr);
        }
      };

      setupSubscription();
    }

    return () => {
      if (unsubFn) unsubFn();
    };
  }, [api, compatibilityToken, isApiReady]);

  // Render loading state when API is initializing
  if (!isApiReady) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>API Connection</CardTitle>
          <CardDescription>Connecting to the Polkadot network...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render error state if connection failed
  if (connectionError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>API Connection Failed</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{connectionError.message}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Connection Example</CardTitle>
        <CardDescription>
          Connected to {apiDescriptor || "unknown"} chain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Chain Info */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">Chain Information</h3>
            {isChainReady ? (
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">Token Symbol:</div>
                <div>{chainInfo?.tokenSymbol}</div>
                
                <div className="text-sm text-muted-foreground">Decimals:</div>
                <div>{chainInfo?.tokenDecimals}</div>
                
                <div className="text-sm text-muted-foreground">SS58 Format:</div>
                <div>{chainInfo?.ss58Format}</div>
                
                <div className="text-sm text-muted-foreground">Ethereum Compatible:</div>
                <div>{chainInfo?.isEthereum ? "Yes" : "No"}</div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Loading chain information...</div>
            )}
          </div>

          {/* Block Number */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">Current Block</h3>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <span>Loading...</span>
              </div>
            ) : error ? (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <div className="text-3xl font-bold">#{blockNumber ?? "—"}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 