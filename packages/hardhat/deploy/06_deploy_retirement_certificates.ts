import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { verify } from "../utils/verify";

const deployRetirementCertificates: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { log } = hre.deployments;
  const chainId = await hre.getChainId();
  const registryAddress = (await hre.deployments.get("Registry_Proxy")).address;
  const RetirementCertificates = await hre.ethers.getContractFactory("RetirementCertificates");
  const RetirementCertificatesProxy = await hre.upgrades.deployProxy(RetirementCertificates, [registryAddress, ""], {
    kind: "uups",
    initializer: "initialize",
  });
  await RetirementCertificatesProxy.waitForDeployment();
  const implementationAddress = await hre.upgrades.erc1967.getImplementationAddress(
    await RetirementCertificatesProxy.getAddress(),
  );
  const proxyAddress = await RetirementCertificatesProxy.getAddress();
  log(`RetirementCertificates_Proxy deployed to: ${proxyAddress}`);
  log(`RetirementCertificates_Implementation deployed to: ${implementationAddress}`);

  const artifacts = await hre.deployments.getExtendedArtifact("RetirementCertificates");

  const proxyDeployment = {
    address: proxyAddress,
    ...artifacts,
  };

  await hre.deployments.save("RetirementCertificatesP", proxyDeployment);

  try {
    if (chainId !== "31337") {
      log("Verifying Proxy on Etherscan...");
      await verify(implementationAddress, []);
      await verify(proxyAddress, []);
      log("Proxy verified on Etherscan.");
    }
  } catch (error) {
    console.error(error);
  }
};

export default deployRetirementCertificates;

deployRetirementCertificates.tags = ["RetirementCertificates"];
