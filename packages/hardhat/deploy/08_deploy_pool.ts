import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { verify } from "../utils/verify";
// Ensure this path is correct

const Pool: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const poolFactory = await hre.ethers.getContractFactory("Pool");

  const poolProxy = await hre.upgrades.deployProxy(poolFactory, {
    kind: "uups",
    initializer: "initialize",
  });

  const implementationAddress = await hre.upgrades.erc1967.getImplementationAddress(await poolProxy.getAddress());
  const proxyAddress = await poolProxy.getAddress();

  const { log } = hre.deployments;
  log(`Pool_Proxy deployed to: ${proxyAddress}`);
  log(`Pool_Implementation deployed to: ${implementationAddress}`);

  const artifacts = await hre.deployments.getExtendedArtifact("Pool");

  const proxyDeployment = {
    address: proxyAddress,
    ...artifacts,
  };
  const implementationDeployment = {
    address: implementationAddress,
    ...artifacts,
  };

  await hre.deployments.save("PoolP", proxyDeployment);
  await hre.deployments.save("Pool", implementationDeployment);
  const chainId = await hre.getChainId();
  try {
    if (chainId !== "31337") {
      log("Verifying Proxy on Etherscan..." + chainId);
      await verify(implementationAddress, []);
      await verify(proxyAddress, []);
      log("Proxy verified on Etherscan.");
    }
  } catch (error) {
    log("Error verifying contract on Etherscan: ", error);
  }
};
export default Pool;

Pool.tags = ["Pool"];
