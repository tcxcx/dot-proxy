"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGraphQL, QUERIES, formatDate, trimAddress } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Referendum #{referendum.index}</CardTitle>
            <CardDescription className="mt-1">{referendum.title || "No title"}</CardDescription>
          </div>
          <Badge className={statusColors[referendum.status] || "bg-gray-500"}>
            {referendum.status}
          </Badge>
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
        <div>
          Created: {formatDate(referendum.created)}
        </div>
      </CardFooter>
    </Card>
  );
}

export function ReferendumList() {
  const [activeTab, setActiveTab] = useState("ongoing");

  const { data: ongoingReferenda, isLoading: ongoingLoading } = useQuery({
    queryKey: ["referenda", "ongoing"],
    queryFn: async () => {
      const data = await fetchGraphQL(QUERIES.GET_REFERENDA, {
        status: ["ONGOING"],
        limit: 10,
      });
      return data.referenda;
    },
  });

  const { data: closedReferenda, isLoading: closedLoading } = useQuery({
    queryKey: ["referenda", "closed"],
    queryFn: async () => {
      const data = await fetchGraphQL(QUERIES.GET_REFERENDA, {
        status: ["APPROVED", "REJECTED", "CANCELLED", "TIMEDOUT"],
        limit: 10,
      });
      return data.referenda;
    },
    enabled: activeTab === "closed",
  });

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
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

