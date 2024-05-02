import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { CarbonProjects, KyklosContractRegistry } from "../typechain-types";
import { ProjectDataStruct } from "../typechain-types/contracts/CarbonProjects";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const initialSetup: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const registryAddress = (await hre.deployments.get("Registry_Proxy")).address;
  const kyklosContractRegistry = await hre.ethers.getContractFactory("KyklosContractRegistry");
  kyklosContractRegistry.attach(registryAddress) as KyklosContractRegistry;

  const carbonProjectsAddress = (await hre.deployments.get("CarbonProjects_Proxy")).address;
  const carbonProjects = await hre.ethers.getContractFactory("CarbonProjects");
  const carbonProjectsFactory = carbonProjects.attach(carbonProjectsAddress) as CarbonProjects;
  //   //   set carbon projects address in registry
  await carbonProjectsFactory.setKyklosContractRegistry(registryAddress);

  //   add new project
  const project: ProjectDataStruct = {
    projectId: "test project id",
    standard: "test standard",
    methodology: "test methodology",
    region: "test region",
    storageMethod: "test storage method",
    method: "test method",
    emissionType: "test emission type",
    category: "test category",
    uri: "test uri",
    beneficiary: deployer,
  };
  const transaction = await carbonProjectsFactory.addNewProject(
    deployer,
    project.projectId,
    project.standard,
    project.methodology,
    project.region,
    project.storageMethod,
    project.method,
    project.emissionType,
    project.category,
    project.uri,
    deployer,
  );
  await transaction.wait();
  console.log("Project added successfully");
};

export default initialSetup;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
initialSetup.tags = ["InitialSetup"];
