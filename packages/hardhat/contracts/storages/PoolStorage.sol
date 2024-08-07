// SPDX-FileCopyrightText: 2021 Kyklos Labs
//
// SPDX-License-Identifier: UNLICENSED

// If you encounter a vulnerability or an issue, please contact <security@kyklos.earth> or visit security.kyklos.earth
pragma solidity 0.8.14;

abstract contract PoolStorageV1 {
	/// @notice The supply cap is used as a measure to guard deposits
	/// in the pool. It is meant to minimize the impact a potential
	/// compromise in the source registry (eg. Verra) can have to the pool.
	uint256 public supplyCap;

	/// @notice array used to read from when redeeming KCO2s automatically
	address[] public scoredKCO2s;

	/// @dev fees redeem receiver address
	//slither-disable-next-line uninitialized-state,constable-states
	address internal _feeRedeemReceiver;

	//slither-disable-next-line uninitialized-state,constable-states
	uint256 internal _feeRedeemPercentageInBase;

	/// @dev fees redeem burn address
	address internal _feeRedeemBurnAddress;

	/// @dev fees redeem burn percentage with 2 fixed decimals precision
	uint256 internal _feeRedeemBurnPercentageInBase;
	/// @notice End users exempted from redeem fees
	mapping(address => bool) public redeemFeeExemptedAddresses;
	/// @notice KCO2s exempted from redeem fees
	mapping(address => bool) public redeemFeeExemptedKCO2s;
	/// @notice fee percentage in basis points charged for selective
	/// redemptions that also retire the credits in the same transaction
	//slither-disable-next-line uninitialized-state,constable-states
	uint256 internal _feeRedeemRetirePercentageInBase;
	address public filter;
	/// @notice module to calculate fees for the pool
	/// @notice Total KCO2 supply in the pool.
	uint256 public totalKCO2Supply;
	/// @notice Project token id to total supply of the project
	/// in the pool.
	mapping(uint256 => uint256) public totalPerProjectKCO2Supply;
    
}



abstract contract PoolStorage is
	PoolStorageV1
{}