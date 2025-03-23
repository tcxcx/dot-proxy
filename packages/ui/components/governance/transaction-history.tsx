"use client";

import { useGovernanceProxy } from "@/providers/governance-proxy-provider";
import { usePolkadotExtension } from "@/providers/polkadot-extension-provider";
import { ProxyTransaction } from "@/lib/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Loader, 
  XCircle, 
  History, 
  ArrowUpRight, 
  UserPlus, 
  UserMinus, 
  Vote 
} from "lucide-react";
import { trimAddress } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function TransactionHistory() {
  const { transactions } = useGovernanceProxy();
  const { selectedAccount } = usePolkadotExtension();

  if (!selectedAccount) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Connect your wallet to view transaction history</CardDescription>
        </CardHeader>
        <CardContent className="py-8 flex justify-center">
          <p>Please connect your wallet first</p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getTransactionIcon = (transaction: ProxyTransaction) => {
    if (transaction.status === 'pending') {
      return <Loader className="h-4 w-4 animate-spin text-yellow-500" />;
    } else if (transaction.status === 'failed') {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }

    switch (transaction.type) {
      case 'create':
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      case 'remove':
        return <UserMinus className="h-4 w-4 text-orange-500" />;
      case 'vote':
        return <Vote className="h-4 w-4 text-purple-500" />;
      default:
        return <History className="h-4 w-4" />;
    }
  };

  const getTransactionLabel = (transaction: ProxyTransaction) => {
    switch (transaction.type) {
      case 'create':
        return `Added governance proxy ${trimAddress(transaction.details.proxyAddress!)}`;
      case 'remove':
        return `Removed governance proxy ${trimAddress(transaction.details.proxyAddress!)}`;
      case 'vote':
        const voteDirection = transaction.details.vote?.aye ? 'Aye' : 'Nay';
        const conviction = transaction.details.vote?.conviction || 0;
        return `Voted ${voteDirection} with ${conviction}x conviction on referendum #${transaction.details.referendumId!}`;
      default:
        return 'Unknown transaction';
    }
  };

  const getStatusBadge = (status: ProxyTransaction['status']) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            Pending
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            Completed
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          Recent governance proxy transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No transactions found</p>
            <p className="text-xs text-muted-foreground mt-2">
              Transactions will appear here when you create proxies or vote on referenda
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getTransactionIcon(transaction)}
                  <div className="flex flex-col">
                    <span className="font-medium">{getTransactionLabel(transaction)}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(transaction.timestamp)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(transaction.status)}
                  <a 
                    href="#" 
                    className="text-primary hover:text-primary/80"
                    onClick={(e) => {
                      e.preventDefault();
                      // In a real app we would link to a block explorer with the tx hash
                    }}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 