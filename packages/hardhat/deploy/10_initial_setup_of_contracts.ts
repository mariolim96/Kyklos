import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import {
  CarbonProjects,
  KyklosContractRegistry,
  CarbonProjectVintages,
  KyklosCarbonOffsetsFactory,
  VintageStatus,
  RetirementCertificates,
  KyklosCarbonOffsets,
} from "../typechain-types";
import { ProjectDataStruct } from "../typechain-types/contracts/CarbonProjects";
import { VintageDataStruct } from "../typechain-types/contracts/CarbonProjectVintages";
import { Contract } from "ethers";
import { CreateRetirementRequestParamsStruct } from "../typechain-types/contracts/RetirementCertificates";

const initialSetup: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, ethers, deployments } = hre;
  const { deployer } = await getNamedAccounts();

  // Get addresses from deployed contracts
  const registryAddress = (await deployments.get("Registry_Proxy")).address;
  const carbonProjectsAddress = (await deployments.get("CarbonProjectsP")).address;
  const carbonProjectVintagesAddress = (await deployments.get("CarbonProjectVintagesP")).address;
  const vintageStatusAddress = (await deployments.get("VintageStatusP")).address;
  const carbonOffsetFactoryAddress = (await deployments.get("CarbonOffsetFactoryP")).address;
  const RetirementCertificatesAddress = (await deployments.get("RetirementCertificatesP")).address;
  const carbonOffsetTokenAddress = (await deployments.get("CarbonOffset")).address;
  // Attach to contract factories
  const kyklosContractRegistry = (await ethers.getContractAt(
    "KyklosContractRegistry",
    registryAddress,
  )) as KyklosContractRegistry;
  const carbonProjectsFactory = (await ethers.getContractAt("CarbonProjects", carbonProjectsAddress)) as CarbonProjects;
  const carbonProjectVintagesFactory = (await ethers.getContractAt(
    "CarbonProjectVintages",
    carbonProjectVintagesAddress,
  )) as CarbonProjectVintages;

  const carbonOffsetFactory = (await ethers.getContractAt(
    "KyklosCarbonOffsetsFactory",
    carbonOffsetFactoryAddress,
  )) as KyklosCarbonOffsetsFactory;

  const vintageStatus = (await ethers.getContractAt("VintageStatus", vintageStatusAddress)) as VintageStatus;

  const retirementCertificates = (await ethers.getContractAt(
    "RetirementCertificates",
    RetirementCertificatesAddress,
  )) as RetirementCertificates;
  // Set up registry links
  try {
    await (await kyklosContractRegistry.setCarbonProjectsAddress(carbonProjectsAddress)).wait();
    await (await kyklosContractRegistry.setCarbonProjectVintagesAddress(carbonProjectVintagesAddress)).wait();
    await (await kyklosContractRegistry.setVintageStatusAddress(vintageStatusAddress)).wait();
    await (await kyklosContractRegistry.setKyklosCarbonOffsetsFactoryAddress(carbonOffsetFactoryAddress)).wait();
    await (await kyklosContractRegistry.setRetirementCertificatesAddress(RetirementCertificatesAddress)).wait();

    // Set registry in individual contracts
    await (await carbonProjectsFactory.setKyklosContractRegistry(registryAddress)).wait();
    await (await carbonProjectVintagesFactory.setKyklosContractRegistry(registryAddress)).wait();
    await (await carbonOffsetFactory.setKyklosContractRegistry(registryAddress)).wait();
    await (await vintageStatus.setKyklosContractRegistry(registryAddress)).wait();
    // await (await carbonOffset.setKyklosContractRegistry(registryAddress)).wait();
    await (await retirementCertificates.setKyklosContractRegistry(registryAddress)).wait();

    // set carbon offset token beacon address in registry
    await carbonOffsetFactory.setBeacon(carbonOffsetTokenAddress);
    console.log("Registry setup completed successfully");
  } catch (error) {
    console.error("Failed to set registry addresses:", error);
    throw new Error("Deployment failed during registry setup.");
  }

  // Add a new project
  try {
    const project: ProjectDataStruct = {
      projectId: "test project id",
      standard: "Kyklos",
      methodology: "test methodology",
      region: "test region",
      storageMethod: "test storage method",
      method: "test method",
      emissionType: "test emission type",
      category: "test category",
      uri: "test uri",
      beneficiary: deployer,
    };

    const projectTx = await carbonProjectsFactory.addNewProject(
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
    await projectTx.wait();
    console.log("Project added successfully");
  } catch (error) {
    console.error("Failed to add project:", error);
    throw new Error("Deployment failed during project addition.");
  }

  const vintage: VintageDataStruct = {
    projectTokenId: 1, // Assuming this should be a number, not a string
    startTime: 1636422000,
    endTime: 1636512000,
    additionalCertification: "test additional certification",
    uri: "test uri",
    coBenefits: "test co benefits",
    correspAdjustment: "test corresp adjustments details",
    isCCPcompliant: true,
    isCorsiaCompliant: true,
    name: "test name",
    registry: "Kyklos",
    totalVintageQuantity: 2000000000000000000n, // means 2 tonne
  };
  const vintage2: VintageDataStruct = {
    projectTokenId: 1, // Assuming this should be a number, not a string
    startTime: 1736422000,
    endTime: 1738512000,
    additionalCertification: "test additional certification",
    uri: "test uri",
    coBenefits: "test co benefits",
    correspAdjustment: "test corresp adjustments details",
    isCCPcompliant: true,
    isCorsiaCompliant: true,
    name: "test name",
    registry: "Kyklos",
    totalVintageQuantity: 1000000000000000000n, // means 1 tonne
  };
  // Add a new vintage
  try {
    const vintageTx = await carbonProjectVintagesFactory.addNewVintage(deployer, vintage);
    await vintageTx.wait();
    const vintageTx2 = await carbonProjectVintagesFactory.addNewVintage(deployer, vintage2);
    await vintageTx2.wait();
    // deploy the token associated with the vintage
    const tokenTx = await carbonOffsetFactory.deployFromVintage(1);
    await tokenTx.wait();
    const tokenTx2 = await carbonOffsetFactory.deployFromVintage(2);
    await tokenTx2.wait();
    console.log("Vintage added successfully");
  } catch (error) {
    console.error("Failed to add vintage:", error);
    throw new Error("Deployment failed during vintage addition.");
  }

  // adding a vintage status
  try {
    let vintageStatusTx = await vintageStatus.mintBatch(deployer, 1, vintage.totalVintageQuantity);
    await vintageStatusTx.wait();
    vintageStatusTx = await vintageStatus.mintBatch(deployer, 2, vintage2.totalVintageQuantity);
    await vintageStatusTx.wait();
    console.log("Vintage status added successfully");
  } catch (error) {
    console.error("Failed to add vintage status:", error);
    throw new Error("Deployment failed during vintage status addition.");
  }

  // fractionalize a vintage status
  try {
    const fractionalizeTx = await vintageStatus.fractionalize(1);
    await fractionalizeTx.wait();
    // get token by project id into carbon offset factory
    const token = await carbonOffsetFactory.pvIdtoERC20(1);
    // attach the token address to carbon offset token and retire half of the token
    const carbonOffsetToken = (await ethers.getContractAt("KyklosCarbonOffsets", token)) as Contract &
      KyklosCarbonOffsets;
    const certificateData: CreateRetirementRequestParamsStruct = {
      amount: 1000000000000000000n,
      beneficiary: deployer,
      beneficiaryLocation: "test location",
      beneficiaryString: "test beneficiary string",
      consumptionCountryCode: "test consumption country code",
      consumptionPeriodEnd: 0,
      consumptionPeriodStart: 0,
      retirementMessage: "test retirement message",
      retiringEntityString: "test retiring entity string",
      tokenIds: [1],
    };
    console.log("Vintage status fractionalized successfully");
    const retireTx = await carbonOffsetToken.retireAndMintCertificate(
      certificateData.retiringEntityString,
      certificateData.beneficiary,
      certificateData.beneficiaryString,
      certificateData.retirementMessage,
      certificateData.amount,
    );
    await retireTx.wait();
    console.log("Token retired successfully");
  } catch (error) {
    console.error("Failed to fractionalize vintage status:", error);
    throw new Error("Deployment failed during vintage status fractionalization.");
  }
};

export default initialSetup;
initialSetup.tags = ["InitialSetup"];
