import * as ss58 from '@subsquid/ss58';
import { ProcessorContext } from '../processor';
import { Store } from '@subsquid/typeorm-store';

interface VoteData {
  id: string;
  referendumId: string;
  voter: string;
  isAye: boolean;
  conviction: number;
  balance: bigint;
  timestamp: Date;
  blockNumber: number;
  extrinsicHash?: string;
}

interface VotingData {
  votes: VoteData[];
}

export async function handleVotingEvents(ctx: ProcessorContext<Store>): Promise<VotingData> {
  let votes: VoteData[] = [];
  
  for (let block of ctx.blocks) {
    for (let event of block.events) {
      if (event.name === 'ConvictionVoting.Voted') {
        const eventData = event.args;
        if (!eventData) continue;
        
        const timestamp = new Date(block.header.timestamp!);
        const blockHeight = block.header.height;
        
        // Extract the data from the event arguments
        // Format depends on your chain's specific types
        // This is a simplified example
        const pollIndex = Number(eventData.pollIndex);
        const accountId = ss58.codec('polkadot').encode(eventData.voter);
        const vote = eventData.vote;
        
        // In OpenGov, polls are mapped to referenda indexes
        const referendumId = `referendum-${pollIndex}`;
        
        // Parse the vote
        let isAye = false;
        let conviction = 0;
        let balance = 0n;
        
        // The actual vote parsing will depend on your chain's vote format
        // This is a simplified example
        if (vote.hasOwnProperty('Standard')) {
          const standard = vote.Standard;
          isAye = standard.vote?.hasOwnProperty('aye') ? standard.vote.aye : false;
          conviction = standard.vote?.conviction || 0;
          balance = BigInt(standard.balance?.toString() || '0');
        } else if (typeof vote === 'object' && vote !== null) {
          // Another format might be { aye: boolean, conviction: number }
          isAye = vote.aye || false;
          conviction = vote.conviction || 0;
          
          // Or the balance might be a separate argument
          balance = BigInt(eventData.balance?.toString() || '0');
        }
        
        votes.push({
          id: `${event.id}-${accountId}`,
          referendumId,
          voter: accountId,
          isAye,
          conviction,
          balance,
          timestamp,
          blockNumber: blockHeight,
          extrinsicHash: event.extrinsic?.hash,
        });
      }
    }
  }
  
  return { votes };
} 