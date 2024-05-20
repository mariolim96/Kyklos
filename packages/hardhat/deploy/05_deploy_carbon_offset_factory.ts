import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { verify } from "../utils/verify";
import { roles } from "../utils/assignRole";

const deployCarbonOffsetFactory: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { log } = hre.deployments;
  //   const { ethers } = hre;
  const { deployer } = (await hre.getNamedAccounts()) ?? "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  console.log("deployer:", deployer);
  const DEFAULT_ADMIN_ROLE = roles.DEFAULT_ADMIN_ROLE;
  console.log("DEFAULT_ADMIN_ROLE:", DEFAULT_ADMIN_ROLE);
  //   const OTHER_ROLE = ethers.utils.id("OTHER_ROLE");
  const TOKENIZER_ROLE = roles.TOKENIZER_ROLE;
  const DETOKENIZER_ROLE = roles.DETOKENIZER_ROLE;
  const chainId = await hre.getChainId();
  const registryAddress = (await hre.deployments.get("Registry_Proxy")).address;
  const carbonOffsetFactory = await hre.ethers.getContractFactory("KyklosCarbonOffsetsFactory");
  const carbonOffsetFactoryProxy = await hre.upgrades.deployProxy(
    carbonOffsetFactory,
    [registryAddress, deployer, [deployer, deployer], [TOKENIZER_ROLE, DETOKENIZER_ROLE]],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await carbonOffsetFactoryProxy.waitForDeployment();

  const implementationAddress = await hre.upgrades.erc1967.getImplementationAddress(
    await carbonOffsetFactoryProxy.getAddress(),
  );
  const proxyAddress = await carbonOffsetFactoryProxy.getAddress();
  log(`CarbonOffsetFactory_Proxy deployed to: ${proxyAddress}`);
  //   log(`CarbonOffsetFactory_Implementation deployed to: ${implementationAddress}`);

  const artifacts = await hre.deployments.getExtendedArtifact("KyklosCarbonOffsetsFactory");

  const proxyDeployment = {
    address: proxyAddress,
    ...artifacts,
  };

  //   const implementationDeployment = {
  //     address: implementationAddress,
  //     ...artifacts,
  //   };

  await hre.deployments.save("CarbonOffsetFactoryP", proxyDeployment);
  //   await hre.deployments.save("CarbonOffsetFactory", implementationDeployment);

  try {
    if (chainId !== "31337") {
      log("Verifying Proxy on Etherscan..." + chainId);
      await verify(implementationAddress, []);
      await verify(proxyAddress, []);
      log("Proxy verified on Etherscan.");
    }
  } catch (error) {
    console.error(error);
  }
};

export default deployCarbonOffsetFactory;
