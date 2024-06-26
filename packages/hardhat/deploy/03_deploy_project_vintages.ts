import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { verify } from "../utils/verify";
// import { verify } from "../utils/verify";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContractContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { log } = hre.deployments;

  const chainId = await hre.getChainId();

  // Get contract factory for Registry
  const CarbonProjectVintages = await hre.ethers.getContractFactory("CarbonProjectVintages");
  const CarbonProjectVintagesProxy = await hre.upgrades.deployProxy(CarbonProjectVintages, {
    kind: "uups",
    initializer: "initialize",
  });
  await CarbonProjectVintagesProxy.waitForDeployment();

  // We had to wait for blocks to be mined before we could get the implementation address because sometimes its error out
  const implementationAddress = await hre.upgrades.erc1967.getImplementationAddress(
    await CarbonProjectVintagesProxy.getAddress(),
  );
  const proxyAddress = await CarbonProjectVintagesProxy.getAddress();
  log(`CarbonProjectVintages_Proxy deployed to: ${proxyAddress}`);
  log(`CarbonProjectVintages_Implementation deployed to: ${implementationAddress}`);

  const artifacts = await hre.deployments.getExtendedArtifact("CarbonProjectVintages");

  // Linking the Implementation artifacts to the Proxy
  const proxyDeployment = {
    address: proxyAddress,
    ...artifacts,
  };

  const implementationDeployment = {
    address: implementationAddress,
    ...artifacts,
  };

  await hre.deployments.save("CarbonProjectVintagesP", proxyDeployment);
  await hre.deployments.save("CarbonProjectVintages", implementationDeployment);

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

export default deployYourContractContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContractContract.tags = ["CarbonProjectVintages"];
