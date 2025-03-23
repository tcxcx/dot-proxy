import * as ss58 from '@subsquid/ss58';
import assert from 'assert';
import { ProcessorContext } from '../processor';
import { Store } from '@subsquid/typeorm-store';

interface TransferEvent {
  id: string;
  blockNumber: number;
  timestamp: Date;
  extrinsicHash?: string;
  from: string;
  to: string;
  amount: bigint;
  fee?: bigint;
}

interface TransferData {
  transfers: TransferEvent[];
}

export async function handleTransferEvents(ctx: ProcessorContext<Store>): Promise<TransferData> {
  let transfers: TransferEvent[] = [];
  
  for (let block of ctx.blocks) {
    for (let event of block.events) {
      if (event.name === 'Balances.Transfer') {
        assert(block.header.timestamp, `Got an undefined timestamp at block ${block.header.height}`);
        
        // The format will depend on your chain's specific types
        // This is a simplified example
        const eventData = event.args;
        if (!eventData) continue;
        
        const from = ss58.codec('polkadot').encode(eventData.from);
        const to = ss58.codec('polkadot').encode(eventData.to);
        const amount = BigInt(eventData.amount.toString());
        
        transfers.push({
          id: event.id,
          blockNumber: block.header.height,
          timestamp: new Date(block.header.timestamp),
          extrinsicHash: event.extrinsic?.hash,
          from,
          to,
          amount,
          fee: event.extrinsic?.fee ? BigInt(event.extrinsic.fee.toString()) : 0n,
        });
      }
    }
  }
  
  return { transfers };
} 