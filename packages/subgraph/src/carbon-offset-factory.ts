import { log } from '@graphprotocol/graph-ts';
import { TokenCreated as TokenCreatedEvent } from '../generated/CarbonOffsetFactory/CarbonOffsetFactory';
import { User, Project, BatchToken, KCO2Token } from '../generated/schema';

export function handleTokenCreated(event: TokenCreatedEvent): void {
    const projectVintageId = event.params.vintageTokenId;
    const tokenAddress = event.params.tokenAddress;
    const token = new KCO2Token(tokenAddress.toHexString());
    token.projectVintage = projectVintageId.toHexString();
    token.createdAt = event.block.timestamp;
    token.creationTx = event.transaction.hash.toHexString();
    token.creator = event.transaction.from.toHexString();
    token.save();
    log.info('Token Created: {}', [`${tokenAddress}`]);
//   let batchToken = new BatchToken(event.params.tokenId.toHexString());
//   batchToken.owner = event.params.owner.toHexString();
//   batchToken.timestamp = event.block.timestamp;
//   batchToken.tx = event.transaction.hash.toHexString();
//   batchToken.save();
//   log.debug('Batch Token Minted: {}', [`${event.params.tokenId}`]);
}
