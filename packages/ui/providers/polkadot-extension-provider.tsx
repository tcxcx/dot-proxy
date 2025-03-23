"use client";

import { type PolkadotSigner } from "polkadot-api";
import {
  connectInjectedExtension,
  getInjectedExtensions,
  type InjectedExtension,
  type InjectedPolkadotAccount,
} from "polkadot-api/pjs-signer";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface PolkadotExtensionContextType {
  installedExtensions: string[];
  selectedExtensionName: string | undefined;
  setSelectedExtensionName: (name: string | undefined) => void;
  accounts: InjectedPolkadotAccount[];
  activeSigner: PolkadotSigner | null;
  initiateConnection: () => void;
  selectedAccount: InjectedPolkadotAccount | null;
  setSelectedAccount: (account: InjectedPolkadotAccount) => void;
  disconnect: () => void;
  isAccountsLoading: boolean;
  connectionError: string | null;
}

export const PolkadotExtensionContext = createContext<
  PolkadotExtensionContextType | undefined
>(undefined);

export const PolkadotExtensionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isAccountsLoading, setIsAccountsLoading] = useState<boolean>(false);
  const [userWantsToConnect, setUserWantsToConnect] = useState<boolean>(false);
  const [installedExtensions, setInstalledExtensions] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<InjectedPolkadotAccount[]>([]);
  const [activeSigner, setActiveSigner] = useState<PolkadotSigner | null>(null);
  const [selectedExtensionName, setSelectedExtensionName] = useState<
    string | undefined
  >(undefined);
  const [selectedAccount, setSelectedAccount] =
    useState<InjectedPolkadotAccount | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const initializeExtensions = () => {
    try {
      console.log("Initializing extensions...");
      const extensions = getInjectedExtensions();
      console.log("Found extensions:", extensions);
      setInstalledExtensions(extensions);

      const storedExtensionName = localStorage.getItem("selectedExtensionName");
      const storedAccount = JSON.parse(
        localStorage.getItem("selectedAccount") || "null"
      );
      const storedUserWantsToConnect =
        localStorage.getItem("userWantsToConnect") === "true";

      console.log("Stored values:", {
        storedExtensionName,
        storedAccount,
        storedUserWantsToConnect,
      });

      if (storedExtensionName) {
        setSelectedExtensionName(storedExtensionName);
      }
      if (storedAccount) {
        setSelectedAccount(storedAccount);
      }
      if (storedUserWantsToConnect) {
        setUserWantsToConnect(true);
      }
    } catch (error) {
      console.error("Error initializing extensions:", error);
      setConnectionError("Failed to initialize extensions");
    }
  };

  // Initialize extensions with a delay to ensure the page is fully loaded
  useEffect(() => {
    const timeout = setTimeout(() => {
      initializeExtensions();
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  // Attempt to connect when extension name changes or user wants to connect
  useEffect(() => {
    if (selectedExtensionName && userWantsToConnect) {
      console.log("Attempting to connect to extension:", selectedExtensionName);
      connect();
    }
  }, [selectedExtensionName, userWantsToConnect]);

  // Update selected account when accounts list changes
  useEffect(() => {
    if (accounts.length > 0 && selectedAccount) {
      const matchingAccount = accounts.find(
        (account) => account.address === selectedAccount.address
      );
      if (matchingAccount) {
        handleSetSelectedAccount(matchingAccount);
      } else if (accounts.length > 0) {
        // If previously selected account not found, select the first one
        handleSetSelectedAccount(accounts[0]);
      }
    } else if (accounts.length > 0) {
      // No selected account but accounts available, select the first one
      handleSetSelectedAccount(accounts[0]);
    }
  }, [accounts, selectedAccount]);

  const handleSetSelectedExtensionName = (name: string | undefined) => {
    setIsAccountsLoading(true);
    setAccounts([]);
    setConnectionError(null);
    setSelectedExtensionName(name);

    if (name) {
      localStorage.setItem("selectedExtensionName", name);
      console.log("Selected extension name set to:", name);
    } else {
      localStorage.removeItem("selectedExtensionName");
      console.log("Selected extension name cleared");
    }

    setIsAccountsLoading(false);
  };

  const handleSetSelectedAccount = (
    account: InjectedPolkadotAccount | null
  ) => {
    if (account) {
      localStorage.setItem("selectedAccount", JSON.stringify(account));
      console.log("Selected account set to:", account.address);
    } else {
      localStorage.removeItem("selectedAccount");
      console.log("Selected account cleared");
    }
    
    setSelectedAccount(account);
    
    if (account?.polkadotSigner) {
      setActiveSigner(account.polkadotSigner);
    } else {
      setActiveSigner(null);
    }
  };

  const initiateConnection = () => {
    localStorage.setItem("userWantsToConnect", "true");
    setUserWantsToConnect(true);
    setConnectionError(null);
    console.log("User initiated connection");
    
    // If no extension is selected yet but we have installed extensions, select the first one
    if (!selectedExtensionName && installedExtensions.length > 0) {
      handleSetSelectedExtensionName(installedExtensions[0]);
    }
  };

  async function connect() {
    if (!selectedExtensionName) {
      console.error("No extension selected");
      setConnectionError("No extension selected");
      return;
    }

    setIsAccountsLoading(true);
    setConnectionError(null);

    try {
      console.log("Getting installed extensions...");
      const extensions: string[] = getInjectedExtensions();
      setInstalledExtensions(extensions);
      
      if (!extensions.includes(selectedExtensionName)) {
        console.error(`Selected extension ${selectedExtensionName} not found`);
        setConnectionError(`Extension ${selectedExtensionName} not found or not enabled`);
        toast.error("Please install the selected wallet extension and enable it for this site");
        setIsAccountsLoading(false);
        return;
      }

      console.log(`Connecting to ${selectedExtensionName}...`);
      const selectedExtension: InjectedExtension = await connectInjectedExtension(
        selectedExtensionName
      );

      if (!selectedExtension) {
        console.error("Failed to connect to extension");
        setConnectionError("Failed to connect to extension");
        toast.error("Failed to connect to extension");
        setIsAccountsLoading(false);
        return;
      }

      console.log("Getting accounts from extension...");
      const extensionAccounts: InjectedPolkadotAccount[] = selectedExtension.getAccounts();
      console.log(`Found ${extensionAccounts.length} accounts:`, extensionAccounts);
      
      if (extensionAccounts.length === 0) {
        toast.warning("No accounts found. Please create an account in your wallet or enable access for this site.");
        setConnectionError("No accounts found. Please check your wallet permissions.");
      }
      
      setAccounts(extensionAccounts);

      // Set the selected account
      if (selectedAccount?.address) {
        const matchingAccount = extensionAccounts.find(
          (account) => account.address === selectedAccount.address
        );
        if (matchingAccount) {
          console.log("Reconnected to previously selected account:", matchingAccount.address);
          handleSetSelectedAccount(matchingAccount);
        } else if (extensionAccounts.length > 0) {
          console.log("Previously selected account not found, using first available account");
          handleSetSelectedAccount(extensionAccounts[0]);
        }
      } else if (extensionAccounts.length > 0) {
        console.log("No previously selected account, using first available account");
        handleSetSelectedAccount(extensionAccounts[0]);
      }
    } catch (error) {
      console.error("Connection error:", error);
      setConnectionError(`Connection error: ${error instanceof Error ? error.message : String(error)}`);
      toast.error("Failed to connect to wallet");
    } finally {
      setIsAccountsLoading(false);
    }
  }

  const disconnect = () => {
    handleSetSelectedExtensionName(undefined);
    handleSetSelectedAccount(null);
    localStorage.removeItem("userWantsToConnect");
    setUserWantsToConnect(false);
    setConnectionError(null);
    setAccounts([]);
    console.log("Disconnected from wallet");
  };

  return (
    <PolkadotExtensionContext.Provider
      value={{
        installedExtensions,
        isAccountsLoading,
        selectedExtensionName,
        setSelectedExtensionName: handleSetSelectedExtensionName,
        accounts,
        selectedAccount,
        setSelectedAccount: handleSetSelectedAccount,
        activeSigner,
        initiateConnection,
        disconnect,
        connectionError,
      }}
    >
      {children}
    </PolkadotExtensionContext.Provider>
  );
};

export const usePolkadotExtension = () => {
  const context = useContext(PolkadotExtensionContext);
  if (!context) {
    throw new Error(
      "usePolkadotExtension must be used within a PolkadotExtensionProvider"
    );
  }
  return context;
};
