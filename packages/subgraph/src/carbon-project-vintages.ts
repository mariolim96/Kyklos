import { log } from '@graphprotocol/graph-ts';
import {
  CarbonProjectVintages,
  ProjectVintageMinted as ProjectVintageMintedEvent,
  ProjectVintageUpdated as ProjectVintageUpdatedEvent,
} from '../generated/CarbonProjectVintages/CarbonProjectVintages';
import { ProjectVintage, User, Project } from '../generated/schema';
import { CarbonProjects } from '../generated/CarbonProjects/CarbonProjects';
function addUser(userId: string): void {
  let user = User.load(userId);
  if (!user) {
    user = new User(userId);
  }
  user.save();
}
export function handleProjectVintageMinted(event: ProjectVintageMintedEvent): void {
  let projectVintage = new ProjectVintage(`${event.params.tokenId}`);
  const currentCarbonProjectVintages = CarbonProjectVintages.bind(event.address);
  const res = currentCarbonProjectVintages.try_getProjectVintageDataByTokenId(event.params.tokenId);
  addUser(`${event.params.receiver.toHexString()}`);
  addUser(`${event.block.author.toHexString()}`);
  const currentCarbonProjects = Project.load(`${res.value.projectTokenId}`);
  const projectVintageData = res.value;
  if (!res.reverted && currentCarbonProjects) {
    projectVintage.creator = `${event.block.author.toHexString()}`;
    projectVintage.owner = `${event.params.receiver.toHexString()}`;
    projectVintage.timestamp = event.block.timestamp;
    projectVintage.tx = event.transaction.hash.toHexString();
    projectVintage.name = projectVintageData.name;
    projectVintage.startTime = projectVintageData.startTime;
    projectVintage.endTime = projectVintageData.endTime;
    projectVintage.project = `${projectVintageData.projectTokenId}`;
    projectVintage.totalVintageQuantity = projectVintageData.totalVintageQuantity;
    projectVintage.isCCCompliant = projectVintageData.isCCPcompliant;
    projectVintage.coBenefits = projectVintageData.coBenefits;
    projectVintage.corresAdjustment = projectVintageData.correspAdjustment;
    projectVintage.isCorsiaCompliant = projectVintageData.isCorsiaCompliant;
    projectVintage.additionalCertification = projectVintageData.additionalCertification;
    projectVintage.save();
    log.debug('Project Vintage Minted: {}', [`${event.params.tokenId}`]);
    currentCarbonProjects.save();
    return;
  }
  log.debug('Project Vintage not Minted: {}', [`${event.params.tokenId}`]);
}

export function handleProjectVintageUpdated(
  event: ProjectVintageUpdatedEvent
): void {
//   let entity = new ProjectVintageUpdated(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   )
//   entity.tokenId = event.params.tokenId

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
}