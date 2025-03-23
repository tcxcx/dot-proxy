import * as ss58 from '@subsquid/ss58';
import { ProcessorContext } from '../processor';
import { Store } from '@subsquid/typeorm-store';
import { MultisigCallStatus } from '../model';

interface MultisigData {
  multisig: string;
  threshold: number;
  signatories: string[];
}

interface MultisigCallData {
  id: string;
  blockHash: string;
  timestamp: Date;
  multisig: string;
  callIndex: number;
  status: MultisigCallStatus;
  callData?: string;
  callHash?: string;
  extrinsicHash?: string;
}

interface MultisigHandlerData {
  multisigs: MultisigData[];
  calls: MultisigCallData[];
}

export async function handleMultisigEvents(ctx: ProcessorContext<Store>): Promise<MultisigHandlerData> {
  let multisigs: Map<string, MultisigData> = new Map();
  let calls: MultisigCallData[] = [];
  
  for (let block of ctx.blocks) {
    for (let event of block.events) {
      if (event.name === 'Multisig.NewMultisig') {
        const eventData = event.args;
        if (!eventData) continue;
        
        // Extract the data from the event arguments
        // Format depends on your chain's specific types
        // This is a simplified example
        const approving = ss58.codec('polkadot').encode(eventData.approving);
        const multisigRaw = eventData.multisig;
        const multisig = ss58.codec('polkadot').encode(multisigRaw);
        
        // In a real implementation, we'd need to find the signatories elsewhere
        // For now, we'll just use the approving address as a signatory
        let signatories = [approving];
        
        // If the threshold isn't in the event, we'd need to lookup elsewhere
        // This is a simplified example
        const threshold = eventData.threshold ? Number(eventData.threshold) : 1;
        
        // Add or update the multisig data
        if (!multisigs.has(multisig)) {
          multisigs.set(multisig, {
            multisig,
            threshold,
            signatories,
          });
        } else {
          const existing = multisigs.get(multisig)!;
          if (!existing.signatories.includes(approving)) {
            existing.signatories.push(approving);
          }
        }
        
        // Add the call data
        const callHash = eventData.callHash?.toString();
        
        calls.push({
          id: `${block.header.hash}-${event.indexInBlock}`,
          blockHash: block.header.hash,
          timestamp: new Date(block.header.timestamp!),
          multisig,
          callIndex: event.indexInBlock,
          status: MultisigCallStatus.Proposed,
          callHash,
          extrinsicHash: event.extrinsic?.hash,
        });
      }
      else if (event.name === 'Multisig.MultisigExecuted') {
        const eventData = event.args;
        if (!eventData) continue;
        
        const approving = ss58.codec('polkadot').encode(eventData.approving);
        const multisigRaw = eventData.multisig;
        const multisig = ss58.codec('polkadot').encode(multisigRaw);
        
        calls.push({
          id: `${block.header.hash}-${event.indexInBlock}`,
          blockHash: block.header.hash,
          timestamp: new Date(block.header.timestamp!),
          multisig,
          callIndex: event.indexInBlock,
          status: MultisigCallStatus.Executed,
          callHash: eventData.callHash?.toString(),
          extrinsicHash: event.extrinsic?.hash,
        });
      }
      // Add handlers for other multisig events as needed
    }
  }
  
  return { 
    multisigs: Array.from(multisigs.values()),
    calls 
  };
} 