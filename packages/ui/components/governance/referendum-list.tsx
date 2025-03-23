"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReferenda, useGovernanceTracks } from "@/hooks";
import { formatDate, trimAddress } from "@/lib/utils";
import { ReferendumStatus } from "@/lib/types";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

// Implement ReferendumCard component directly since it doesn't exist
function ReferendumCard({ referendum }) {
  const statusColors = {
    ONGOING: "bg-blue-500",
    APPROVED: "bg-green-500",
    REJECTED: "bg-red-500",
    CANCELLED: "bg-gray-500",
    TIMEDOUT: "bg-yellow-500",
  };

  return (
    <Link href={`/referendum/${referendum.index}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Referendum #{referendum.index}</CardTitle>
              <CardDescription className="mt-1">{referendum.title || "No title"}</CardDescription>
            </div>
            <div className="flex flex-col gap-2 text-right">
              <Badge className={statusColors[referendum.status] || "bg-gray-500"}>
                {referendum.status}
              </Badge>
              {referendum.track !== undefined && (
                <Badge variant="outline" className="text-xs">
                  Track {referendum.track}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {referendum.description || "No description available"}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-xs text-muted-foreground">
          <div>
            Proposer: {referendum.proposer ? trimAddress(referendum.proposer.id) : "Unknown"}
          </div>
          <div className="flex items-center">
            <span>{formatDate(referendum.created)}</span>
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

export function ReferendumList() {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [selectedTrack, setSelectedTrack] = useState<string>("all");
  
  // Fetch tracks from GraphQL
  const { 
    data: tracks = []
  } = useGovernanceTracks();
  
  // Ongoing referenda
  const { 
    data: ongoingReferenda = [], 
    isLoading: ongoingLoading,
    refetch: refetchOngoing
  } = useReferenda({
    status: [ReferendumStatus.Ongoing],
    track: selectedTrack !== "all" ? parseInt(selectedTrack) : undefined,
  });
  
  // Closed referenda
  const { 
    data: closedReferenda = [], 
    isLoading: closedLoading,
    refetch: refetchClosed
  } = useReferenda({
    status: [
      ReferendumStatus.Approved, 
      ReferendumStatus.Rejected, 
      ReferendumStatus.Cancelled, 
      ReferendumStatus.TimedOut
    ],
    track: selectedTrack !== "all" ? parseInt(selectedTrack) : undefined,
    enabled: activeTab === "closed"
  });

  // Refresh data when track selection changes
  useEffect(() => {
    refetchOngoing();
    if (activeTab === "closed") {
      refetchClosed();
    }
  }, [selectedTrack, refetchOngoing, refetchClosed, activeTab]);

  // Create a loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {Array(3).fill(0).map((_, i) => (
        <Card key={i} className="w-full">
          <div className="p-6 space-y-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Track filter */}
      <div className="flex justify-end">
        <Select value={selectedTrack} onValueChange={setSelectedTrack}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by track" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tracks</SelectItem>
            {tracks.map((track) => (
              <SelectItem key={track.id} value={track.id.toString()}>
                {track.name || `Track ${track.id}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="ongoing" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        <TabsContent value="ongoing" className="space-y-4 mt-4">
          {ongoingLoading ? (
            <LoadingSkeleton />
          ) : ongoingReferenda?.length > 0 ? (
            ongoingReferenda.map((referendum) => (
              <ReferendumCard key={referendum.id} referendum={referendum} />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No ongoing referenda found
              {selectedTrack !== "all" && " for the selected track"}
            </div>
          )}
        </TabsContent>
        <TabsContent value="closed" className="space-y-4 mt-4">
          {closedLoading ? (
            <LoadingSkeleton />
          ) : closedReferenda?.length > 0 ? (
            closedReferenda.map((referendum) => (
              <ReferendumCard key={referendum.id} referendum={referendum} />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No closed referenda found
              {selectedTrack !== "all" && " for the selected track"}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

