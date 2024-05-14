import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { CarbonProjects, KyklosContractRegistry, CarbonProjectVintages } from "../typechain-types";
import { ProjectDataStruct } from "../typechain-types/contracts/CarbonProjects";
import { VintageDataStruct } from "../typechain-types/contracts/CarbonProjectVintages";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const initialSetup: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, ethers } = hre;
  const { deployer } = await getNamedAccounts();
  const registryAddress = (await hre.deployments.get("Registry_Proxy")).address;
  const kyklosContractRegistry = await hre.ethers.getContractFactory("KyklosContractRegistry");
  const kyklosContractRegistryFactory = kyklosContractRegistry.attach(registryAddress) as KyklosContractRegistry;

  const carbonProjectsAddress = (await hre.deployments.get("CarbonProjectsP")).address;
  const carbonProjects = await hre.ethers.getContractFactory("CarbonProjects");
  const carbonProjectsFactory = carbonProjects.attach(carbonProjectsAddress) as CarbonProjects;
  const CarbonProjectVintagesAddress = (await hre.deployments.get("CarbonProjectVintagesP")).address;
  const CarbonProjectVintages = await hre.ethers.getContractFactory("CarbonProjectVintages");
  const carbonProjectVintagesFactory = CarbonProjectVintages.attach(
    CarbonProjectVintagesAddress,
  ) as CarbonProjectVintages;

  //   //   set carbon projects address in registry
  await carbonProjectsFactory.setKyklosContractRegistry(registryAddress);
  // Set Registry address
  await kyklosContractRegistryFactory.setCarbonProjectVintagesAddress(CarbonProjectVintagesAddress);
  await kyklosContractRegistryFactory.setCarbonProjectsAddress(carbonProjectsAddress);
  // await kyklosContractRegistry.setCarbonOffsetTokenFactoryAddress(carbonOffsetTokenAddress);
  // await kyklosContractRegistry.setCarbonOffsetTokenAddress(co2TokenAddress);
  // await kyklosContractRegistry.setRetirementCertificatesAddress(retirementCertificatesAddress);
  // await kyklosContractRegistry.setCarbonTokenizerAddress(carbonTokenizerAddress);
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

  const vintage: VintageDataStruct = {
    projectTokenId: "1",
    startTime: 1636422000,
    endTime: 1636512000,
    additionalCertification: "test additional certification",
    uri: "test uri",
    coBenefits: "test co benefits",
    correspAdjustment: "test corresp adjustments details",
    isCCPcompliant: true,
    isCorsiaCompliant: true,
    name: "test name",
    registry: "test registry",
    totalVintageQuantity: ethers.parseEther("0.3"),
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
  carbonProjectVintagesFactory.addNewVintage(deployer, vintage);
  console.log("Vintage added successfully");
};

export default initialSetup;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
initialSetup.tags = ["InitialSetup"];
