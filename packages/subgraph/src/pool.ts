import { Redeemed as RedeemedEvent, Deposited as DepositedEvent } from '../generated/Pool/Pool';
import { log } from '@graphprotocol/graph-ts';
import { PooledKCO2Token, Deposit, Redeem } from '../generated/schema';

export function handleRedeemed(event: RedeemedEvent): void {
  log.info('Redeemed: {}', [`${event.params.amount}`]);
}
export function handleDeposited(event: DepositedEvent): void {
  //   let deposit = new Deposit(event.transaction.hash.toHexString());
  //   deposit.amount = event.params.amount;
  //   deposit.timestamp = event.block.timestamp;
  //   deposit.creator = event.transaction.from.toHexString();
  //   deposit.save();
  log.info('Deposited: {}', [`${event.params.amount}`]);
}
