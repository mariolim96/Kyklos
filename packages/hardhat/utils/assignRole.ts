import { keccak256, toUtf8Bytes } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

const assignRole = (role: string) => {
  return keccak256(toUtf8Bytes(role));
};
const deployerPrivateKey =
  process.env.DEPLOYER_PRIVATE_KEY ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

export const roles = {
  DEFAULT_ADMIN_ROLE: assignRole("DEFAULT_ADMIN_ROLE"),
  ADMIN_ROLE: assignRole("ADMIN_ROLE"),
  MINTER_ROLE: assignRole("MINTER_ROLE"),
  MANAGER_ROLE: assignRole("MANAGER_ROLE"),
  PAUSER_ROLE: assignRole("PAUSER_ROLE"),
  UPGRADER_ROLE: assignRole("UPGRADER_ROLE"),
  DETOKENIZER_ROLE: assignRole("DETOKENIZER_ROLE"),
  TOKENIZER_ROLE: assignRole("TOKENIZER_ROLE"),
};

export const assignedRole = {
  DEFAULT_ADMIN_ROLE: deployerPrivateKey,
  ADMIN_ROLE: deployerPrivateKey,
  MINTER_ROLE: deployerPrivateKey,
  MANAGER_ROLE: deployerPrivateKey,
  PAUSER_ROLE: deployerPrivateKey,
  UPGRADER_ROLE: deployerPrivateKey,
  DETOKENIZER_ROLE: deployerPrivateKey,
  TOKENIZER_ROLE: deployerPrivateKey,
};
