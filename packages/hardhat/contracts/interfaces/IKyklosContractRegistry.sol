// SPDX-FileCopyrightText: 2021 Kyklos Labs
//
// SPDX-License-Identifier: UNLICENSED

// If you encounter a vulnerability or an issue, please contact <security@kyklos.earth> or visit security.kyklos.earth
pragma solidity 0.8.14;

interface IKyklosContractRegistry {
	function VintageStatusAddress() external view returns (address);

	function carbonProjectsAddress() external view returns (address);

	function carbonProjectVintagesAddress() external view returns (address);

	function kyklosCarbonOffsetsFactoryAddress(
		string memory standardRegistry
	) external view returns (address);

	function retirementCertificatesAddress() external view returns (address);

	// function kyklosCarbonOffsetsEscrowAddress() external view returns (address);

	function isValidERC20(address erc20) external view returns (bool);

	function addERC20(address erc20, string memory standardRegistry) external;
}
