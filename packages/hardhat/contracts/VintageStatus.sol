// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.14;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import "./interfaces/IVintageStatus.sol";
import "./interfaces/ICarbonProjectVintages.sol";
import "./interfaces/IKyklosCarbonOffsets.sol";
import "./interfaces/IKyklosCarbonOffsetsFactory.sol";
import "./interfaces/IKyklosContractRegistry.sol";
import "./storages/VintageStatusStorage.sol";
import { Errors } from "./libraries/Errors.sol";
import "./libraries/ProjectVintageUtils.sol";
import "./libraries/Modifiers.sol";
import "./libraries/Strings.sol";
import { BatchStatus } from "./types/VintageStatusTypes.sol";

contract VintageStatus is
	IVintageStatus,
	ERC721EnumerableUpgradeable,
	OwnableUpgradeable,
	PausableUpgradeable,
	AccessControlUpgradeable,
	UUPSUpgradeable,
	ProjectVintageUtils,
	Modifiers,
	VintageStatusStorage
{
	using SafeERC20Upgradeable for IERC20Upgradeable;
	using Strings for string;

	/// @dev Version-related parameters. VERSION keeps track of production
	/// releases. VERSION_RELEASE_CANDIDATE keeps track of iterations
	/// of a VERSION in our staging environment.
	string public constant VERSION = "1.4.0";
	uint256 public constant VERSION_RELEASE_CANDIDATE = 3;

	/// @dev All roles related to accessing this contract
	bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
	bytes32 public constant TOKENIZER_ROLE = keccak256("TOKENIZER_ROLE");
	event BatchMinted(address sender, uint256 tokenId);
	event Tokenized(
		uint256 tokenId,
		address tco2,
		address indexed recipient,
		uint256 amount
	);
	event Split(uint256 tokenId, uint256 newTokenId);
	event BatchFromToken(
		uint256 tokenId,
		address indexed recipient,
		uint256 amount
	);
	event RegistrySupported(string registry, bool isSupported);
	event BatchStatusUpdate(uint256 tokenId, BatchStatus status);

	/// @custom:oz-upgrades-unsafe-allow constructor
	constructor() {
		_disableInitializers();
	}

	// ----------------------------------------
	//      Upgradable related functions
	// ----------------------------------------

	function initialize(
		address _contractRegistry
	) external virtual initializer {
		__Context_init_unchained();
		__ERC721_init_unchained(
			"Kyklos Protocol: Carbon Offset Batches",
			"TOUCAN-COB"
		);
		__Ownable_init_unchained();
		__Pausable_init_unchained();
		__AccessControl_init_unchained();
		__UUPSUpgradeable_init_unchained();

		contractRegistry = _contractRegistry;
		_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
		_grantRole(TOKENIZER_ROLE, msg.sender);
		_grantRole(VERIFIER_ROLE, msg.sender);
		_setRoleAdmin(VERIFIER_ROLE, VERIFIER_ROLE);
	}

	function _authorizeUpgrade(
		address newImplementation
	) internal virtual override onlyOwner {}

	// ------------------------
	// Poor person's modifiers
	// ------------------------

	function onlyWithRole(bytes32 role) internal view {
		if (!hasRole(role, msg.sender)) revert(Errors.COB_INVALID_CALLER);
	}

	function onlyActive(uint256 tokenId) internal view {
		if (nftList[tokenId].status != BatchStatus.Active)
			revert(Errors.COB_INVALID_STATUS);
	}

	function onlyVerifierOrBatchOwner(uint256 tokenId) internal view {
		if (
			ownerOf(tokenId) != _msgSender() &&
			!hasRole(VERIFIER_ROLE, msg.sender)
		) revert(Errors.COB_NOT_VERIFIER_OR_BATCH_OWNER);
	}

	function onlyApprovedOrOwner(uint256 tokenId) internal view {
		if (!_isApprovedOrOwner(_msgSender(), tokenId))
			revert(Errors.COB_TRANSFER_NOT_APPROVED);
	}

	function onlyValidNewStatus(
		BatchStatus statusA,
		BatchStatus statusB
	) internal pure {
		if (statusA != statusB) revert(Errors.COB_INVALID_NEW_STATUS);
	}

	function onlyUnpaused() internal view {
		if (paused()) revert(Errors.COB_PAUSED_CONTRACT);
	}

	// ------------------------
	//      Admin functions
	// ------------------------

	/// @notice Emergency function to disable contract's core functionality
	/// @dev wraps _pause(), callable only by the Kyklos contract registry or the contract owner
	function pause() external virtual onlyBy(contractRegistry, owner()) {
		_pause();
	}

	/// @notice Emergency function to re-enable contract's core functionality after being paused
	/// @dev wraps _unpause(), callable only by the Kyklos contract registry or the contract owner
	function unpause() external virtual onlyBy(contractRegistry, owner()) {
		_unpause();
	}

	/// @notice Admin function to set the contract registry
	/// @dev Callable only by the contract owner
	/// @param _address The address of the new contract registry
	function setKyklosContractRegistry(
		address _address
	) external virtual onlyOwner {
		contractRegistry = _address;
	}

	/// @notice Admin function to set whether a registry is supported
	/// @dev Callable only by the contract owner; executable only if the status can be changed
	/// @param registry The registry to set supported status for
	/// @param isSupported Whether the registry should be supported
	function setSupportedRegistry(
		string memory registry,
		bool isSupported
	) external onlyOwner {
		if (supportedRegistries[registry] == isSupported)
			revert(Errors.COB_ALREADY_SUPPORTED);

		supportedRegistries[registry] = isSupported;
		emit RegistrySupported(registry, isSupported);
	}

	function _updateStatus(
		uint256 tokenId,
		BatchStatus newStatus
	) internal virtual {
		nftList[tokenId].status = newStatus;
		emit BatchStatusUpdate(tokenId, newStatus);
	}

	function mintBatch(
		address to,
		uint256 projectVintageTokenId,
		uint256 quantity
	) external returns (uint256) {
		onlyUnpaused();
		onlyWithRole(TOKENIZER_ROLE);
		return _mintBatch(to, projectVintageTokenId, quantity);
	}

	function _mintBatch(
		address to,
		uint256 projectVintageTokenId,
		uint256 quantity
	) internal returns (uint256 newItemId) {
		newItemId = batchTokenCounter;
		unchecked {
			++newItemId;
		}
		batchTokenCounter = newItemId;
		_mint(to, newItemId);
		// verify that quantity is equal to the totalVintageQuantity
		ICarbonProjectVintages projectVintages = ICarbonProjectVintages(
			IKyklosContractRegistry(contractRegistry)
				.carbonProjectVintagesAddress()
		);
		// vintage should exist
		require(
			projectVintages.exists(projectVintageTokenId),
			"vintageTokenId does not exist"
		);
		// owner of the vintage should be the same as the owner of the batch
		require(
			projectVintages.ownerOf(projectVintageTokenId) == to,
			"owner of the vintage should be the same as the owner of the batch"
		);
		VintageData memory vintageData = projectVintages
			.getProjectVintageDataByTokenId(projectVintageTokenId);
		require(
			vintageData.totalVintageQuantity == quantity,
			"quantity does not match totalVintageQuantity"
		);
		nftList[newItemId] = NFTData({
			projectVintageTokenId: projectVintageTokenId,
			quantity: quantity,
			status: BatchStatus.Active,
			uri: ""
		});
		emit BatchMinted(to, newItemId);
	}

	function _updateQuantity(uint256 tokenId, uint256 quantity) internal {
		onlyUnpaused();
		onlyWithRole(TOKENIZER_ROLE);
		onlyActive(tokenId);
		nftList[tokenId].quantity = quantity;
	}

	/// @notice Returns just the confirmation (approval) status of Batch-NFT
	/// @param tokenId The token ID of the batch
	function getConfirmationStatus(
		uint256 tokenId
	) external view virtual override returns (BatchStatus) {
		return nftList[tokenId].status;
	}

	function onERC721Received(
		address /* operator */,
		address from /* from */,
		uint256 /* tokenId */,
		bytes calldata /* data */
	) external pure returns (bytes4) {
		// This hook is only used by the contract to mint batch-NFTs that
		// can be tokenized on behalf of end users.
		if (from != address(0)) revert(Errors.COB_ONLY_MINTS);
		return this.onERC721Received.selector;
	}

	/// @notice Returns all data for Batch-NFT
	/// @dev Used in TCO2 contract's receive hook `onERC721Received`
	/// @param tokenId The token ID of the batch
	/// @return projectVintageTokenId The token ID of the vintage
	/// @return quantity Quantity in tCO2e
	/// @return status The status of the batch
	function getBatchNFTData(
		uint256 tokenId
	) external view virtual returns (uint256, uint256, BatchStatus) {
		if (!_exists(tokenId)) revert(Errors.COB_NOT_EXISTS);
		return (
			nftList[tokenId].projectVintageTokenId,
			nftList[tokenId].quantity,
			nftList[tokenId].status
		);
	}

	function transferFrom(
		address from,
		address to,
		uint256 tokenId
	) public virtual override(ERC721Upgradeable, IERC721Upgradeable) {
		onlyApprovedOrOwner(tokenId);
		safeTransferFrom(from, to, tokenId, "");
	}

	/// @dev returns the address of the TCO2 contract that corresponds to the batch-NFT
	function _getTCO2ForBatchTokenId(
		uint256 tokenId
	) internal view returns (address) {
		uint256 pvId = nftList[tokenId].projectVintageTokenId;
		IKyklosContractRegistry tcnRegistry = IKyklosContractRegistry(
			contractRegistry
		);

		// Fetch the registry from the vintage data first
		address vintages = tcnRegistry.carbonProjectVintagesAddress();
		VintageData memory data = ICarbonProjectVintages(vintages)
			.getProjectVintageDataByTokenId(pvId);

		// Now we can fetch the TCO2 factory for the carbon registry
		string memory carbonRegistry = data.registry;

		address tco2Factory = tcnRegistry.kyklosCarbonOffsetsFactoryAddress(
			carbonRegistry
		);

		return IKyklosCarbonOffsetsFactory(tco2Factory).pvIdtoERC20(pvId);
	}

	/// @notice Automatically converts Batch-NFT to TCO2s (ERC20)
	/// @dev Only by the batch-NFT owner or approved operator, only if batch is confirmed.
	/// Batch-NFT is sent from the sender and TCO2s are transferred to the sender.
	/// Queries the factory to find the corresponding TCO2 contract
	/// Fractionalization happens via receive hook on `safeTransferFrom`
	/// @param tokenId The token ID of the batch
	function fractionalize(uint256 tokenId) external virtual {
		onlyApprovedOrOwner(tokenId);
		safeTransferFrom(
			_msgSender(),
			_getTCO2ForBatchTokenId(tokenId),
			tokenId,
			""
		);
        emit Tokenized(tokenId, _getTCO2ForBatchTokenId(tokenId), _msgSender(), nftList[tokenId].quantity);
	}

	function beforeFractionalize(uint256 tokenId) external virtual {
		onlyApprovedOrOwner(tokenId);
	}

	/// @notice Split a batch-NFT into two batch-NFTs, by creating a new batch-NFT and updating the old one.
	/// The old batch will have a new serial number and quantity will be reduced by the quantity of the new batch.
	/// @dev Callable only by the escrow contract, only for batches with status
	/// RetirementRequested or DetokenizationRequested. The TCO2 contract will also be the owner of the new batch and
	/// its status will be the same as the old batch.
	/// @param tokenId The token ID of the batch to split
	/// @param newTokenIdQuantity The quantity for the new batch, must be smaller than the old quantity and greater
	/// than 0
	/// @return newTokenId The token ID of the new batch
	function split(
		uint256 tokenId,
		uint256 newTokenIdQuantity
	) external returns (uint256 newTokenId) {
		onlyUnpaused();
		// address tco2 = ownerOf(tokenId);
		// if (!IKyklosContractRegistry(contractRegistry).isValidERC20(tco2))
		// 	revert(Errors.COB_INVALID_BATCH_OWNER);
		onlyActive(tokenId);
		onlyUnpaused();
		// Validate batch quantity
		if (nftList[tokenId].quantity <= newTokenIdQuantity)
			revert(Errors.COB_INVALID_QUANTITY);
		require(
			newTokenIdQuantity > 0,
			"New batch quantity must be greater than 0"
		);
		batchTokenCounter += 1;
		newTokenId = batchTokenCounter;
		_mintBatch(
			ownerOf(tokenId),
			nftList[tokenId].projectVintageTokenId,
			newTokenIdQuantity
		);

		emit Split(tokenId, newTokenId);
	}

	function _baseURI() internal view virtual override returns (string memory) {
		return baseURI;
	}

	function setBaseURI(string memory gateway) external virtual onlyOwner {
		baseURI = gateway;
	}

	/// @dev Returns the Uniform Resource Identifier (URI) for `tokenId` token.
	/// based on the ERC721URIStorage implementation
	function tokenURI(
		uint256 tokenId
	) public view virtual override returns (string memory) {
		if (!_exists(tokenId)) revert(Errors.COB_NOT_EXISTS);

		string memory uri = nftList[tokenId].uri;
		// If there is no base URI, return the token URI.
		if (bytes(_baseURI()).length == 0) return uri;
		// If both are set, concatenate the baseURI and tokenURI
		if (bytes(uri).length > 0) return string.concat(_baseURI(), uri);

		return super.tokenURI(tokenId);
	}

	/// @dev Utilized here in order to disable transfers when paused
	function _beforeTokenTransfer(
		address from,
		address to,
		uint256 amount
	) internal virtual override {
		onlyUnpaused();
		super._beforeTokenTransfer(from, to, amount);
	}

	function supportsInterface(
		bytes4 interfaceId
	)
		public
		view
		override(AccessControlUpgradeable, ERC721EnumerableUpgradeable)
		returns (bool)
	{
		return
			interfaceId == type(IAccessControlUpgradeable).interfaceId ||
			ERC721Upgradeable.supportsInterface(interfaceId);
	}
}
