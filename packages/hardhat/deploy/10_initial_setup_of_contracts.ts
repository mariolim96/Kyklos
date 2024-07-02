/* eslint-disable @typescript-eslint/no-unused-vars */
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
  Pool,
  PoolFilter,
} from "../typechain-types";
import { ProjectDataStruct } from "../typechain-types/contracts/CarbonProjects";
import { VintageDataStruct } from "../typechain-types/contracts/CarbonProjectVintages";
import { BigNumberish, Contract } from "ethers";
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
  const carbonOffsetTokenBeaconAddress = (await deployments.get("KyklosCarbonOffsets")).address;
  const poolAddress = (await deployments.get("PoolP")).address;
  const poolFilterAddress = (await deployments.get("PoolFilterP")).address;
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

  const pool = (await ethers.getContractAt("Pool", poolAddress)) as Contract & Pool;
  const poolFilter = (await ethers.getContractAt("PoolFilter", poolFilterAddress)) as Contract & PoolFilter;
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
    await (await retirementCertificates.setKyklosContractRegistry(registryAddress)).wait();
    await (await poolFilter.setKyklosContractRegistry(registryAddress)).wait();
    await (await pool.setFilter(poolFilterAddress)).wait();
    await carbonOffsetFactory.setBeacon(carbonOffsetTokenBeaconAddress);
    const number: BigNumberish = 100000000000000000000000000n;
    await (await pool.setSupplyCap(number)).wait();
    console.log("Registry setup completed successfully");
  } catch (error) {
    console.error("Failed to set registry addresses:", error);
    throw new Error("Deployment failed during registry setup.");
  }

  // Add a new project
  try {
    const project: ProjectDataStruct = {
      projectId: "carbon project 002",
      standard: "Kyklos",
      methodology: "Renewable Energy",
      region: "India",
      storageMethod: "Solar Power",
      method: "Field Data Collection",
      emissionType: "CO2",
      category: "Energy",
      uri: "https://goldstandard.org/project2",
      beneficiary: deployer,
    };

    const project1: ProjectDataStruct = {
      projectId: "carbon project 003",
      standard: "Kyklos",
      methodology: "Methane Capture",
      region: "United States",
      storageMethod: "Landfill Gas",
      method: "Continuous Monitoring",
      emissionType: "CH4",
      category: "Waste Management",
      uri: "https://americancarbonregistry.org/project3",
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
    const projectTx1 = await carbonProjectsFactory.addNewProject(
      deployer,
      project1.projectId,
      project1.standard,
      project1.methodology,
      project1.region,
      project1.storageMethod,
      project1.method,
      project1.emissionType,
      project1.category,
      project1.uri,
      deployer,
    );
    await projectTx1.wait();

    console.log("Project added successfully");
  } catch (error) {
    console.error("Failed to add project:", error);
    throw new Error("Deployment failed during project addition.");
  }

  const vintage: VintageDataStruct = {
    projectTokenId: 1,
    startTime: 1609459200, // Corresponds to January 1, 2021
    endTime: 1612137600, // Corresponds to February 1, 2021
    additionalCertification: "ISO 14064-2:2019",
    uri: "https://example.com/vintage100",
    coBenefits: "Biodiversity enhancement, local employment",
    correspAdjustment: "No adjustments required",
    isCCPcompliant: false,
    isCorsiaCompliant: false,
    name: "Project Green Wind",
    registry: "Kyklos",
    totalVintageQuantity: 5, // 2 tonnes
  };

  const vintage2: VintageDataStruct = {
    projectTokenId: 1,
    startTime: 1619827200, // Corresponds to May 1, 2021
    endTime: 1622505600, // Corresponds to June 1, 2021
    additionalCertification: "Gold Standard VER",
    uri: "https://example.com/vintage101",
    coBenefits: "Community health improvements, educational support",
    correspAdjustment: "Aligned with NDCs",
    isCCPcompliant: true,
    isCorsiaCompliant: true,
    name: "Solar Power Sahara",
    registry: "Kyklos",
    totalVintageQuantity: 10, // 10 tonne
  };

  // Add a new vintage to project1
  const vintage3: VintageDataStruct = {
    projectTokenId: 2,
    startTime: 1622505600, // Corresponds to June 1, 2021
    endTime: 1625097600, // Corresponds to July 1, 2021
    additionalCertification: "Gold Standard VER",
    uri: "https://example.com/vintage102",
    coBenefits: "Community health improvements, educational support",
    correspAdjustment: "Aligned with NDCs",
    isCCPcompliant: true,
    isCorsiaCompliant: true,
    name: "Solar Power Sahara",
    registry: "Kyklos",
    totalVintageQuantity: 10, // 10 tonne
  };

  // Add a new vintage
  try {
    const vintageTx = await carbonProjectVintagesFactory.addNewVintage(deployer, vintage);
    await vintageTx.wait();
    const vintageTx2 = await carbonProjectVintagesFactory.addNewVintage(deployer, vintage2);
    await vintageTx2.wait();
    const vintageTx3 = await carbonProjectVintagesFactory.addNewVintage(deployer, vintage3);
    await vintageTx3.wait();

    // deploy the token associated with the vintage
    const tokenTx = await carbonOffsetFactory.deployFromVintage(1);
    await tokenTx.wait();
    const tokenTx2 = await carbonOffsetFactory.deployFromVintage(2);
    await tokenTx2.wait();
    const tokenTx3 = await carbonOffsetFactory.deployFromVintage(3);
    await tokenTx3.wait();
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
    vintageStatusTx = await vintageStatus.mintBatch(deployer, 3, vintage3.totalVintageQuantity);
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

  // deposit tokens into the pool
  try {
    const token = await carbonOffsetFactory.pvIdtoERC20(1);
    const token1 = await carbonOffsetFactory.pvIdtoERC20(2);
    const token2 = await carbonOffsetFactory.pvIdtoERC20(3);
    console.log(token, "token1:", token1, "token2:", token2);
    const carbonOffsetToken = (await ethers.getContractAt("KyklosCarbonOffsets", token)) as Contract &
      KyklosCarbonOffsets;
    const approveTx = await carbonOffsetToken.approve(poolAddress, 1000000000000000000n);
    await approveTx.wait();
    const depositTx = await pool.deposit(token, 1000000000000000000n);
    await depositTx.wait();
    console.log("Tokens deposited into the pool successfully");
  } catch (error) {
    console.error("Failed to deposit tokens into the pool:", error);
    throw new Error("Deployment failed during token deposit.");
  }
};

export default initialSetup;
initialSetup.tags = ["InitialSetup"];
