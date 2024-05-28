import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { verify } from "../utils/verify";

const VintageStatus: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { log } = hre.deployments;

  const chainId = await hre.getChainId();
  const registryAddress = (await hre.deployments.get("Registry_Proxy")).address;
  const ProjectVintagesStatus = await hre.ethers.getContractFactory("VintageStatus");
  const ProjectVintagesStatusProxy = await hre.upgrades.deployProxy(ProjectVintagesStatus, [registryAddress], {
    kind: "uups",
    initializer: "initialize",
  });
  await ProjectVintagesStatusProxy.waitForDeployment();

  const implementationAddress = await hre.upgrades.erc1967.getImplementationAddress(
    await ProjectVintagesStatusProxy.getAddress(),
  );
  const proxyAddress = await ProjectVintagesStatusProxy.getAddress();
  log(`VintageStatus_Proxy deployed to: ${proxyAddress}`);
  log(`VintageStatus_Implementation deployed to: ${implementationAddress}`);

  const artifacts = await hre.deployments.getExtendedArtifact("VintageStatus");

  const proxyDeployment = {
    address: proxyAddress,
    ...artifacts,
  };

  const implementationDeployment = {
    address: implementationAddress,
    ...artifacts,
  };

  await hre.deployments.save("VintageStatusP", proxyDeployment);
  await hre.deployments.save("VintageStatus", implementationDeployment);

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

export default VintageStatus;

VintageStatus.tags = ["VintagesStatus"];
