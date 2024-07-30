// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.14;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "./interfaces/IPausable.sol";
import "./interfaces/IKyklosCarbonOffsetsFactory.sol";
import "./interfaces/IKyklosContractRegistry.sol";
import "./libraries/Strings.sol";
import "./storages/KyklosContractRegistryStorage.sol";

/// @dev The KyklosContractRegistry is queried by other contracts for current addresses
contract KyklosContractRegistry is
	OwnableUpgradeable,
	AccessControlUpgradeable,
	IKyklosContractRegistry,
	UUPSUpgradeable,
	KyklosContractRegistryStorage
{
	using Strings for string;

	// ----------------------------------------
	//      Constants
	// ----------------------------------------

	/// @dev Version-related parameters.
	string public constant VERSION = "1.0.0";

	/// @dev All roles related to accessing this contract
	bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

	// ----------------------------------------
	//      Events
	// ----------------------------------------

	event KCO2FactoryAdded(address indexed factory, string indexed standard);

	// ----------------------------------------
	//      Modifiers
	// ----------------------------------------

	modifier onlyBy(address _factory, address _owner) {
		require(
			_factory == msg.sender || _owner == msg.sender,
			"Caller is not the factory"
		);
		_;
	}

	/// @dev modifier that only lets the contract's owner and granted pausers pause the system
	modifier onlyPausers() {
		require(
			hasRole(PAUSER_ROLE, msg.sender) || owner() == msg.sender,
			"Caller is not authorized"
		);
		_;
	}

	/// @custom:oz-upgrades-unsafe-allow constructor
	constructor() {
		_disableInitializers();
	}

	// /// @notice security function that pauses all contracts part of the carbon bridge
	function pauseSystem() external onlyPausers {
		IPausable cpv = IPausable(_carbonProjectVintagesAddress);
		if (!cpv.paused()) cpv.pause();

		IPausable cp = IPausable(_carbonProjectsAddress);
		if (!cp.paused()) cp.pause();

		IPausable cob = IPausable(_VintageStatusAddress);
		if (!cob.paused()) cob.pause();

		uint256 standardRegistriesLen = standardRegistries.length;
		//slither-disable-next-line uninitialized-local
		for (uint256 i; i < standardRegistriesLen; ) {
			string memory standardRegistry = standardRegistries[i];
			address factory = kyklosCarbonOffsetFactories[standardRegistry];

			IPausable tcof = IPausable(factory);
			if (!tcof.paused()) tcof.pause();

			unchecked {
				++i;
			}
		}
	}

	/// @notice security function that unpauses all contracts part of the carbon bridge
	function unpauseSystem() external onlyOwner {
		IPausable cpv = IPausable(_carbonProjectVintagesAddress);
		if (cpv.paused()) cpv.unpause();

		IPausable cp = IPausable(_carbonProjectsAddress);
		if (cp.paused()) cp.unpause();

		IPausable cob = IPausable(_VintageStatusAddress);
		if (cob.paused()) cob.unpause();

		uint256 standardRegistriesLen = standardRegistries.length;
		//slither-disable-next-line uninitialized-local
		for (uint256 i; i < standardRegistriesLen; ) {
			string memory standardRegistry = standardRegistries[i];
			address factory = kyklosCarbonOffsetFactories[standardRegistry];

			IPausable tcof = IPausable(factory);
			if (tcof.paused()) tcof.unpause();

			unchecked {
				++i;
			}
		}
	}

	// ----------------------------------------
	//      Upgradable related functions
	// ----------------------------------------

	function initialize() external virtual initializer {
		__Ownable_init();
		__AccessControl_init_unchained();
		__UUPSUpgradeable_init_unchained();

		/// @dev granting the deployer==owner the rights to grant other roles
		_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
	}

	function _authorizeUpgrade(
		address newImplementation
	) internal virtual override onlyOwner {}

	// ----------------------------------------
	//              Setters
	// ----------------------------------------
	function setVintageStatusAddress(address _address) external virtual {
		require(_address != address(0), "Zero address");
		_VintageStatusAddress = _address;
	}

	function setCarbonProjectsAddress(address _address) external virtual {
		require(_address != address(0), "Zero address");
		_carbonProjectsAddress = _address;
	}

	function setCarbonProjectVintagesAddress(
		address _address
	) external virtual {
		require(_address != address(0), "Zero address");
		_carbonProjectVintagesAddress = _address;
	}

	function setKyklosCarbonOffsetsFactoryAddress(
		address KCO2Factory
	) external virtual onlyOwner {
		require(KCO2Factory != address(0), "Zero address");

		// Get the standard registry from the factory
		string memory standardRegistry = IKyklosCarbonOffsetsFactory(
			KCO2Factory
		).standardRegistry();
		require(bytes(standardRegistry).length != 0, "Empty standard registry");

		if (!standardRegistryExists(standardRegistry)) {
			standardRegistries.push(standardRegistry);
		}
		kyklosCarbonOffsetFactories[standardRegistry] = KCO2Factory;

		emit KCO2FactoryAdded(KCO2Factory, standardRegistry);
	}

	function standardRegistryExists(
		string memory standard
	) private view returns (bool) {
		uint256 standardRegistriesLen = standardRegistries.length;
		//slither-disable-next-line uninitialized-local
		for (uint256 i; i < standardRegistriesLen; ) {
			if (standardRegistries[i].equals(standard)) {
				return true;
			}

			unchecked {
				++i;
			}
		}
		return false;
	}

	function setRetirementCertificatesAddress(
		address _address
	) external virtual onlyOwner {
		require(_address != address(0), "Zero address");
		_retirementCertificatesAddress = _address;
	}

	/// @notice Keep track of KCO2s per standard
	function addERC20(
		address erc20,
		string calldata standardRegistry
	)
		external
		virtual
		onlyBy(kyklosCarbonOffsetFactories[standardRegistry], owner())
	{
		projectVintageERC20Registry[erc20] = true;
	}

	// // ----------------------------------------
	// //              Getters
	// // ----------------------------------------

	function VintageStatusAddress()
		external
		view
		virtual
		override
		returns (address)
	{
		return _VintageStatusAddress;
	}

	function carbonProjectsAddress()
		external
		view
		virtual
		override
		returns (address)
	{
		return _carbonProjectsAddress;
	}

	function carbonProjectVintagesAddress()
		external
		view
		virtual
		override
		returns (address)
	{
		return _carbonProjectVintagesAddress;
	}

	/// @dev return the KCO2 factory address for the provided standard
	function kyklosCarbonOffsetsFactoryAddress(
		string memory standardRegistry
	) external view virtual override returns (address) {
		return kyklosCarbonOffsetFactories[standardRegistry];
	}

	function retirementCertificatesAddress()
		external
		view
		virtual
		override
		returns (address)
	{
		return _retirementCertificatesAddress;
	}

	function isValidERC20(
		address erc20
	) external view virtual override returns (bool) {
		return projectVintageERC20Registry[erc20];
	}

	function supportedStandardRegistries()
		external
		view
		returns (string[] memory)
	{
		return standardRegistries;
	}
}
