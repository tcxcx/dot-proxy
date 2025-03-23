import * as ss58 from '@subsquid/ss58';
import { ProcessorContext } from '../processor';
import { Store } from '@subsquid/typeorm-store';
import { ReferendumStatus } from '../model';

interface ReferendumData {
  id: string;
  index: number;
  track?: number;
  title?: string;
  description?: string;
  proposer?: string;
  status: ReferendumStatus;
  submitted: Date;
  depositAmount?: bigint;
  endsAt?: Date;
  ayeVotes?: bigint;
  nayVotes?: bigint;
  preimageHash?: string;
  blockNumber: number;
  extrinsicHash?: string;
}

interface ReferendaData {
  referenda: ReferendumData[];
}

export async function handleReferendaEvents(ctx: ProcessorContext<Store>): Promise<ReferendaData> {
  let referenda: Map<string, ReferendumData> = new Map();
  
  for (let block of ctx.blocks) {
    for (let event of block.events) {
      if (event.name.startsWith('Referenda.')) {
        const eventData = event.args;
        if (!eventData) continue;
        
        const blockHeight = block.header.height;
        const timestamp = new Date(block.header.timestamp!);
        
        // Handle Submitted event
        if (event.name === 'Referenda.Submitted') {
          const refIndex = Number(eventData.index);
          const proposerRaw = eventData.who || eventData.proposer;
          const proposer = proposerRaw ? ss58.codec('polkadot').encode(proposerRaw) : undefined;
          
          const referendumId = `referendum-${refIndex}`;
          
          referenda.set(referendumId, {
            id: referendumId,
            index: refIndex,
            track: eventData.track ? Number(eventData.track) : undefined,
            proposer,
            status: ReferendumStatus.Submitted,
            submitted: timestamp,
            blockNumber: blockHeight,
            extrinsicHash: event.extrinsic?.hash,
          });
        }
        // Handle Approved event
        else if (event.name === 'Referenda.Approved') {
          const refIndex = Number(eventData.index);
          const referendumId = `referendum-${refIndex}`;
          
          const existing = referenda.get(referendumId);
          if (existing) {
            existing.status = ReferendumStatus.Approved;
          } else {
            referenda.set(referendumId, {
              id: referendumId,
              index: refIndex,
              status: ReferendumStatus.Approved,
              submitted: timestamp, // We don't know the actual submission time
              blockNumber: blockHeight,
              extrinsicHash: event.extrinsic?.hash,
            });
          }
        }
        // Handle Rejected event
        else if (event.name === 'Referenda.Rejected') {
          const refIndex = Number(eventData.index);
          const referendumId = `referendum-${refIndex}`;
          
          const existing = referenda.get(referendumId);
          if (existing) {
            existing.status = ReferendumStatus.Rejected;
          } else {
            referenda.set(referendumId, {
              id: referendumId,
              index: refIndex,
              status: ReferendumStatus.Rejected,
              submitted: timestamp, // We don't know the actual submission time
              blockNumber: blockHeight,
              extrinsicHash: event.extrinsic?.hash,
            });
          }
        }
        // Handle other events (add more as needed)
        // ...
      }
      
      // Handle metadata events to update title and description
      if (event.name === 'Referenda.MetadataSet') {
        const eventData = event.args;
        if (!eventData) continue;
        
        const refIndex = Number(eventData.index);
        const referendumId = `referendum-${refIndex}`;
        
        // In a real implementation, you would decode the metadata
        // This is simplified
        const existing = referenda.get(referendumId);
        if (existing) {
          // In a real implementation, you would parse the metadata to extract title and description
          existing.title = `Referendum #${refIndex}`;
          existing.description = `Description for referendum #${refIndex}`;
        }
      }
    }
  }
  
  return { referenda: Array.from(referenda.values()) };
} 