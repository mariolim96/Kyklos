import {
  Redeemed as RedeemedEvent,
  Deposited as DepositedEvent,
  //   Created as CreatedEvent,
} from '../generated/Pool/Pool';
import { BigInt, log } from '@graphprotocol/graph-ts';
import { PooledKCO2Token, Deposit, Redeem, KCO2Balance, UserPoolBalance, Pool } from '../generated/schema';

export function handleRedeemed(event: RedeemedEvent): void {
  log.info('Redeemed: {}', [`${event.params.amount}`]);
  const amount = event.params.amount;
  const token = event.params.erc20;
  const account = event.params.account;
  const pool = Pool.load(event.address.toHexString());
  if (!pool) {
    log.error('Pool not found', []);
    return;
  }
  const poolTokenId = `${event.address.toHexString()}-${token.toHexString()}`;
  let pooledTokens = PooledKCO2Token.load(poolTokenId);
  if (!pooledTokens) {
    log.error('Pooled tokens not found', []);
    return;
  }
  pooledTokens.amount = pooledTokens.amount.minus(amount);
  if (pooledTokens.amount.lt(BigInt.zero())) {
    log.error('Negative balance detected', []);
    return;
  }
  pooledTokens.save();
  const userPoolBalanceId = `${account.toHexString()}-${event.address.toHexString()}`;
  let userPoolBalance = UserPoolBalance.load(userPoolBalanceId);
  if (!userPoolBalance) {
    log.error('User pool balance not found', []);
    return;
  }
  userPoolBalance.balance = userPoolBalance.balance.minus(amount);
  if (userPoolBalance.balance.lt(BigInt.zero())) {
    log.error('Negative balance detected', []);
    return;
  }
  userPoolBalance.save();
  pool.totalCarbonLocked = pool.totalCarbonLocked.minus(amount);
  pool.save();
  // adjust kco2 balance
  const tokenId = `${account.toHexString()}-${token.toHexString()}`;
  let tokenBalance = KCO2Balance.load(tokenId);
  if (!tokenBalance) {
    log.error('Token balance not found', []);
    return;
  }
  tokenBalance.balance = tokenBalance.balance.plus(amount);
  tokenBalance.save();
  const redeemId = `${event.transaction.hash.toHexString()}-${event.logIndex.toString()}`;
  let redeem = new Redeem(redeemId);
  redeem.amount = amount;
  redeem.timestamp = event.block.timestamp;
  redeem.creator = account.toHexString();
  redeem.pool = event.address.toHexString();
  redeem.token = token.toHexString();
  redeem.save();
  log.info('redeming processed {} {} {} {} {} ', [
    `redeemId: ${redeemId}`,
    `amount: ${amount.toString()}`,
    `timestamp: ${event.block.timestamp.toString()}`,
    `creator: ${account.toHexString()}`,
    `pool: ${event.address.toHexString()}`,
    `token: ${token.toHexString()}`,
  ]);
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
