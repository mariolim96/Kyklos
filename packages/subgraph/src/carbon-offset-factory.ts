import { log } from '@graphprotocol/graph-ts';
import { TokenCreated as TokenCreatedEvent } from '../generated/CarbonOffsetFactory/CarbonOffsetFactory';
import { User, Project, BatchToken, KCO2Token } from '../generated/schema';
import { KyklosCarbonOffsets as beacon } from '../generated/templates';
import {
  KyklosCarbonOffsets,
  Retired as RetiredEvent,
} from '../generated/templates/KyklosCarbonOffsets/KyklosCarbonOffsets';

export function handleTokenCreated(event: TokenCreatedEvent): void {
  const projectVintageId = event.params.vintageTokenId;
  const tokenAddress = event.params.tokenAddress;
  beacon.create(tokenAddress);
  const tk = KyklosCarbonOffsets.bind(tokenAddress);
  const name = tk.name();
  const symbol = tk.symbol();
  const token = new KCO2Token(tokenAddress.toHexString());
  token.projectVintage = projectVintageId.toHexString();
  token.createdAt = event.block.timestamp;
  token.creationTx = event.transaction.hash.toHexString();
  token.creator = event.transaction.from.toHexString();
  token.name = name;
  token.symbol = symbol;
  token.save();
  log.info('Token Created: {}', [`${tokenAddress}`]);
}

export function handleRetired(event: RetiredEvent): void {
  log.info('Retired: {}', [`${(event.params.amount, event.params.eventId)}`]);
}
