import {
  Redeemed as RedeemedEvent,
  Deposited as DepositedEvent,
  //   Created as CreatedEvent,
} from '../generated/Pool/Pool';
import { BigInt, log } from '@graphprotocol/graph-ts';
import { PooledKCO2Token, Deposit, Redeem, KCO2Balance, UserPoolBalance, Pool } from '../generated/schema';

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
  const userPoolBalanceId = `${tokenOwner}-${event.address.toHexString()}`;
  const poolTokenId = `${event.address.toHexString()}-${tokenAddress}`;
  // verify if pool exists
  let pool = Pool.load(event.address.toHexString());
  if (!pool) {
    pool = new Pool(event.address.toHexString());
    pool.totalCarbonLocked = BigInt.zero();
  }

  log.info('Token ID: {}', [tokenId]);
  let tokenBalance = KCO2Balance.load(tokenId);
  if (!tokenBalance) {
    // tokenBalance = new KCO2Balance(tokenId);
    // tokenBalance.balance = new BigInt(0)
    log.error('Token balance not found', []);
    return;
  }
  // Update pooledTokens entity
  let pooledTokens = PooledKCO2Token.load(poolTokenId);
  if (!pooledTokens) {
    pooledTokens = new PooledKCO2Token(poolTokenId);
    pooledTokens.poolAddress = event.address.toHexString();
    pooledTokens.token = tokenAddress;
    pooledTokens.amount = event.params.amount;
  } else {
    pooledTokens.amount = pooledTokens.amount.plus(event.params.amount);
  }
  pooledTokens.save();
  // Update userPoolBalance entity
  let userPoolBalance = UserPoolBalance.load(userPoolBalanceId);
  if (!userPoolBalance) {
    userPoolBalance = new UserPoolBalance(userPoolBalanceId);
    userPoolBalance.user = tokenOwner;
    userPoolBalance.pool = event.address.toHexString();
    userPoolBalance.balance = event.params.amount;
  } else {
    userPoolBalance.balance = userPoolBalance.balance.plus(event.params.amount);
  }
  userPoolBalance.save();
  tokenBalance.balance = tokenBalance.balance.minus(event.params.amount);
  if (tokenBalance.balance.lt(BigInt.zero())) {
    log.error('Negative balance detected', []);
    return;
  }
  tokenBalance.save();

  const depositId = `${event.transaction.hash.toHexString()}-${event.logIndex.toString()}`;
  let deposit = new Deposit(depositId);
  deposit.amount = event.params.amount;
  deposit.timestamp = event.block.timestamp;
  deposit.creator = tokenOwner;
  deposit.pool = event.address.toHexString();
  deposit.token = tokenAddress; // Assuming tokenAddress denotes the KCO2Token
  pool.totalCarbonLocked = pool.totalCarbonLocked.plus(event.params.amount);
  deposit.save();
  pool.save();

  log.info('Transaction processed', []);
}
// export function handleCreated(event: CreatedEvent): void {
//   log.info('Created: {}', [`${event.params.name}`]);
//   const tokenAddress = event.params.poolAddress.toHexString();
//   const pool = new Pool(tokenAddress);
//   pool.name = event.params.name;
//   pool.amount = BigInt.zero();
//   pool.save();
// }
