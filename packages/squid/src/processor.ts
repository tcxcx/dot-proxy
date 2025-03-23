import { lookupArchive } from "@subsquid/archive-registry";
import {
  BlockHeader,
  DataHandlerContext,
  SubstrateBatchProcessor,
  SubstrateBatchProcessorFields,
  Event as _Event,
  Call as _Call,
  Extrinsic as _Extrinsic,
} from "@subsquid/substrate-processor";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";

export const processor = new SubstrateBatchProcessor()
  .setDataSource({
    archive: lookupArchive("polkadot", { release: "FireSquid" }),
    chain: process.env.RPC_WS || "wss://rpc.polkadot.io",
  })
  .setBlockRange({ from: Number(process.env.BLOCK_START || 0) })
  .addEvent({
    name: ["Balances.Transfer"],
    extrinsic: true,
  })
  // Governance events
  .addEvent({
    name: [
      "Referenda.Submitted",
      "Referenda.DecisionStarted",
      "Referenda.ConfirmStarted",
      "Referenda.ConfirmAborted",
      "Referenda.Confirmed",
      "Referenda.Approved",
      "Referenda.Rejected",
      "Referenda.TimedOut",
      "Referenda.Cancelled",
      "Referenda.Killed",
      "Referenda.SubmissionDeposit",
      "Referenda.DecisionDepositPlaced",
      "Referenda.DecisionDepositRefunded",
      "Referenda.MetadataSet",
      "Referenda.MetadataCleared",
    ],
    extrinsic: true,
  })
  // Voting events
  .addEvent({
    name: ["ConvictionVoting.Voted"],
    extrinsic: true,
  })
  // Proxy events
  .addEvent({
    name: [
      "Proxy.ProxyAdded",
      "Proxy.ProxyRemoved",
      "Proxy.Announced",
      "Proxy.ProxyExecuted",
    ],
    extrinsic: true,
  })
  // Multisig events
  .addEvent({
    name: [
      "Multisig.NewMultisig",
      "Multisig.MultisigApproval",
      "Multisig.MultisigExecuted",
      "Multisig.MultisigCancelled",
    ],
    extrinsic: true,
  })
  .setFields({
    event: {
      args: true,
      extrinsic: {
        hash: true,
        fee: true,
      },
    },
    extrinsic: {
      hash: true,
      fee: true,
    },
    block: {
      timestamp: true,
    },
  });

export type Fields = SubstrateBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Event = _Event<Fields>;
export type Call = _Call<Fields>;
export type Extrinsic = _Extrinsic<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>; 