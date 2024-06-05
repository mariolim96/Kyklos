import { log } from '@graphprotocol/graph-ts';
import { TokenCreated as TokenCreatedEvent } from '../generated/CarbonOffsetFactory/CarbonOffsetFactory';
import { User, KCO2Token, ProjectVintage, KCO2Balance, Retirement } from '../generated/schema';
import { KyklosCarbonOffsets as beacon } from '../generated/templates';
import {
  KyklosCarbonOffsets,
  Retired as RetiredEvent,
} from '../generated/templates/KyklosCarbonOffsets/KyklosCarbonOffsets';
function addUser(userId: string): void {
  let user = User.load(userId);
  if (!user) {
    user = new User(userId);
  }
  user.save();
}
export function handleTokenCreated(event: TokenCreatedEvent): void {
  const projectVintageId = event.params.vintageTokenId;
  const tokenAddress = event.params.tokenAddress;
  beacon.create(tokenAddress);
  const tk = KyklosCarbonOffsets.bind(tokenAddress);
  const name = tk.name();
  const symbol = tk.symbol();
  const token = new KCO2Token(tokenAddress.toHexString());
  token.projectVintage = projectVintageId.toString();
  token.createdAt = event.block.timestamp;
  token.creationTx = event.transaction.hash.toHexString();
  token.creator = event.transaction.from.toHexString();
  token.name = name;
  token.symbol = symbol;
  token.save();
  // open vintage and insert token
  const projectVintage = ProjectVintage.load(`${projectVintageId}`);
  if (!projectVintage) {
    log.critical('Project Vintage not found: {}', [`${projectVintageId}`]);
    return;
  }
  projectVintage.kco2Token = tokenAddress.toHexString();
  projectVintage.save();
  log.info('Token Created: {}', [`${tokenAddress}`]);
}

export function handleRetired(event: RetiredEvent): void {
  log.info('Retired: {}', [`${(event.params.amount, event.params.eventId)}`]);
  const amount = event.params.amount;
  const eventId = event.params.eventId;
  const sender = event.params.sender;
  //   const pv = event.params.projectVintageTokenId;
  const tokenAddress = event.address;
  let KcoBalance = KCO2Balance.load(`${sender.toHexString()}-${tokenAddress.toHexString()}`);
  addUser(`${sender.toHexString()}`);
  const Token = KCO2Token.load(tokenAddress.toHexString());
  if (Token === null) {
    log.critical('Token not found: {}', [`${tokenAddress.toHexString()}`]);
    return;
  }
  const retirement = new Retirement(`${eventId}`);
  retirement.creationTx = event.transaction.hash.toHexString();
  retirement.amount = amount;
  retirement.timestamp = event.block.timestamp;
  retirement.creator = sender.toHexString();
  retirement.token = tokenAddress.toHexString();
  retirement.eventId = eventId;
  retirement.save();
  if (KcoBalance === null) {
    // create a new balance
    const KcoBalance = new KCO2Balance(`${sender.toHexString()}-${tokenAddress.toHexString()}`);
    KcoBalance.balance = amount;
    KcoBalance.user = sender.toHexString();
    KcoBalance.token = event.address.toHexString();
    KcoBalance.save();
    Token.save();
    return;
  }
  KcoBalance.balance = KcoBalance.balance.minus(amount);
  KcoBalance.save();
  Token.save();
}
