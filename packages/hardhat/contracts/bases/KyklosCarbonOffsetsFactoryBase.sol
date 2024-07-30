// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.14;

// ============ External Imports ============
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

// ============ Internal Imports ============
import "../interfaces/IKyklosContractRegistry.sol";
import "../interfaces/ICarbonProjects.sol";
import "../interfaces/ICarbonProjectVintages.sol";
import "../libraries/ProjectUtils.sol";
import "../libraries/ProjectVintageUtils.sol";
import "../libraries/Strings.sol";
import "../libraries/Modifiers.sol";
import "../storages/KyklosCarbonOffsetsFactoryStorage.sol";
import "hardhat/console.sol";


abstract contract KyklosCarbonOffsetsFactoryBase is
	OwnableUpgradeable,
	PausableUpgradeable,
	UUPSUpgradeable,
	ProjectUtils,
	ProjectVintageUtils,
	Modifiers,
	KyklosCarbonOffsetsFactoryStorage,
	AccessControlUpgradeable
{
	using Strings for string;

	// ----------------------------------------
	//      Constants
	// ----------------------------------------

	/// @dev divider to calculate fees in basis points
	uint256 public constant bridgeFeeDivider = 1e4;

	/// @dev All roles related to accessing this contract
	bytes32 public constant DETOKENIZER_ROLE = keccak256("DETOKENIZER_ROLE");
	bytes32 public constant TOKENIZER_ROLE = keccak256("TOKENIZER_ROLE");

	// ----------------------------------------
	//      Events
	// ----------------------------------------

	event TokenCreated(uint256 vintageTokenId, address tokenAddress);

	/// @custom:oz-upgrades-unsafe-allow constructor
	constructor() {
		_disableInitializers();
	}

	function __KyklosCarbonOffsetsFactoryBase_init(
		address defaultAdmin,
		address[] calldata accounts,
		bytes32[] calldata roles
	) internal {
		require(accounts.length == roles.length, "Array length mismatch");
		__Context_init_unchained();
		__Ownable_init_unchained();
		__Pausable_init_unchained();
		__UUPSUpgradeable_init_unchained();
		__AccessControl_init_unchained();
		_grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
		for (uint256 i = 0; i < accounts.length; ++i) {
			_grantRole(roles[i], accounts[i]);
		}
	}

	// ----------------------------------------
	//           Admin functions
	// ----------------------------------------

	function _authorizeUpgrade(
		address newImplementation
	) internal virtual override onlyOwner {}

	/// @dev sets the Beacon that tracks the current implementation logic of the KCO2s
	function setBeacon(address _beacon) external virtual onlyOwner {
		beacon = _beacon;
	}

	/// @notice Emergency function to disable contract's core functionality
	/// @dev wraps _pause(), only Admin
	function pause() external virtual onlyBy(contractRegistry, owner()) {
		_pause();
	}

	/// @dev unpause the system, wraps _unpause(), only Admin
	function unpause() external virtual onlyBy(contractRegistry, owner()) {
		_unpause();
	}

	/// @dev set the registry contract to be tracked
	function setKyklosContractRegistry(
		address _address
	) external virtual onlyOwner {
		contractRegistry = _address;
	}

	// ----------------------------------------
	//       Permissionless functions
	// ----------------------------------------

	/// @notice internal factory function to deploy new KCO2 (ERC20) contracts
	/// @dev the function creates a new BeaconProxy for each KCO2
	/// @param projectVintageTokenId links the vintage-specific data to the KCO2 contract
	function deployNewProxy(
		uint256 projectVintageTokenId
	) internal virtual whenNotPaused {
		require(beacon != address(0), "Error: Beacon for proxy not set");
		require(
			!checkExistence(projectVintageTokenId),
			"pvERC20 already exists"
		);
		checkProjectVintageTokenExists(contractRegistry, projectVintageTokenId);

		/// Ensure that the KCO2 to be deployed is for a standard that is supported
		/// by the standard registry.
		require(hasValidStandard(projectVintageTokenId), "Invalid standard");

		/// @dev generate payload for initialize function
		string memory signature = "initialize(string,string,uint256,address)";
		bytes memory payload = abi.encodeWithSignature(
			signature,
			"Kyklos: KCO2",
			"KCO2",
			projectVintageTokenId,
			contractRegistry
		);

		//slither-disable-next-line reentrancy-no-eth
		BeaconProxy proxyKCO2 = new BeaconProxy(beacon, payload);

		IKyklosContractRegistry(contractRegistry).addERC20(
			address(proxyKCO2),
			standardRegistry()
		);

		deployedContracts.push(address(proxyKCO2));
		pvIdtoERC20[projectVintageTokenId] = address(proxyKCO2);

		emit TokenCreated(projectVintageTokenId, address(proxyKCO2));
	}

	/// @dev Deploys a KCO2 contract based on a project vintage
	/// @param projectVintageTokenId numeric tokenId from vintage in `CarbonProjectVintages`
	function deployFromVintage(
		uint256 projectVintageTokenId
	) external virtual whenNotPaused {
		deployNewProxy(projectVintageTokenId);
	}

	/// @dev Checks if same project vintage has already been deployed
	function checkExistence(
		uint256 projectVintageTokenId
	) internal view virtual returns (bool) {
		if (pvIdtoERC20[projectVintageTokenId] == address(0)) {
			return false;
		} else {
			return true;
		}
	}

	function hasValidStandard(
		uint256 projectVintageTokenId
	) internal view returns (bool) {
		// Fetch contracts from contract registry
		address tcnRegistry = contractRegistry;
		address pc = IKyklosContractRegistry(tcnRegistry)
			.carbonProjectsAddress();
		address vc = IKyklosContractRegistry(tcnRegistry)
			.carbonProjectVintagesAddress();

		// Fetch carbon data
		VintageData memory vintageData = ICarbonProjectVintages(vc)
			.getProjectVintageDataByTokenId(projectVintageTokenId);
		ProjectData memory projectData = ICarbonProjects(pc)
			.getProjectDataByTokenId(vintageData.projectTokenId);

		// Check whether standard in carbon data matches supported standards
		// in the current factory
		string[] memory standards = supportedStandards();
		uint256 supportedStandardsLen = standards.length;
		string memory candidateStandard = projectData.standard;
		//slither-disable-next-line uninitialized-local
		for (uint256 i; i < supportedStandardsLen; ) {
			string memory supportedStandard = standards[i];

			if (candidateStandard.equals(supportedStandard)) {
				return true;
			}

			unchecked {
				++i;
			}
		}

		return false;
	}

	/// @dev Returns all addresses of deployed KCO2 contracts
	function getContracts() external view virtual returns (address[] memory) {
		return deployedContracts;
	}

	function bridgeFeeReceiverAddress()
		external
		view
		virtual
		returns (address)
	{
		return bridgeFeeReceiver;
	}

	function getBridgeFeeAndBurnAmount(
		uint256 _quantity
	) external view virtual returns (uint256, uint256) {
		//slither-disable-next-line divide-before-multiply
		uint256 feeAmount = (_quantity * bridgeFeePercentageInBase) /
			bridgeFeeDivider;
		//slither-disable-next-line divide-before-multiply
		uint256 burnAmount = (feeAmount * bridgeFeeBurnPercentageInBase) /
			bridgeFeeDivider;
		return (feeAmount, burnAmount);
	}

	/// @notice Update the bridge fee percentage
	/// @param _bridgeFeePercentageInBase percentage of bridge fee in base
	function setBridgeFeePercentage(
		uint256 _bridgeFeePercentageInBase
	) external virtual onlyOwner {
		require(
			_bridgeFeePercentageInBase < bridgeFeeDivider,
			"bridge fee percentage must be lower than bridge fee divider"
		);
		bridgeFeePercentageInBase = _bridgeFeePercentageInBase;
	}

	/// @notice Update the bridge fee receiver
	/// @param _bridgeFeeReceiver address to transfer the fees
	function setBridgeFeeReceiver(
		address _bridgeFeeReceiver
	) external virtual onlyOwner {
		bridgeFeeReceiver = _bridgeFeeReceiver;
	}

	/// @notice Update the bridge fee burning percentage
	/// @param _bridgeFeeBurnPercentageInBase percentage of bridge fee in base
	function setBridgeFeeBurnPercentage(
		uint256 _bridgeFeeBurnPercentageInBase
	) external virtual onlyOwner {
		require(
			_bridgeFeeBurnPercentageInBase < bridgeFeeDivider,
			"burn fee percentage must be lower than bridge fee divider"
		);
		bridgeFeeBurnPercentageInBase = _bridgeFeeBurnPercentageInBase;
	}

	/// @notice Update the bridge fee burn address
	/// @param _bridgeFeeBurnAddress address to transfer the fees to burn
	function setBridgeFeeBurnAddress(
		address _bridgeFeeBurnAddress
	) external virtual onlyOwner {
		bridgeFeeBurnAddress = _bridgeFeeBurnAddress;
	}

	/// @notice Return the name of the registry that this
	/// factory is enabling to tokenize, eg., verra
	/// @dev this must be overridden in the child contract
	function standardRegistry() public pure virtual returns (string memory) {}

	/// @notice Return the standard(s) supported by the carbon
	/// registry from where this factory tokenizes credits, eg., VCS
	/// It's important to satisfy this interface in order to ensure
	/// that KCO2 factories cannot create KCO2s for standards that
	/// the standard registry does not support
	function supportedStandards()
		public
		pure
		virtual
		returns (string[] memory)
	{}
}
