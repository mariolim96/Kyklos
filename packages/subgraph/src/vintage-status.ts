import { log } from '@graphprotocol/graph-ts';
import {
  Tokenized as TokenizedEvent,
  BatchMinted as BatchMintedEvent,
  VintageStatus,
} from '../generated/VintageStatus/VintageStatus';
import { User, BatchToken, ProjectVintage } from '../generated/schema';

function addUser(userId: string): void {
  let user = User.load(userId);
  if (!user) {
    user = new User(userId);
  }
  user.save();
}

export function handleTokenized(event: TokenizedEvent): void {}

export function handleBatchMinted(event: BatchMintedEvent): void {
  const owner = `${event.params.sender.toHexString()}`;
  let batchToken = new BatchToken(`${event.params.tokenId}`);
  const currentVintageStatus = VintageStatus.bind(event.address);
  const batchTokenData = currentVintageStatus.try_getBatchNFTData(event.params.tokenId);
  addUser(`${owner}`);
  addUser(`${event.block.author.toHexString()}`);
  // LOAD VINTAGE
  if (!batchTokenData.reverted) {
    let vintage = ProjectVintage.load(`${batchTokenData.value.value0}`);
    if (!vintage) {
      log.critical('Vintage not found: {}', [`${batchTokenData.value.value0}`]);
      return;
    }
    batchToken.creator = `${event.block.author.toHexString()}`;
    batchToken.owner = `${owner}`;
    batchToken.timestamp = event.block.timestamp;
    batchToken.vintage = `${batchTokenData.value.value0}`;
    batchToken.status = `${batchTokenData.value.value2}`;
    batchToken.tx = event.transaction.hash.toHexString();
    batchToken.save();
    vintage.save();
    log.info('Batch Minted: {}', [`${event.params.tokenId}`]);
  }
}
