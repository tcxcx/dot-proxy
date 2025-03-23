"use client";

import { useState } from "react";
import { useReferendum } from "@/hooks/useReferenda";
import { useGovernanceProxy } from "@/providers/governance-proxy-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Conviction, CONVICTIONS } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ReferendumVoteProps {
  referendumId: number;
}

export function ReferendumVote({ referendumId }: ReferendumVoteProps) {
  const { data: referendum, isLoading: isLoadingReferendum } = useReferendum({ 
    index: referendumId 
  });
  
  const { proxies, isLoadingProxies, voteWithProxy } = useGovernanceProxy();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProxy, setSelectedProxy] = useState<string | null>(null);
  const [voteValue, setVoteValue] = useState<"aye" | "nay">("aye");
  const [conviction, setConviction] = useState<number>(0);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Function to handle voting
  const handleVote = async () => {
    if (!selectedProxy || !referendum) return;
    
    setIsVoting(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Call the voteWithProxy function from the governance proxy provider
      await voteWithProxy(
        selectedProxy,
        referendumId,
        voteValue === "aye",
        conviction
      );
      
      setSuccess(`Successfully voted ${voteValue.toUpperCase()} on referendum #${referendumId}`);
      // Close the dialog after a success delay
      setTimeout(() => {
        setIsDialogOpen(false);
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit vote");
    } finally {
      setIsVoting(false);
    }
  };

  // Show loading state
  if (isLoadingReferendum) {
    return (
      <Card>
        <CardContent className="py-4">
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error if referendum not found
  if (!referendum) {
    return (
      <Card>
        <CardContent className="py-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Referendum not found</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vote on Referendum #{referendumId}</CardTitle>
        <CardDescription>Cast your vote using a governance proxy</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">{referendum.title}</h3>
          <p className="text-sm text-muted-foreground">{referendum.description}</p>
          
          {referendum.track !== undefined && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Track:</span> {referendum.track}
            </p>
          )}
          
          {/* Voting stats */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3 border border-green-200 dark:border-green-800">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Aye</p>
              <p className="text-lg font-bold">{referendum.tally?.ayes || "0"}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-950 rounded-lg p-3 border border-red-200 dark:border-red-800">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">Nay</p>
              <p className="text-lg font-bold">{referendum.tally?.nays || "0"}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Vote</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Vote on Referendum #{referendumId}</DialogTitle>
              <DialogDescription>
                Use one of your governance proxies to vote on this referendum
              </DialogDescription>
            </DialogHeader>
            
            {/* Success message */}
            {success && (
              <Alert className="bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-600 dark:text-green-400">
                  {success}
                </AlertDescription>
              </Alert>
            )}
            
            {/* Error message */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid gap-4 py-4">
              {/* Proxy selection */}
              <div className="space-y-2">
                <Label htmlFor="proxy">Select Proxy</Label>
                <Select
                  value={selectedProxy || ""}
                  onValueChange={setSelectedProxy}
                  disabled={isLoadingProxies || isVoting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a proxy" />
                  </SelectTrigger>
                  <SelectContent>
                    {proxies.map((proxy) => (
                      <SelectItem key={proxy.address} value={proxy.address}>
                        {proxy.name || proxy.address.substring(0, 10) + '...'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Vote direction */}
              <div className="space-y-2">
                <Label>Vote Direction</Label>
                <RadioGroup 
                  value={voteValue}
                  onValueChange={(v) => setVoteValue(v as "aye" | "nay")}
                  className="flex space-x-4"
                  disabled={isVoting}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="aye" id="aye" />
                    <Label htmlFor="aye" className="text-green-600 dark:text-green-400">Aye (Yes)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nay" id="nay" />
                    <Label htmlFor="nay" className="text-red-600 dark:text-red-400">Nay (No)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Conviction */}
              <div className="space-y-2">
                <Label htmlFor="conviction">Conviction</Label>
                <Select
                  value={conviction.toString()}
                  onValueChange={(value) => setConviction(parseInt(value))}
                  disabled={isVoting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select conviction" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONVICTIONS.map((c: Conviction) => (
                      <SelectItem key={c.value} value={c.value.toString()}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isVoting}>
                Cancel
              </Button>
              <Button 
                onClick={handleVote} 
                disabled={!selectedProxy || isVoting}
              >
                {isVoting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isVoting ? "Voting..." : "Submit Vote"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
} 