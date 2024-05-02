import { log } from '@graphprotocol/graph-ts';
import { Project, User } from '../generated/schema';
import { CarbonProjects, ProjectMinted } from '../generated/CarbonProjects/CarbonProjects';

function addUser(userId: string): void {
  let user = User.load(userId);
  if (!user) {
    user = new User(userId);
  }
  user.save();
}

export function handleProjectMinted(event: ProjectMinted): void {
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
