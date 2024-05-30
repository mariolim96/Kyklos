// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.14;

import "./bases/KyklosCarbonOffsetsDirectRetirements.sol";
import "./bases/KyklosCarbonOffsetsWithBatchBase.sol";

/// @notice Implementation contract of the TCO2 tokens (ERC20)
/// These tokenized carbon offsets are specific to a vintage and its associated attributes
/// In order to mint TCO2s a user must deposit a matching CarbonOffsetBatch
/// @dev Each TCO2 contract is deployed via a Beacon Proxy in `KyklosCarbonOffsetsFactory`
contract KyklosCarbonOffsets is
	KyklosCarbonOffsetsWithBatchBase,
	KyklosCarbonOffsetsDirectRetirements
{
	// ----------------------------------------
	//      Constants
	// ----------------------------------------

	/// @dev Version-related parameters. VERSION keeps track of production
	/// releases. VERSION_RELEASE_CANDIDATE keeps track of iterations
	/// of a VERSION in our staging environment.
	string public constant VERSION = "1.6.0";
	uint256 public constant VERSION_RELEASE_CANDIDATE = 1;

	// ----------------------------------------
	//       Upgradable related functions
	// ----------------------------------------

	function initialize(
		string memory name_,
		string memory symbol_,
		uint256 projectVintageTokenId_,
		address contractRegistry_
	) external virtual initializer {
		__ERC20_init_unchained(name_, symbol_);
		_projectVintageTokenId = projectVintageTokenId_;
		contractRegistry = contractRegistry_;
	}

	function standardRegistry() public pure override returns (string memory) {
		return "Kyklos";
	}

	function standardRegistryDecimals() public pure override returns (uint8) {
		return 18;
	}
}
