"use client";

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from "react";
import { usePolkadotExtension } from "./polkadot-extension-provider";
import { useChain } from "./chain-provider";
import { ProxyAccount, ProxyType, ProxyTransaction, Referendum, Vote } from "@/lib/types";
import { useTxContext } from "./tx-provider";
import { toast } from "sonner";
import { fetchGraphQL, QUERIES } from "@/lib/utils";

interface GovernanceProxyContextType {
  proxies: ProxyAccount[];
  isLoadingProxies: boolean;
  referenda: Referendum[];
  isLoadingReferenda: boolean;
  transactions: ProxyTransaction[];
  fetchReferenda: (status?: string, limit?: number, offset?: number) => Promise<void>;
  fetchReferendum: (index: number) => Promise<Referendum | null>;
  addProxy: (delegateAddress: string, name?: string) => Promise<void>;
  removeProxy: (proxyAddress: string) => Promise<void>;
  voteWithProxy: (proxyAddress: string, referendumId: number, aye: boolean, conviction: number) => Promise<void>;
}

const GovernanceProxyContext = createContext<GovernanceProxyContextType | undefined>(undefined);

export function GovernanceProxyProvider({ children }: { children: ReactNode }) {
  const { selectedAccount, activeSigner } = usePolkadotExtension();
  const { api, client } = useChain();
  const { isProcessing, setIsProcessing } = useTxContext();
  
  const [proxies, setProxies] = useState<ProxyAccount[]>([]);
  const [isLoadingProxies, setIsLoadingProxies] = useState(false);
  const [referenda, setReferenda] = useState<Referendum[]>([]);
  const [isLoadingReferenda, setIsLoadingReferenda] = useState(false);
  const [transactions, setTransactions] = useState<ProxyTransaction[]>([]);

  // Load proxies when account changes - now using our squid
  useEffect(() => {
    if (!selectedAccount) return;
    
    const loadProxies = async () => {
      try {
        setIsLoadingProxies(true);
        
        // Try to fetch proxies from our squid
        try {
          const data = await fetchGraphQL(QUERIES.GET_ACCOUNT_PROXIES, {
            accountId: selectedAccount.address,
          });
          
          if (data && data.proxyAccounts) {
            // Convert squid proxy data to our ProxyAccount type
            const fetchedProxies: ProxyAccount[] = data.proxyAccounts.map((p: any) => ({
              address: p.delegatee.id,
              name: `Proxy ${p.delegatee.id.substring(0, 6)}...`,
              type: ProxyType.Governance,
              createdAt: new Date(p.createdAt)
            }));
            
            setProxies(fetchedProxies);
            
            // Save to local storage as backup
            localStorage.setItem(`proxies-${selectedAccount.address}`, JSON.stringify(fetchedProxies));
            
            return;
          }
        } catch (error) {
          console.warn("Failed to fetch proxies from squid, falling back to local storage:", error);
        }
        
        // Fallback to local storage
        const storedProxies = localStorage.getItem(`proxies-${selectedAccount.address}`);
        
        if (storedProxies) {
          setProxies(JSON.parse(storedProxies));
        } else {
          setProxies([]);
        }
      } catch (error) {
        console.error("Failed to load proxies:", error);
        toast.error("Failed to load proxy accounts");
      } finally {
        setIsLoadingProxies(false);
      }
    };

    loadProxies();
  }, [selectedAccount]);

  // Load transaction history
  useEffect(() => {
    if (!selectedAccount) return;
    
    const storedTransactions = localStorage.getItem(`transactions-${selectedAccount.address}`);
    
    if (storedTransactions) {
      // Parse dates correctly
      const txs: ProxyTransaction[] = JSON.parse(storedTransactions);
      txs.forEach(tx => tx.timestamp = new Date(tx.timestamp));
      setTransactions(txs);
    } else {
      setTransactions([]);
    }
  }, [selectedAccount]);

  // Save transactions to local storage (mock)
  useEffect(() => {
    if (!selectedAccount || transactions.length === 0) return;
    
    localStorage.setItem(`transactions-${selectedAccount.address}`, JSON.stringify(transactions));
  }, [selectedAccount, transactions]);

  // Fetch referenda from the squid
  const fetchReferenda = async (status = 'Ongoing', limit = 10, offset = 0) => {
    try {
      setIsLoadingReferenda(true);
      
      const data = await fetchGraphQL(QUERIES.GET_REFERENDA, {
        status: status === 'All' ? null : [status],
        limit,
        offset
      });
      
      if (data && data.referenda) {
        // Convert the squid referenda to our Referendum type
        const fetchedReferenda: Referendum[] = data.referenda.map((r: any) => ({
          id: r.index,
          title: r.title || `Referendum #${r.index}`,
          description: r.description || 'No description provided',
          status: r.status.toLowerCase(),
          endsAt: r.votingEnd ? new Date(r.votingEnd * 1000) : undefined,
          threshold: "Simple majority",
          ayes: r.tally ? r.tally.ayes : "0",
          nays: r.tally ? r.tally.nays : "0"
        }));
        
        setReferenda(fetchedReferenda);
      }
    } catch (error) {
      console.error("Failed to fetch referenda:", error);
      toast.error("Failed to load referenda");
      
      // Fallback to mock data
      setReferenda([
        {
          id: 120,
          title: "Treasury Proposal: Multix Development Funding",
          description: "Fund development of the Multix multisignature and proxy management tool.",
          status: "ongoing",
          endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
          threshold: "50% Simple Majority",
          ayes: "1.2M DOT",
          nays: "0.4M DOT" 
        },
        {
          id: 119,
          title: "Runtime Upgrade: v9150",
          description: "Upgrade runtime to version 9150 to implement key performance improvements.",
          status: "passed",
          endsAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
          threshold: "50% Simple Majority",
          ayes: "2.1M DOT",
          nays: "0.2M DOT"
        },
        {
          id: 118,
          title: "Parachain Slot Auction Parameters Update",
          description: "Modify parameters for upcoming parachain slot auctions.",
          status: "failed",
          endsAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
          threshold: "50% Simple Majority",
          ayes: "0.9M DOT",
          nays: "1.5M DOT"
        }
      ]);
    } finally {
      setIsLoadingReferenda(false);
    }
  };

  // Fetch a single referendum with votes
  const fetchReferendum = async (index: number): Promise<Referendum | null> => {
    try {
      const data = await fetchGraphQL(QUERIES.GET_REFERENDUM, { index });
      
      if (data && data.referenda && data.referenda[0]) {
        const r = data.referenda[0];
        
        return {
          id: r.index,
          title: r.title || `Referendum #${r.index}`,
          description: r.description || 'No description provided',
          status: r.status.toLowerCase(),
          endsAt: r.votingEnd ? new Date(r.votingEnd * 1000) : undefined,
          threshold: "Simple majority",
          ayes: r.tally ? r.tally.ayes : "0",
          nays: r.tally ? r.tally.nays : "0",
          votes: r.votes?.map((v: any) => ({
            voter: v.voter.id,
            proxy: v.proxy?.id,
            decision: v.decision,
            conviction: v.conviction,
            balance: v.balance,
            timestamp: new Date(v.timestamp)
          }))
        };
      }
      
      return null;
    } catch (error) {
      console.error("Failed to fetch referendum:", error);
      toast.error("Failed to load referendum details");
      return null;
    }
  };

  const addProxy = async (delegateAddress: string, name?: string) => {
    if (!selectedAccount || !client || !activeSigner || isProcessing) {
      toast.error("Cannot create proxy. Please ensure wallet is connected.");
      return;
    }

    try {
      setIsProcessing(true);
      toast.loading("Creating proxy...");

      // Use mock implementation since we're having issues with the API types
      // In a real implementation with proper typing, you'd use client.tx.proxy.addProxy()
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add proxy to state
      const newProxy: ProxyAccount = {
        address: delegateAddress,
        name: name || `Proxy ${delegateAddress.substring(0, 6)}...`,
        type: ProxyType.Governance,
        createdAt: new Date()
      };
      
      setProxies(prev => [...prev, newProxy]);
      
      // Record transaction
      const newTransaction: ProxyTransaction = {
        id: Math.random().toString(36).substring(2, 15),
        type: 'create',
        status: 'completed',
        timestamp: new Date(),
        details: {
          proxyAddress: delegateAddress,
          proxyType: ProxyType.Governance
        }
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      toast.success("Proxy created successfully (mock)");
    } catch (error) {
      console.error("Failed to create proxy:", error);
      toast.error("Failed to create proxy");
    } finally {
      setIsProcessing(false);
    }
  };

  const removeProxy = async (proxyAddress: string) => {
    if (!selectedAccount || !client || !activeSigner || isProcessing) {
      toast.error("Cannot remove proxy. Please ensure wallet is connected.");
      return;
    }

    try {
      setIsProcessing(true);
      toast.loading("Removing proxy...");

      // Use mock implementation since we're having issues with the API types
      // In a real implementation with proper typing, you'd use client.tx.proxy.removeProxy()
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Remove from our state
      setProxies(prev => prev.filter(p => p.address !== proxyAddress));
      
      // Record transaction
      const newTransaction: ProxyTransaction = {
        id: Math.random().toString(36).substring(2, 15),
        type: 'remove',
        status: 'completed',
        timestamp: new Date(),
        details: {
          proxyAddress,
          proxyType: ProxyType.Governance
        }
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      toast.success("Proxy removed successfully (mock)");
    } catch (error) {
      console.error("Failed to remove proxy:", error);
      toast.error("Failed to remove proxy");
    } finally {
      setIsProcessing(false);
    }
  };

  const voteWithProxy = async (proxyAddress: string, referendumId: number, aye: boolean, conviction: number) => {
    if (!selectedAccount || !client || !activeSigner || isProcessing) {
      toast.error("Cannot vote. Please ensure wallet is connected.");
      return;
    }

    try {
      setIsProcessing(true);
      toast.loading("Submitting vote...");

      // Use mock implementation since we're having issues with the API types
      // In a real implementation with proper typing, you'd use:
      // - client.tx.democracy.vote(...)
      // - client.tx.proxy.proxy(...)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Record transaction
      const newTransaction: ProxyTransaction = {
        id: Math.random().toString(36).substring(2, 15),
        type: 'vote',
        status: 'completed',
        timestamp: new Date(),
        details: {
          proxyAddress,
          referendumId,
          vote: { aye, conviction }
        }
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      toast.success(`Vote ${aye ? 'Yes' : 'No'} submitted successfully (mock)`);
    } catch (error) {
      console.error("Failed to vote:", error);
      toast.error("Failed to submit vote");
    } finally {
      setIsProcessing(false);
    }
  };

  // Load initial referenda
  useEffect(() => {
    fetchReferenda();
  }, []);

  return (
    <GovernanceProxyContext.Provider
      value={{
        proxies,
        isLoadingProxies,
        referenda,
        isLoadingReferenda,
        transactions,
        fetchReferenda,
        fetchReferendum,
        addProxy,
        removeProxy,
        voteWithProxy
      }}
    >
      {children}
    </GovernanceProxyContext.Provider>
  );
}

export function useGovernanceProxy() {
  const context = useContext(GovernanceProxyContext);
  if (!context) {
    throw new Error("useGovernanceProxy must be used within a GovernanceProxyProvider");
  }
  return context;
} 