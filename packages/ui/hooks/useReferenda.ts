"use client";

import { useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";
import { ReferendumStatus } from "@/lib/types";

export interface UseReferendaOptions {
  status?: ReferendumStatus[];
  track?: number;
  limit?: number;
  offset?: number;
  enabled?: boolean;
}

export interface UseReferendumOptions {
  index: number;
  enabled?: boolean;
}

/**
 * Hook for fetching multiple referenda with filtering options
 * using the Polkadot API directly
 */
export function useReferenda(options: UseReferendaOptions = {}) {
  const { 
    status = [ReferendumStatus.Ongoing], 
    track, 
    limit = 10, 
    offset = 0,
    enabled = true 
  } = options;

  const { api, compatibilityToken, isApiReady } = useApi();

  return useQuery({
    queryKey: ["referenda", { status, track, limit, offset }],
    queryFn: async () => {
      if (!api || !isApiReady || !compatibilityToken) {
        return mockReferenda(status, track);
      }

      try {
        // In a real implementation, we'd use the Polkadot API to fetch referenda
        // For now, we'll continue using mock data
        // Example of how it might look with the real API:
        /*
        // Get all referenda
        const referendaEntries = await api.query.Referenda.referendumInfoFor.entries(compatibilityToken);
        
        // Map and filter based on status and track
        let referenda = referendaEntries
          .map(([key, value]) => {
            const index = key.args[0];
            const info = value.unwrap();
            // Extract track, status etc from info
            const statusKey = Object.keys(info)[0];
            const referendumData = info[statusKey];
            
            return {
              id: `ref-${index}`,
              index: index,
              track: referendumData.track,
              // ... other properties
            };
          })
          .filter(ref => {
            // Filter by status
            const refStatus = getStatusFromApi(ref);
            const matchesStatus = status.includes(refStatus);
            // Filter by track if specified
            const matchesTrack = track === undefined || ref.track === track;
            return matchesStatus && matchesTrack;
          })
          .slice(offset, offset + limit);
          
        return referenda;
        */
        
        // For now, return mock data
        return mockReferenda(status, track);
      } catch (error) {
        console.error("Failed to fetch referenda:", error);
        return mockReferenda(status, track);
      }
    },
    enabled: enabled
  });
}

/**
 * Hook for fetching a single referendum by index
 */
export function useReferendum(options: UseReferendumOptions) {
  const { index, enabled = true } = options;
  const { api, compatibilityToken, isApiReady } = useApi();

  return useQuery({
    queryKey: ["referendum", index],
    queryFn: async () => {
      if (!api || !isApiReady || !compatibilityToken) {
        return mockReferendum(index);
      }

      try {
        // In a real implementation, we'd use the Polkadot API to fetch a referendum
        // For now, we'll continue using mock data
        // Example of how it might look with the real API:
        /*
        const info = await api.query.Referenda.referendumInfoFor(index, compatibilityToken);
        
        if (info.isNone) {
          return null;
        }
        
        const unwrapped = info.unwrap();
        const statusKey = Object.keys(unwrapped)[0];
        const referendumData = unwrapped[statusKey];
        
        // Get the votes
        const allVotes = await api.query.ConvictionVoting.votingFor.entries(
          compatibilityToken,
          [referendumData.track, index]
        );
        
        const votes = allVotes.map(([key, vote]) => {
          const voter = key.args[0].toString();
          const voteValue = vote.unwrap();
          // Extract vote details
          
          return {
            voter: voter,
            decision: voteValue.aye ? 'AYE' : 'NAY',
            conviction: voteValue.conviction,
            // ... other properties
          };
        });
        
        return {
          id: `ref-${index}`,
          index: index,
          track: referendumData.track,
          // ... other properties
          votes: votes
        };
        */
        
        // For now, return mock data
        return mockReferendum(index);
      } catch (error) {
        console.error(`Failed to fetch referendum ${index}:`, error);
        return mockReferendum(index);
      }
    },
    enabled: enabled
  });
}

/**
 * Hook for fetching governance tracks
 */
export function useGovernanceTracks(enabled = true) {
  const { api, compatibilityToken, isApiReady } = useApi();

  return useQuery({
    queryKey: ["governanceTracks"],
    queryFn: async () => {
      if (!api || !isApiReady || !compatibilityToken) {
        return mockTracks();
      }

      try {
        // In a real implementation, we'd use the Polkadot API to fetch tracks
        // For now, we'll continue using mock data
        // Example of how it might look with the real API:
        /*
        const tracksRaw = await api.query.Referenda.tracks(compatibilityToken);
        
        const tracks = tracksRaw.map((track, id) => {
          return {
            id: String(id),
            name: track.name?.toString() || `Track ${id}`,
            description: track.description?.toString(),
            minApproval: track.minApproval.toNumber() / 1_000_000,
            minSupport: track.minSupport.toNumber() / 1_000_000,
            // ... other properties
          };
        });
        
        return tracks;
        */
        
        // For now, return mock data
        return mockTracks();
      } catch (error) {
        console.error("Failed to fetch governance tracks:", error);
        return mockTracks();
      }
    },
    enabled: enabled
  });
}

// Mock data functions
function mockReferenda(status: ReferendumStatus[], track?: number) {
  const allReferenda = [
    {
      id: "ref-1",
      index: 120,
      track: 22,
      title: "Treasury Proposal: Multix Development Funding",
      description: "Fund development of the Multix multisignature and proxy management tool.",
      status: ReferendumStatus.Ongoing,
      created: new Date().toISOString(),
      proposer: { id: "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5" },
      tally: { ayes: "1200000", nays: "400000" }
    },
    {
      id: "ref-2",
      index: 119,
      track: 14,
      title: "Runtime Upgrade: v9150",
      description: "Upgrade runtime to version 9150 to implement key performance improvements.",
      status: ReferendumStatus.Approved,
      created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      proposer: { id: "13Xs22A2h7B61XWuFNVdpGmBuvqQupN5QFCC9PjqEkMHpFwr" },
      tally: { ayes: "2100000", nays: "200000" }
    },
    {
      id: "ref-3",
      index: 118,
      track: 12,
      title: "Parachain Slot Auction Parameters Update",
      description: "Modify parameters for upcoming parachain slot auctions.",
      status: ReferendumStatus.Rejected,
      created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      proposer: { id: "16SJVcvdDKuo3VSjJQkjZUz4uefMGbhbqTfuG8TU8EsaH1r7" },
      tally: { ayes: "900000", nays: "1500000" }
    }
  ];
  
  // Filter by status
  let filteredReferenda = allReferenda.filter(ref => 
    status.includes(ref.status as ReferendumStatus)
  );
  
  // Filter by track if specified
  if (track !== undefined) {
    filteredReferenda = filteredReferenda.filter(ref => ref.track === track);
  }
  
  return filteredReferenda;
}

function mockReferendum(index: number) {
  const allReferenda = mockReferenda([
    ReferendumStatus.Ongoing, 
    ReferendumStatus.Approved, 
    ReferendumStatus.Rejected
  ]);
  return allReferenda.find(ref => ref.index === index) || null;
}

function mockTracks() {
  return [
    { id: "0", name: "Root", description: "Super-user track", minApproval: 1, minSupport: 1 },
    { id: "1", name: "Whitelisted Caller", description: "Special origin for whitelisted functions", minApproval: 0.6, minSupport: 0.5 },
    { id: "10", name: "Staking Admin", description: "Staking administration track", minApproval: 0.75, minSupport: 0.6 },
    { id: "11", name: "Treasurer", description: "Treasury spending track", minApproval: 0.6, minSupport: 0.5 },
    { id: "12", name: "Lease Admin", description: "Parachain slot lease administration track", minApproval: 0.7, minSupport: 0.6 },
    { id: "13", name: "Fellowship Admin", description: "Technical fellowship administration track", minApproval: 0.65, minSupport: 0.55 },
    { id: "14", name: "General Admin", description: "General network administration track", minApproval: 0.7, minSupport: 0.6 },
    { id: "15", name: "Referendum Canceller", description: "Track for cancelling referenda", minApproval: 0.75, minSupport: 0.6 },
    { id: "16", name: "Referendum Killer", description: "Track for killing referenda", minApproval: 0.8, minSupport: 0.65 },
    { id: "20", name: "Small Tipper", description: "Small tips track", minApproval: 0.5, minSupport: 0.4 },
    { id: "21", name: "Big Tipper", description: "Big tips track", minApproval: 0.55, minSupport: 0.45 },
    { id: "22", name: "Small Spender", description: "Small treasury spending track", minApproval: 0.6, minSupport: 0.5 },
    { id: "23", name: "Medium Spender", description: "Medium treasury spending track", minApproval: 0.65, minSupport: 0.55 },
    { id: "24", name: "Big Spender", description: "Big treasury spending track", minApproval: 0.7, minSupport: 0.6 }
  ];
} 