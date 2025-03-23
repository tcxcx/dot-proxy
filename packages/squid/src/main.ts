import { TypeormDatabase, Store } from "@subsquid/typeorm-store";
import { In } from "typeorm";
import * as ss58 from "@subsquid/ss58";
import assert from "assert";

import { processor, ProcessorContext } from "./processor";
import { Account, Transfer, Referendum, Vote, ProxyAccount, AccountMultisig, MultisigCall, ProxyType, ReferendumStatus, MultisigCallStatus } from "./model";
import { handleTransferEvents } from "./handlers/transfers";
import { handleReferendaEvents } from "./handlers/referenda";
import { handleVotingEvents } from "./handlers/voting";
import { handleProxyEvents } from "./handlers/proxy";
import { handleMultisigEvents } from "./handlers/multisig";

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  // Process transfers
  const transfersData = await handleTransferEvents(ctx);
  
  // Process referenda
  const referendaData = await handleReferendaEvents(ctx);
  
  // Process voting
  const votingData = await handleVotingEvents(ctx);
  
  // Process proxy events
  const proxyData = await handleProxyEvents(ctx);
  
  // Process multisig events
  const multisigData = await handleMultisigEvents(ctx);
  
  // Collect all accounts that need to be created or updated
  const accountIds = new Set<string>();
  
  // Add account IDs from transfers
  transfersData.transfers.forEach(t => {
    accountIds.add(t.from);
    accountIds.add(t.to);
  });
  
  // Add account IDs from referenda
  referendaData.referenda.forEach(r => {
    if (r.proposer) accountIds.add(r.proposer);
  });
  
  // Add account IDs from votes
  votingData.votes.forEach(v => {
    accountIds.add(v.voter);
  });
  
  // Add account IDs from proxies
  proxyData.proxies.forEach(p => {
    accountIds.add(p.delegator);
    accountIds.add(p.delegatee);
  });
  
  // Add account IDs from multisigs
  multisigData.multisigs.forEach(m => {
    accountIds.add(m.multisig);
    m.signatories.forEach(s => accountIds.add(s));
  });
  
  // Find existing accounts
  const accounts = await ctx.store.findBy(Account, { id: In([...accountIds]) }).then(accounts => {
    return new Map(accounts.map(a => [a.id, a]));
  });
  
  // Create missing accounts
  for (const id of accountIds) {
    if (!accounts.get(id)) {
      accounts.set(id, new Account({
        id,
        pubKey: id, // Simplified for now
      }));
    }
  }
  
  // Update multisig properties
  for (const ms of multisigData.multisigs) {
    const account = accounts.get(ms.multisig);
    if (account) {
      account.isMultisig = true;
      account.threshold = ms.threshold;
    }
  }
  
  // Create all entities
  await ctx.store.upsert([...accounts.values()]);
  
  // Create transfers
  await ctx.store.insert(transfersData.transfers.map(t => new Transfer({
    id: t.id,
    blockNumber: t.blockNumber,
    timestamp: t.timestamp,
    extrinsicHash: t.extrinsicHash,
    from: accounts.get(t.from)!,
    to: accounts.get(t.to)!,
    amount: t.amount,
    fee: t.fee || 0n,
  })));
  
  // Create referenda
  await ctx.store.insert(referendaData.referenda.map(r => new Referendum({
    id: r.id,
    index: r.index,
    track: r.track,
    title: r.title,
    description: r.description,
    proposer: r.proposer ? accounts.get(r.proposer)! : undefined,
    status: r.status as ReferendumStatus,
    submitted: r.submitted,
    depositAmount: r.depositAmount,
    endsAt: r.endsAt,
    ayeVotes: r.ayeVotes || 0n,
    nayVotes: r.nayVotes || 0n,
    preimageHash: r.preimageHash,
    blockNumber: r.blockNumber,
    extrinsicHash: r.extrinsicHash,
  })));
  
  // Create votes
  await ctx.store.insert(votingData.votes.map(v => new Vote({
    id: v.id,
    referendum: { id: v.referendumId } as Referendum,
    voter: accounts.get(v.voter)! as Account,
    isAye: v.isAye,
    conviction: v.conviction,
    balance: v.balance,
    timestamp: v.timestamp,
    blockNumber: v.blockNumber,
    extrinsicHash: v.extrinsicHash,
  })));
  
  // Create proxy accounts
  await ctx.store.insert(proxyData.proxies.map(p => new ProxyAccount({
    id: p.id,
    delegator: accounts.get(p.delegator)! as Account,
    delegatee: accounts.get(p.delegatee)! as Account,
    type: p.type as ProxyType,
    delay: p.delay,
    createdAt: p.createdAt,
    extrinsicIndex: p.extrinsicIndex,
    creationBlockNumber: p.creationBlockNumber,
  })));
  
  // Create multisig accounts
  for (const ms of multisigData.multisigs) {
    const multisigAccount = accounts.get(ms.multisig)!;
    for (const signatory of ms.signatories) {
      await ctx.store.insert(new AccountMultisig({
        id: `${ms.multisig}-${signatory}`,
        multisig: multisigAccount as Account,
        signatory: accounts.get(signatory)! as Account,
      }));
    }
  }
  
  // Create multisig calls
  await ctx.store.insert(multisigData.calls.map(c => new MultisigCall({
    id: c.id,
    blockHash: c.blockHash,
    timestamp: c.timestamp,
    multisig: accounts.get(c.multisig)! as Account,
    callIndex: c.callIndex,
    status: c.status as MultisigCallStatus,
    callData: c.callData,
    callHash: c.callHash,
    extrinsicHash: c.extrinsicHash,
  })));
}); 