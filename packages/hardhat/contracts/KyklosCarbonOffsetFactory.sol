
// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.14;

// ============ External Imports ============
import "./bases/KyklosCarbonOffsetsFactoryBase.sol";

/// @notice This KCO2 factory creates project-vintage-specific ERC20 contracts for Batch-NFT fractionalization
/// Locks in received ERC721 Batch-NFTs and can mint corresponding quantity of ERC20s
/// Permissionless, anyone can deploy new ERC20s unless they do not yet exist and pid exists
contract KyklosCarbonOffsetsFactory is KyklosCarbonOffsetsFactoryBase {
	// ----------------------------------------
	//      Constants
	// ----------------------------------------

	/// @dev Version-related parameters. VERSION keeps track of production
	/// releases. VERSION_RELEASE_CANDIDATE keeps track of iterations
	/// of a VERSION in our staging environment.
	string public constant VERSION = "1.3.0";
	uint256 public constant VERSION_RELEASE_CANDIDATE = 1;

	// ----------------------------------------
	//      Upgradable related functions
	// ----------------------------------------

	function initialize(
		address _contractRegistry,
		address _admin,
		address[] calldata _accounts,
		bytes32[] calldata _roles
	) external virtual initializer {
		__KyklosCarbonOffsetsFactoryBase_init(_admin, _accounts, _roles);
		contractRegistry = _contractRegistry;
	}

	function setAdmin(address _user) external onlyOwner {
		grantRole(DEFAULT_ADMIN_ROLE, _user);
	}

	function standardRegistry() public pure override returns (string memory) {
		return "Kyklos";
	}

	function supportedStandards()
		public
		pure
		override
		returns (string[] memory)
	{
		string[] memory standards = new string[](1);
		standards[0] = "Kyklos";
		return standards;
	}
}
