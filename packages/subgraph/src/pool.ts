import {
  Redeemed as RedeemedEvent,
  Deposited as DepositedEvent,
  Created as CreatedEvent,
} from '../generated/Pool/Pool';
import { BigInt, bigInt, log } from '@graphprotocol/graph-ts';
import { PooledKCO2Token, Deposit, Redeem, KCO2Balance, Pool } from '../generated/schema';

export function handleRedeemed(event: RedeemedEvent): void {
  log.info('Redeemed: {}', [`${event.params.amount}`]);
}
export function handleDeposited(event: DepositedEvent): void {
  log.info('Deposited: {}', [`${event.transaction.hash.toHexString()}`]);

  // Ensure all data is non-null
  if (!event.params.amount || !event.block.timestamp || !event.transaction.from || !event.address) {
    log.error('Null value detected in event parameters', []);
    return; // Exit the function to avoid saving incomplete data
  }

  const tokenOwner = event.transaction.from.toHexString();
  const tokenAddress = event.params.erc20Addr.toHexString();
  const tokenId = `${tokenOwner}-${tokenAddress}`;
  log.info('Token ID: {}', [tokenId]);
  let tokenBalance = KCO2Balance.load(tokenId);
  if (!tokenBalance) {
    // tokenBalance = new KCO2Balance(tokenId);
    // tokenBalance.balance = new BigInt(0)
    log.error('Token balance not found', []);
    return;
  }
  tokenBalance.balance = tokenBalance.balance.minus(event.params.amount);
  tokenBalance.save();

  const depositId = `${event.transaction.hash.toHexString()}-${event.logIndex.toString()}`;
  let deposit = new Deposit(depositId);
  deposit.amount = event.params.amount;
  deposit.timestamp = event.block.timestamp;
  deposit.creator = tokenOwner;
  deposit.pool = event.address.toHexString();
  deposit.token = tokenAddress; // Assuming tokenAddress denotes the KCO2Token
  deposit.save();

  log.info('Transaction processed', []);
}
export function handleCreated(event: CreatedEvent): void {
  log.info('Created: {}', [`${event.params.name}`]);
  const tokenAddress = event.params.poolAddress.toHexString();
  const pool = new Pool(tokenAddress);
  pool.name = event.params.name;
  pool.amount = BigInt.zero();
  pool.save();
}
