//
// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.14;

abstract contract RetirementCertificatesStorageV1 {
	struct Data {
		uint256[] retirementEventIds;
		uint256 createdAt;
		address retiringEntity;
		address beneficiary;
		string retiringEntityString;
		string beneficiaryString;
		string retirementMessage;
		string beneficiaryLocation;
		string consumptionCountryCode;
		uint256 consumptionPeriodStart;
		uint256 consumptionPeriodEnd;
	}

	/// @dev a RetirementEvent has a clear ownership relationship.
	/// This relation is less clear in an NFT that already has a beneficiary set
	struct RetirementEvent {
		uint256 createdAt;
		address retiringEntity;
		/// @dev amount is denominated in 18 decimals, similar to amounts
		/// in KCO2 contracts.
		uint256 amount;
		uint256 projectVintageTokenId;
	}

	/// @dev id that tracks retirement events
	uint256 public retireEventCounter;

	/// @dev maps the retireEventCounter to the RetirementEvent data
	mapping(uint256 => RetirementEvent) public retirements;

	uint256 internal _tokenIds;
	mapping(uint256 => Data) public certificates;

	/// @dev mapping that helps ensure retirement events are not claimed multiple times
	mapping(uint256 => bool) public claimedEvents;


	/// @dev List all the events belonging to user (maybe this could be better inferred via a subgraph)
	mapping(address => uint256[]) eventsOfUser;

	address public contractRegistry;
	string public baseURI;
	uint256 public minValidRetirementAmount;
}

/// @dev Kept separate from RetirementCertificatesStorageV1 to
/// add ReentrancyGuardUpgradeable in between.
abstract contract RetirementCertificatesStorage is
	RetirementCertificatesStorageV1
{

}
