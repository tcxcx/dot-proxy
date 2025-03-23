"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, AlertCircle, LogOut, Wallet, XIcon } from "lucide-react";
import { usePolkadotExtension } from "@/providers/polkadot-extension-provider";
import { cn, trimAddress } from "@/lib/utils";
import { Identicon } from "@polkadot/react-identicon";
import { allSubstrateWallets, SubstrateWalletPlatform } from "./wallets";
import { isMobile } from "@/lib/is-mobile";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

export function WalletSelect() {
  const {
    accounts,
    installedExtensions,
    selectedExtensionName,
    selectedAccount,
    setSelectedExtensionName,
    setSelectedAccount,
    initiateConnection,
    disconnect,
    isAccountsLoading,
    connectionError,
  } = usePolkadotExtension();
  
  const [isOpen, setIsOpen] = useState(false);

  // Filter wallets by platform (browser/mobile)
  const systemWallets = allSubstrateWallets
    .filter((wallet) =>
      isMobile()
        ? wallet.platforms.includes(SubstrateWalletPlatform.Android) ||
          wallet.platforms.includes(SubstrateWalletPlatform.iOS)
        : wallet.platforms.includes(SubstrateWalletPlatform.Browser)
    )
    .sort((a, b) =>
      installedExtensions.includes(a.id)
        ? -1
        : installedExtensions.includes(b.id)
        ? 1
        : 0
    );

  const handleDialogOpen = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      initiateConnection();
    }
  };

  const getWalletStatusMessage = (walletId: string) => {
    if (installedExtensions.includes(walletId)) {
      return "Detected";
    }
    
    if (isMobile()) {
      return "Open";
    }
    
    return "Install";
  };

  const getExtensionHelpMessage = () => {
    if (!selectedExtensionName) return null;
    
    const wallet = allSubstrateWallets.find(w => w.id === selectedExtensionName);
    if (!wallet) return null;
    
    if (accounts.length === 0 && !isAccountsLoading) {
      return (
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium">No accounts found in {wallet.name}</p>
            <ul className="list-disc pl-5 text-sm mt-2">
              <li>Make sure you have created an account in {wallet.name}</li>
              <li>Ensure you've authorized this site in your extension settings</li>
              <li>Try refreshing the page</li>
            </ul>
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          onClick={initiateConnection}
          className="transition-[min-width] duration-300 min-w-[100px]"
        >
          <Wallet className="w-4 h-4 mr-2" />
          <span className="max-w-[100px] truncate">
            {selectedAccount?.name || "Connect"}
          </span>
          {selectedAccount?.address && (
            <Identicon
              value={selectedAccount?.address}
              size={24}
              theme="polkadot"
              className="ml-2"
            />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0">
        <DialogHeader className="p-4 flex flex-row items-center justify-start">
          {selectedExtensionName !== undefined && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedExtensionName(undefined)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <DialogTitle
            className={cn(
              "leading-snug !pl-4 text-left",
              selectedExtensionName !== undefined && "!pl-0"
            )}
          >
            {selectedExtensionName !== undefined
              ? "Select Account"
              : "Select a wallet to connect to Polkadot"}
          </DialogTitle>
          {selectedExtensionName !== undefined && (
            <Button variant="ghost" size="icon" onClick={disconnect}>
              <LogOut className="w-4 h-4" />
            </Button>
          )}
          <DialogClose asChild className="ml-auto">
            <Button variant="ghost" size="icon">
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="p-4 pt-0 overflow-auto max-h-[500px] min-h-[100px] transition-[max-height,opacity] duration-500">
          {connectionError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {connectionError}
              </AlertDescription>
            </Alert>
          )}
          
          {getExtensionHelpMessage()}
          
          <div
            className={cn(
              "flex flex-col items-start gap-2 transition-[max-height,opacity]",
              selectedExtensionName === undefined
                ? "opacity-100 max-h-[9999px] duration-500 delay-200"
                : "opacity-0 max-h-0 overflow-hidden duration-0"
            )}
          >
            {systemWallets.map((wallet, index) => (
              <Button
                variant="ghost"
                className="w-full flex flex-row items-center justify-between h-auto [&_svg]:size-auto"
                key={index}
                onClick={() => {
                  if (installedExtensions.includes(wallet.id)) {
                    setSelectedExtensionName(wallet.id);
                  } else {
                    // For browser extensions, open installation URL
                    if (!isMobile()) {
                      window.open(wallet.urls.chromeExtension || wallet.urls.website, "_blank");
                    } 
                    // For mobile apps, try to open the app
                    else {
                      if (wallet.platforms.includes(SubstrateWalletPlatform.Android)) {
                        window.open(wallet.urls.androidApp || wallet.urls.website, "_blank");
                      } else if (wallet.platforms.includes(SubstrateWalletPlatform.iOS)) {
                        window.open(wallet.urls.iosApp || wallet.urls.website, "_blank");
                      }
                    }
                  }
                }}
              >
                <div className="flex flex-row items-center justify-start gap-4">
                  <Image
                    src={wallet.logoUrls[0]}
                    alt={wallet.name}
                    className="w-[32px] h-[32px]"
                    width={32}
                    height={32}
                  />
                  <span className="font-bold">{wallet.name}</span>
                </div>
                <span 
                  className={cn(
                    "text-[10px]", 
                    installedExtensions.includes(wallet.id) 
                      ? "text-green-600" 
                      : "text-muted-foreground"
                  )}
                >
                  {getWalletStatusMessage(wallet.id)}
                </span>
              </Button>
            ))}
          </div>
          <div
            className={cn(
              "flex flex-col items-start gap-2 transition-[max-height,opacity]",
              selectedExtensionName === undefined
                ? "opacity-0 max-h-0 overflow-hidden duration-0"
                : "opacity-100 max-h-[9999px] duration-500 delay-200"
            )}
          >
            {isAccountsLoading ? (
              <div className="w-full flex justify-center items-center py-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <span className="ml-3">Loading accounts...</span>
              </div>
            ) : accounts.length > 0 ? (
              accounts.map((account, index) => (
                <DialogClose asChild key={index}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full flex flex-row h-auto justify-start items-center gap-0 [&_svg]:size-auto",
                      selectedAccount?.address === account.address
                        ? "bg-accent"
                        : ""
                    )}
                    onClick={() => setSelectedAccount(account)}
                  >
                    <Identicon
                      className="w-[32px] h-[32px] mr-3 [&>svg]:!h-full [&>svg]:!w-full"
                      value={account.address}
                      size={32}
                      theme="polkadot"
                    />
                    <div className="flex flex-col justify-start items-start gap-0">
                      <span className="font-bold">{account.name}</span>
                      {account.address && (
                        <div>{trimAddress(account.address)}</div>
                      )}
                    </div>
                  </Button>
                </DialogClose>
              ))
            ) : (
              <div className="text-center py-4 px-2">
                <p className="font-medium text-orange-500 mb-2">
                  No accounts found in your wallet
                </p>
                <p className="text-sm text-muted-foreground">
                  Please make sure you have:
                </p>
                <ul className="list-disc text-sm text-left ml-6 mt-2 text-muted-foreground">
                  <li>Created accounts in your wallet</li>
                  <li>Given this site permission to access your accounts</li>
                  <li>Unlocked your wallet extension</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}