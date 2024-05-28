import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { verify } from "../utils/verify";
import { KyklosCarbonOffsets } from "../typechain-types";
import { Contract } from "ethers";

const CarbonOffset: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { ethers, upgrades } = hre;
  const carbonOffsetTokenBeacon = await ethers.getContractFactory("KyklosCarbonOffsets");
  const carbonOffset = (await upgrades.deployBeacon(carbonOffsetTokenBeacon)) as Contract & KyklosCarbonOffsets;
  await carbonOffset.waitForDeployment();

  const proxyAddress = await carbonOffset.getAddress();
  const artifacts = await hre.deployments.getExtendedArtifact("KyklosCarbonOffsets");

  const implementationDeployment = {
    address: proxyAddress,
    ...artifacts,
  };
  //   await hre.deployments.save("CarbonOffsetP", proxyDeployment);
  await hre.deployments.save("CarbonOffset", implementationDeployment);

  try {
    const chainId = await hre.getChainId();
    if (chainId !== "31337") {
      await verify(proxyAddress, []);
    }
  } catch (error) {
    console.error(error);
  }
};

export default CarbonOffset;

CarbonOffset.tags = ["VintagesStatus"];
