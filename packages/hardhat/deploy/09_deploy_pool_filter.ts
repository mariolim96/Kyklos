import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { verify } from "../utils/verify";
// Ensure this path is correct

const PoolFilter: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const poolFilterFactory = await hre.ethers.getContractFactory("PoolFilter");

  const poolFilterProxy = await hre.upgrades.deployProxy(poolFilterFactory, {
    kind: "uups",
    initializer: "initialize",
  });

  const implementationAddress = await hre.upgrades.erc1967.getImplementationAddress(await poolFilterProxy.getAddress());
  const proxyAddress = await poolFilterProxy.getAddress();

  const { log } = hre.deployments;
  log(`Pool_Proxy deployed to: ${proxyAddress}`);
  log(`Pool_Implementation deployed to: ${implementationAddress}`);

  const artifacts = await hre.deployments.getExtendedArtifact("PoolFilter");

  const proxyDeployment = {
    address: proxyAddress,
    ...artifacts,
  };

  await hre.deployments.save("PoolP", proxyDeployment);
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
export default PoolFilter;

PoolFilter.tags = ["PoolFilter"];
