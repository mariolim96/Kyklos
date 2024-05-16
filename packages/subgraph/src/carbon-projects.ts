import { log } from '@graphprotocol/graph-ts';
import {
  CarbonProjects,
  ProjectIdUpdated as ProjectIdUpdatedEvent,
  ProjectMinted as ProjectMintedEvent,
  ProjectUpdated as ProjectUpdatedEvent,
} from '../generated/CarbonProjects/CarbonProjects';
import { Project, User } from '../generated/schema';

function addUser(userId: string): void {
  let user = User.load(userId);
  if (!user) {
    user = new User(userId);
  }
  user.save();
}

export function handleProjectMinted(event: ProjectMintedEvent): void {
  let project = new Project(`${event.params.tokenId}`);
  const currentCarbonProjects = CarbonProjects.bind(event.address);
  const projectData = currentCarbonProjects.try_getProjectDataByTokenId(event.params.tokenId);
  addUser(`${event.params.receiver.toHexString()}`);
  addUser(`${event.block.author.toHexString()}`);
  if (!projectData.reverted) {
    project.creator = `${event.block.author.toHexString()}`;
    project.owner = `${event.params.receiver.toHexString()}`;
    project.timestamp = event.block.timestamp;
    project.projectId = projectData.value.projectId;
    project.category = projectData.value.category;
    project.standard = projectData.value.standard;
    project.methodology = projectData.value.methodology;
    project.region = projectData.value.region;
    project.storageMethod = projectData.value.storageMethod;
    project.method = projectData.value.method;
    project.emissionType = projectData.value.emissionType;
    project.uri = projectData.value.uri;
    project.save();
  }
  log.info('Project Minted: {}', [`${event.params.tokenId}`]);
}
// export function handleProjectMinted(event: ProjectMintedEvent): void {
//   let entity = new ProjectMinted(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   )
//   entity.receiver = event.params.receiver
//   entity.tokenId = event.params.tokenId

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }

export function handleProjectIdUpdated(event: ProjectIdUpdatedEvent): void {
//   let entity = new ProjectIdUpdated(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   )
//   entity.tokenId = event.params.tokenId

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
}

export function handleProjectUpdated(event: ProjectUpdatedEvent): void {
//   let entity = new ProjectUpdated(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   )
//   entity.tokenId = event.params.tokenId

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
}
