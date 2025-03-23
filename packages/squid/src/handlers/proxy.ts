import * as ss58 from '@subsquid/ss58';
import { ProcessorContext } from '../processor';
import { Store } from '@subsquid/typeorm-store';
import { ProxyType } from '../model';

interface ProxyData {
  id: string;
  delegator: string;
  delegatee: string;
  type: ProxyType;
  delay: number;
  createdAt: Date;
  extrinsicIndex?: number;
  creationBlockNumber: number;
}

interface ProxyHandlerData {
  proxies: ProxyData[];
}

export async function handleProxyEvents(ctx: ProcessorContext<Store>): Promise<ProxyHandlerData> {
  let proxies: ProxyData[] = [];
  
  for (let block of ctx.blocks) {
    for (let event of block.events) {
      if (event.name === 'Proxy.ProxyAdded') {
        const eventData = event.args;
        if (!eventData) continue;
        
        const timestamp = new Date(block.header.timestamp!);
        const blockHeight = block.header.height;
        
        // Extract the data from the event arguments
        // Format depends on your chain's specific types
        // This is a simplified example
        const delegator = ss58.codec('polkadot').encode(eventData.delegator);
        const delegatee = ss58.codec('polkadot').encode(eventData.delegate);
        let proxyType = ProxyType.Any; // Default
        
        // Parse the proxy type from the event
        // This is a simplified example
        if (eventData.proxyType) {
          if (eventData.proxyType === 'Governance' || eventData.proxyType === 1) {
            proxyType = ProxyType.Governance;
          } else if (eventData.proxyType === 'NonTransfer' || eventData.proxyType === 2) {
            proxyType = ProxyType.NonTransfer;
          }
          // Add more proxy type mappings as needed
        }
        
        const delay = Number(eventData.delay || 0);
        
        proxies.push({
          id: `${delegator}-${delegatee}-${proxyType}`,
          delegator,
          delegatee,
          type: proxyType,
          delay,
          createdAt: timestamp,
          extrinsicIndex: event.extrinsic?.indexInBlock,
          creationBlockNumber: blockHeight,
        });
      }
    }
  }
  
  return { proxies };
} 