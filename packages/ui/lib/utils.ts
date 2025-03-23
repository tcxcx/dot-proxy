import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a large number for display (K, M, B)
 * @param num - The number to format
 * @returns Formatted number string
 */
export function formatBalance(num: bigint | number): string {
  // Convert to bigint if it's a number
  if (typeof num === 'number') {
    num = BigInt(Math.floor(num));
  }
  
  // Format based on size
  if (num > BigInt(1000000000)) { // Billions
    return `${(Number(num) / 1e9).toFixed(2)}B`;
  } else if (num > BigInt(1000000)) { // Millions
    return `${(Number(num) / 1e6).toFixed(2)}M`;
  } else if (num > BigInt(1000)) { // Thousands
    return `${(Number(num) / 1e3).toFixed(2)}K`;
  } else {
    return num.toString();
  }
}

/**
 * Trims an address to a shorter format
 * @param address - The address to trim
 * @param startLength - Number of characters to show at the start
 * @param endLength - Number of characters to show at the end
 * @returns Trimmed address string
 */
export function trimAddress(
  address: string,
  startLength = 6,
  endLength = 6
): string {
  if (!address) return "";
  
  if (address.length <= startLength + endLength) {
    return address;
  }

  const start = address.slice(0, startLength);
  const end = address.slice(-endLength);

  return `${start}...${end}`;
}

/**
 * Formats a date to a readable string
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string | number): string {
  // If date is a string or number, convert to Date
  const dateObj = date instanceof Date ? date : new Date(date);
  
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
}

// The base URL for our squid GraphQL endpoint
export const SQUID_ENDPOINT = process.env.NEXT_PUBLIC_SQUID_URL || 'https://dot-proxy-gov-squid.xyz/graphql';

// Basic fetcher for GraphQL
// @ts-ignore
export async function fetchGraphQL(query: string, variables: Record<string, any> = {}) {
  try {
    const response = await fetch(SQUID_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const json = await response.json();

    if (json.errors) {
      // @ts-ignore
      throw new Error(json.errors.map((e: any) => e.message).join('\n'));
    }

    return json.data;
  } catch (error) {
    console.error('Error fetching GraphQL:', error);
    throw error;
  }
}

// GraphQL queries
export const QUERIES = {
  // Get all referenda with basic information
  GET_REFERENDA: `
    query GetReferenda($status: [ReferendumStatus!], $limit: Int, $offset: Int) {
      referenda(
        orderBy: index_DESC
        where: { status_in: $status }
        limit: $limit
        offset: $offset
      ) {
        id
        index
        track
        title
        description
        proposer {
          id
        }
        status
        created
        votingStart
        votingEnd
        executed
        executedAt
        tally {
          ayes
          nays
          support
        }
      }
    }
  `,

  // Get a single referendum with votes
  GET_REFERENDUM: `
    query GetReferendum($index: Int!) {
      referenda(where: { index_eq: $index }, limit: 1) {
        id
        index
        track
        title
        description
        proposer {
          id
        }
        status
        created
        votingStart
        votingEnd
        executed
        executedAt
        tally {
          ayes
          nays
          support
        }
        votes {
          voter {
            id
          }
          proxy {
            id
          }
          decision
          conviction
          balance
          timestamp
          isProxyVote
        }
      }
    }
  `,

  // Get governance tracks
  GET_GOVERNANCE_TRACKS: `
    query GetGovernanceTracks {
      governanceTracks {
        id
        name
        description
        minApproval
        minSupport
        decisionPeriod
        preparePeriod
        confirmPeriod
      }
    }
  `,

  // Get all referenda by track
  GET_REFERENDA_BY_TRACK: `
    query GetReferendaByTrack($track: Int!, $status: [ReferendumStatus!], $limit: Int, $offset: Int) {
      referenda(
        orderBy: index_DESC
        where: { track_eq: $track, status_in: $status }
        limit: $limit
        offset: $offset
      ) {
        id
        index
        track
        title
        description
        proposer {
          id
        }
        status
        created
        votingStart
        votingEnd
        executed
        executedAt
        tally {
          ayes
          nays
          support
        }
      }
    }
  `,

  // Get all proxies for an account
  GET_ACCOUNT_PROXIES: `
    query GetAccountProxies($accountId: String!) {
      proxyAccounts(where: { delegator: { id_eq: $accountId }, type_eq: Governance }) {
        id
        delegatee {
          id
        }
        type
        createdAt
      }
    }
  `,

  // Get all votes by a proxy
  GET_PROXY_VOTES: `
    query GetProxyVotes($proxyId: String!) {
      votes(where: { proxy: { id_eq: $proxyId } }) {
        id
        referendum {
          id
          index
          title
        }
        decision
        conviction
        balance
        timestamp
      }
    }
  `,

  // Get account multisigs
  GET_ACCOUNT_MULTISIGS: `
    query GetAccountMultisigs($accountId: String!) {
      accounts(where: { multisigFor: { signatory: { id_eq: $accountId } } }) {
        id
        isMultisig
        threshold
        signatories {
          signatory {
            id
          }
        }
      }
    }
  `
};
