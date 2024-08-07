// SPDX-FileCopyrightText: 2021 Kyklos Labs
//
// SPDX-License-Identifier: UNLICENSED

// If you encounter a vulnerability or an issue, please contact <security@kyklos.earth> or visit security.kyklos.earth

pragma solidity 0.8.14;

/// @dev V1 Storage contract for KyklosCarbonOffsetsFactory v.1.0
abstract contract KyklosCarbonOffsetsFactoryStorageV1 {
	address public contractRegistry;
	address[] public deployedContracts;
	mapping(uint256 => address) public pvIdtoERC20;
	address public beacon;
	address public bridgeFeeReceiver;
	uint256 public bridgeFeePercentageInBase;
	address public bridgeFeeBurnAddress;
	uint256 public bridgeFeeBurnPercentageInBase;
}

/// @dev Main storage contract inheriting new versions
/// @dev V1 is not inherited as it was inherited in the main contract
abstract contract KyklosCarbonOffsetsFactoryStorage is
	KyklosCarbonOffsetsFactoryStorageV1
{
	/// @dev add a storage gap so future upgrades can introduce new variables
	/// This is also allows for other dependencies to be inherited after this one
	uint256[44] private __gap;
}
