// Types for governance proxy functionality
export enum ProxyType {
  Any = 'Any',
  NonTransfer = 'NonTransfer',
  Governance = 'Governance',
  IdentityJudgement = 'IdentityJudgement',
  CancelProxy = 'CancelProxy',
  Auction = 'Auction',
  Society = 'Society',
  OnDemandOrdering = 'OnDemandOrdering',
  Staking = 'Staking'
}

export interface ProxyAccount {
  address: string;
  name?: string;
  type: ProxyType;
  createdAt?: Date;
}

export interface Referendum {
  id: number;
  title: string;
  description: string;
  status: 'ongoing' | 'passed' | 'failed' | 'cancelled' | 'Ongoing' | 'Approved' | 'Rejected' | 'Cancelled';
  endsAt?: Date;
  threshold?: string;
  ayes?: string | number | bigint;
  nays?: string | number | bigint;
  votes?: ReferendumVote[];
}

export interface ReferendumVote {
  voter: string;
  proxy?: string;
  decision: 'AYE' | 'NAY' | 'ABSTAIN';
  conviction: number;
  balance: string | number | bigint;
  timestamp: Date;
}

export interface Conviction {
  value: number;
  label: string;
  description: string;
  multiplier: number;
  lockTime: string; // Human-readable lock time
}

export interface Vote {
  aye: boolean; // true for Aye, false for Nay
  conviction: number; // 0 to 6 (corresponding to 0.1x to 6x multiplier)
}

export const CONVICTIONS: Conviction[] = [
  {
    value: 0,
    label: '0.1x voting balance, no lockup period',
    description: 'No conviction',
    multiplier: 0.1,
    lockTime: 'No lockup'
  },
  {
    value: 1,
    label: '1x voting balance, locked for 1x enactment (28 days)',
    description: 'Locked for 1x enactment (28 days)',
    multiplier: 1,
    lockTime: '28 days'
  },
  {
    value: 2,
    label: '2x voting balance, locked for 2x enactment (56 days)',
    description: 'Locked for 2x enactment (56 days)',
    multiplier: 2,
    lockTime: '56 days'
  },
  {
    value: 3,
    label: '3x voting balance, locked for 4x enactment (112 days)',
    description: 'Locked for 4x enactment (112 days)',
    multiplier: 3,
    lockTime: '112 days'
  },
  {
    value: 4,
    label: '4x voting balance, locked for 8x enactment (224 days)',
    description: 'Locked for 8x enactment (224 days)',
    multiplier: 4,
    lockTime: '224 days'
  },
  {
    value: 5,
    label: '5x voting balance, locked for 16x enactment (448 days)',
    description: 'Locked for 16x enactment (448 days)',
    multiplier: 5,
    lockTime: '448 days'
  },
  {
    value: 6,
    label: '6x voting balance, locked for 32x enactment (896 days)',
    description: 'Locked for 32x enactment (896 days)',
    multiplier: 6,
    lockTime: '896 days'
  }
]

export interface ProxyTransaction {
  id: string; // Transaction hash or another unique identifier
  type: 'create' | 'remove' | 'vote';
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  details: {
    proxyAddress?: string;
    proxyType?: ProxyType;
    referendumId?: number;
    vote?: Vote;
  };
}

// Multisig Types
export interface MultisigAccount {
  address: string;
  name?: string;
  threshold: number;
  signatories: string[];
}

export interface MultisigCall {
  id: string;
  callHash: string;
  callData?: string;
  status: 'pending' | 'approved' | 'executed' | 'failed';
  approvals: string[]; // Addresses of accounts that approved
  timestamp: Date;
  executed?: Date;
  callIndex?: number;
}

// Vote Decision from our squid schema
export enum VoteDecision {
  AYE = 'AYE',
  NAY = 'NAY',
  ABSTAIN = 'ABSTAIN',
  SPLIT = 'SPLIT'
} 