// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.14;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import { IPoolFilter } from "./interfaces/IPoolFilter.sol";
import { IKyklosCarbonOffsets, VintageData } from "./interfaces/IKyklosCarbonOffsets.sol";
import { Errors } from "./libraries/Errors.sol";
import "./storages/PoolStorage.sol";

/// @notice Pool template contract
/// ERC20 compliant token that acts as a pool for TCO2 tokens
contract Pool is
	ContextUpgradeable,
	ERC20Upgradeable,
	OwnableUpgradeable,
	PausableUpgradeable,
	AccessControlUpgradeable,
	UUPSUpgradeable,
	PoolStorage
{
	using SafeERC20Upgradeable for IERC20Upgradeable;

	// ----------------------------------------
	//      Constants
	// ----------------------------------------

	/// @dev All roles related to accessing this contract
	bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
	bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

	// ----------------------------------------
	//      Events
	// ----------------------------------------

	event Deposited(address erc20Addr, uint256 amount);
	event Redeemed(address account, address erc20, uint256 amount);
	event SupplyCapUpdated(uint256 newCap);
	event FilterUpdated(address filter);

	/// @custom:oz-upgrades-unsafe-allow constructor
	constructor() {
		_disableInitializers();
	}

	function initialize() external virtual initializer {
		__Context_init_unchained();
		__Ownable_init_unchained();
		__Pausable_init_unchained();
		__ERC20_init_unchained("Biochar", "CHAR");
		__AccessControl_init_unchained();
		__UUPSUpgradeable_init_unchained();

		// TODO: set the roles based on calldata
		_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
	}

	// ----------------------------------------
	//      Upgradable related functions
	// ----------------------------------------

	function _authorizeUpgrade(address) internal virtual override {
		onlyPoolOwner();
	}

	// ------------------------
	// Poor person's modifiers
	// ------------------------

	/// @dev function that checks whether the caller is the
	/// contract owner
	function onlyPoolOwner() internal view virtual {
		require(owner() == msg.sender, Errors.CP_ONLY_OWNER);
	}

	/// @dev function that only lets the contract's owner and granted role to execute
	function onlyWithRole(bytes32 role) internal view virtual {
		require(
			hasRole(role, msg.sender) || owner() == msg.sender,
			Errors.CP_UNAUTHORIZED
		);
	}

	/// @dev function that checks whether the contract is paused
	function onlyUnpaused() internal view {
		require(!paused(), Errors.CP_PAUSED_CONTRACT);
	}

	// ------------------------
	// Admin functions
	// ------------------------

	/// @notice Emergency function to disable contract's core functionality
	/// @dev wraps _pause(), only Admin
	function pause() external virtual {
		onlyWithRole(PAUSER_ROLE);
		_pause();
	}

	/// @dev Unpause the system, wraps _unpause(), only Admin
	function unpause() external virtual {
		onlyWithRole(PAUSER_ROLE);
		_unpause();
	}

	/// @notice Function to limit the maximum pool supply
	/// @dev supplyCap is initially set to 0 and must be increased before deposits
	function setSupplyCap(uint256 newCap) external virtual {
		onlyPoolOwner();
		supplyCap = newCap;
		emit SupplyCapUpdated(newCap);
	}

	/// @notice Update the address of the filter contract
	/// @param _filter Filter contract address
	function setFilter(address _filter) external virtual {
		onlyPoolOwner();
		filter = _filter;
		emit FilterUpdated(_filter);
	}

	// ----------------------------
	//   Permissionless functions
	// ----------------------------

	function _deposit(
		address erc20Addr,
		uint256 amount
	) internal returns (uint256 mintedPoolTokenAmount) {
		onlyUnpaused();

		// Ensure the TCO2 is eligible to be deposited
		_checkEligible(erc20Addr);

		// Ensure there is space in the pool
		uint256 remainingSpace = getRemaining();
		require(remainingSpace != 0, Errors.CP_FULL_POOL);

		// If the amount to be deposited exceeds the remaining space, deposit
		// the maximum amount possible up to the cap instead of failing.
		if (amount > remainingSpace) amount = remainingSpace;

		// Mint pool tokens to the user
		_mint(msg.sender, amount);

		// Update supply-related storage variables in the pool
		VintageData memory vData = IKyklosCarbonOffsets(erc20Addr)
			.getVintageData();
		totalPerProjectTCO2Supply[vData.projectTokenId] += amount;
		totalTCO2Supply += amount;

		// Transfer the TCO2 to the pool
		IERC20Upgradeable(erc20Addr).safeTransferFrom(
			msg.sender,
			address(this),
			amount
		);

		emit Deposited(erc20Addr, amount);

		return amount;
	}

	/// @notice Checks if token to be deposited is eligible for this pool.
	/// Reverts if not.
	/// Beware that the revert reason might depend on the underlying implementation
	/// of IPoolFilter.checkEligible
	/// @param erc20Addr the contract to check
	/// @return isEligible true if address is eligible and no other issues occur
	function checkEligible(
		address erc20Addr
	) external view virtual returns (bool isEligible) {
		_checkEligible(erc20Addr);
		return true;
	}

	function _checkEligible(address erc20Addr) internal view {
		//slither-disable-next-line unused-return
		try IPoolFilter(filter).checkEligible(erc20Addr) returns (
			//slither-disable-next-line uninitialized-local
			bool isEligible
		) {
			require(isEligible, Errors.CP_NOT_ELIGIBLE);
			//slither-disable-next-line uninitialized-local
		} catch Error(string memory reason) {
			revert(reason);
			//slither-disable-next-line uninitialized-local
		} catch (bytes memory reason) {
			// this most often results in a random bytes sequence,
			// but it's worth at least trying to log it
			revert(string.concat("unexpected error: ", string(reason)));
		}
	}

	/// @notice Returns minimum vintage start time for this pool
	function minimumVintageStartTime() external view returns (uint64) {
		return IPoolFilter(filter).minimumVintageStartTime();
	}

	/// @notice Checks if region is eligible for this pool
	function regions(string calldata region) external view returns (bool) {
		return IPoolFilter(filter).regions(region);
	}

	/// @notice Checks if standard is eligible for this pool
	function standards(string calldata standard) external view returns (bool) {
		return IPoolFilter(filter).standards(standard);
	}

	/// @notice Checks if methodology is eligible for this pool
	function methodologies(
		string calldata methodology
	) external view returns (bool) {
		return IPoolFilter(filter).methodologies(methodology);
	}

	/// @dev Internal function that redeems a single underlying token
	function redeemSingle(address erc20, uint256 amount) internal virtual {
		// Burn pool tokens
		_burn(msg.sender, amount);

		// Update supply-related storage variables in the pool
		VintageData memory vData = IKyklosCarbonOffsets(erc20).getVintageData();
		totalPerProjectTCO2Supply[vData.projectTokenId] -= amount;
		totalTCO2Supply -= amount;

		// Transfer TCO2 tokens to the caller
		IERC20Upgradeable(erc20).safeTransfer(msg.sender, amount);

		emit Redeemed(msg.sender, erc20, amount);
	}

	/// @dev Internal function to redeem multiple underlying tokens
	function _redeemInMany(
		address[] memory tco2s,
		uint256[] memory amounts
	) internal returns (uint256[] memory redeemedAmounts) {
		onlyUnpaused();
		uint256 tco2Length = tco2s.length;
		require(tco2Length == amounts.length, Errors.CP_LENGTH_MISMATCH);

		// Initialize return arrays
		redeemedAmounts = new uint256[](tco2Length);

		// Execute redemptions
		for (uint256 i = 0; i < tco2Length; ++i) {
			_checkEligible(tco2s[i]);

			uint256 amountToRedeem = amounts[i];

			// Redeem the amount minus the fee
			redeemSingle(tco2s[i], amountToRedeem);

			// Keep track of redeemed amounts in return arguments
			// to make the function composable.
			redeemedAmounts[i] = amountToRedeem;
		}
	}

	function _redeemOutMany(
		address[] memory tco2s,
		uint256[] memory amounts
	) internal returns (uint256 poolAmountSpent) {
		onlyUnpaused();
		uint256 tco2Length = tco2s.length;
		require(tco2Length == amounts.length, Errors.CP_LENGTH_MISMATCH);

		// Execute redemptions
		for (uint256 i = 0; i < tco2Length; ++i) {
			_checkEligible(tco2s[i]);

			// Redeem the amount
			uint256 amountToRedeem = amounts[i];
			poolAmountSpent += amountToRedeem;
			redeemSingle(tco2s[i], amountToRedeem);
		}
	}

	/// @dev Implemented in order to disable transfers when paused
	function _beforeTokenTransfer(
		address from,
		address to,
		uint256 amount
	) internal virtual override {
		super._beforeTokenTransfer(from, to, amount);
		onlyUnpaused();
	}

	/// @dev Returns the remaining space in pool before hitting the cap
	function getRemaining() public view returns (uint256) {
		return (supplyCap - totalSupply());
	}

	/// @notice Returns the balance of the TCO2 found in the pool
	function tokenBalances(address tco2) public view returns (uint256) {
		return IERC20Upgradeable(tco2).balanceOf(address(this));
	}

	// -----------------------------
	//      Locked ERC20 safety
	// -----------------------------

	/// @dev Function to disallow sending tokens to either the 0-address
	/// or this contract itself
	function validDestination(address to) internal view {
		require(to != address(0x0), Errors.CP_INVALID_DESTINATION_ZERO);
		require(to != address(this), Errors.CP_INVALID_DESTINATION_SELF);
	}

	function transfer(
		address recipient,
		uint256 amount
	) public virtual override returns (bool) {
		validDestination(recipient);
		super.transfer(recipient, amount);
		return true;
	}

	function transferFrom(
		address sender,
		address recipient,
		uint256 amount
	) public virtual override returns (bool) {
		validDestination(recipient);
		super.transferFrom(sender, recipient, amount);
		return true;
	}
}
