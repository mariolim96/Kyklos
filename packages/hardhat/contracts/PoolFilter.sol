// SPDX-FileCopyrightText: 2023 Kyklos Labs
//
// SPDX-License-Identifier: UNLICENSED

// If you encounter a vulnerability or an issue, please contact <security@toucan.earth> or visit security.toucan.earth
pragma solidity 0.8.14;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';

import './interfaces/IKyklosCarbonOffsets.sol';
import './interfaces/IKyklosContractRegistry.sol';
import {Errors} from './libraries/Errors.sol';
import './libraries/Strings.sol';
import './storages/PoolFilterStorage.sol';

abstract contract PoolFilter is
    ContextUpgradeable,
    OwnableUpgradeable,
    PausableUpgradeable,
    AccessControlUpgradeable,
    UUPSUpgradeable,
    PoolFilterStorage
{
    using Strings for string;

    // ----------------------------------------
    //      Events
    // ----------------------------------------

    event AttributeMethodologyAdded(string methodology);
    event AttributeMethodologyRemoved(string methodology);
    event AttributeRegionAdded(string region);
    event AttributeRegionRemoved(string region);
    event AttributeStandardAdded(string standard);
    event AttributeStandardRemoved(string standard);
    event ExternalAddressRemovedFromAllowlist(address erc20addr);
    event ExternalAddressAllowlisted(address erc20addr);
    event InternalAddressBlocklisted(address erc20addr);
    event InternalAddressRemovedFromBlocklist(address erc20addr);
    event InternalAddressRemovedFromAllowlist(address erc20addr);
    event InternalAddressAllowlisted(address erc20addr);
    event MappingSwitched(string mappingName, bool accepted);
    event MinimumVintageStartTimeUpdated(uint256 minimumVintageStartTime);
    event KyklosRegistrySet(address registry);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function __PoolFilter_init() internal initializer {
        __Context_init_unchained();
        __Ownable_init_unchained();
        __Pausable_init_unchained();
        __AccessControl_init_unchained();
        __UUPSUpgradeable_init_unchained();

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

    // ----------------------------------------
    //      Read-only functions
    // ----------------------------------------

    /// @notice Checks if token to be deposited is eligible for this pool
    function checkEligible(address erc20Addr)
        external
        view
        virtual
        returns (bool)
    {
        bool isKyklosContract = IKyklosContractRegistry(contractRegistry)
            .isValidERC20(erc20Addr);

        if (isKyklosContract) {
            if (internalAllowlist[erc20Addr]) {
                return true;
            }

            require(!internalBlocklist[erc20Addr], Errors.CP_BLACKLISTED);

            checkAttributeMatching(erc20Addr);
        } else {
            /// @dev If not Kyklos native contract, check if address is allowlisted
            require(externalAllowlist[erc20Addr], Errors.CP_NOT_ALLOWLISTED);
        }

        return true;
    }

    /// @notice Checks whether incoming ERC20s match the accepted criteria/attributes
    function checkAttributeMatching(address erc20Addr)
        public
        view
        virtual
        returns (bool)
    {
        ProjectData memory projectData;
        VintageData memory vintageData;
        (projectData, vintageData) = IKyklosCarbonOffsets(erc20Addr)
            .getAttributes();

        /// @dev checks if any one of the attributes are blocklisted.
        /// If mappings are set to "allowlist"-mode, require the opposite
        require(
            vintageData.startTime >= minimumVintageStartTime,
            Errors.CP_START_TIME_TOO_OLD
        );
        require(
            regions[projectData.region] == regionsIsAcceptedMapping,
            Errors.CP_REGION_NOT_ACCEPTED
        );
        require(
            standards[projectData.standard] == standardsIsAcceptedMapping,
            Errors.CP_STANDARD_NOT_ACCEPTED
        );
        require(
            methodologies[projectData.methodology] ==
                methodologiesIsAcceptedMapping,
            Errors.CP_METHODOLOGY_NOT_ACCEPTED
        );

        return true;
    }

    // ----------------------------------------
    //      Admin functions
    // ----------------------------------------

    function setKyklosContractRegistry(address _address) external virtual {
        onlyPoolOwner();
        contractRegistry = _address;
        emit KyklosRegistrySet(_address);
    }

    /// @notice Generic function to switch attributes mappings into either
    /// acceptance or rejection criteria
    /// @param _mappingName attribute mapping of project-vintage data
    /// @param accepted determines if mapping works as a blocklist or allowlist
    function switchMapping(string memory _mappingName, bool accepted)
        external
        virtual
    {
        onlyPoolOwner();
        if (_mappingName.equals('regions')) {
            accepted
                ? regionsIsAcceptedMapping = true
                : regionsIsAcceptedMapping = false;
        } else if (_mappingName.equals('standards')) {
            accepted
                ? standardsIsAcceptedMapping = true
                : standardsIsAcceptedMapping = false;
        } else if (_mappingName.equals('methodologies')) {
            accepted
                ? methodologiesIsAcceptedMapping = true
                : methodologiesIsAcceptedMapping = false;
        }
        emit MappingSwitched(_mappingName, accepted);
    }

    /// @notice Function to add attributes for filtering (does not support complex AttributeSets)
    /// @param addToList determines whether attribute should be added or removed
    /// Other params are arrays of attributes to be added
    function addAttributes(
        bool addToList,
        string[] memory _regions,
        string[] memory _standards,
        string[] memory _methodologies
    ) external virtual {
        onlyPoolOwner();
        //slither-disable-next-line uninitialized-local
        for (uint256 i; i < _standards.length; ++i) {
            if (addToList == true) {
                standards[_standards[i]] = true;
                emit AttributeStandardAdded(_standards[i]);
            } else {
                standards[_standards[i]] = false;
                emit AttributeStandardRemoved(_standards[i]);
            }
        }

        //slither-disable-next-line uninitialized-local
        for (uint256 i; i < _methodologies.length; ++i) {
            if (addToList == true) {
                methodologies[_methodologies[i]] = true;
                emit AttributeMethodologyAdded(_methodologies[i]);
            } else {
                methodologies[_methodologies[i]] = false;
                emit AttributeMethodologyRemoved(_methodologies[i]);
            }
        }

        //slither-disable-next-line uninitialized-local
        for (uint256 i; i < _regions.length; ++i) {
            if (addToList == true) {
                regions[_regions[i]] = true;
                emit AttributeRegionAdded(_regions[i]);
            } else {
                regions[_regions[i]] = false;
                emit AttributeRegionRemoved(_regions[i]);
            }
        }
    }

    /// @notice Function to allowlist selected external non-TCO2 contracts by their address
    /// @param erc20Addr accepts an array of contract addresses
    function addToExternalAllowlist(address[] memory erc20Addr) external {
        onlyPoolOwner();
        //slither-disable-next-line uninitialized-local
        for (uint256 i; i < erc20Addr.length; ++i) {
            externalAllowlist[erc20Addr[i]] = true;
            emit ExternalAddressAllowlisted(erc20Addr[i]);
        }
    }

    /// @notice Function to allowlist certain TCO2 contracts by their address
    /// @param erc20Addr accepts an array of contract addresses
    function addToInternalAllowlist(address[] memory erc20Addr) external {
        onlyPoolOwner();
        //slither-disable-next-line uninitialized-local
        for (uint256 i; i < erc20Addr.length; ++i) {
            internalAllowlist[erc20Addr[i]] = true;
            emit InternalAddressAllowlisted(erc20Addr[i]);
        }
    }

    /// @notice Function to blocklist certain TCO2 contracts by their address
    /// @param erc20Addr accepts an array of contract addresses
    function addToInternalBlocklist(address[] memory erc20Addr) external {
        onlyPoolOwner();
        //slither-disable-next-line uninitialized-local
        for (uint256 i; i < erc20Addr.length; ++i) {
            internalBlocklist[erc20Addr[i]] = true;
            emit InternalAddressBlocklisted(erc20Addr[i]);
        }
    }

    /// @notice Function to remove ERC20 addresses from external allowlist
    /// @param erc20Addr accepts an array of contract addresses
    function removeFromExternalAllowlist(address[] memory erc20Addr) external {
        onlyPoolOwner();
        //slither-disable-next-line uninitialized-local
        for (uint256 i; i < erc20Addr.length; ++i) {
            externalAllowlist[erc20Addr[i]] = false;
            emit ExternalAddressRemovedFromAllowlist(erc20Addr[i]);
        }
    }

    /// @notice Function to remove TCO2 addresses from internal blocklist
    /// @param erc20Addr accepts an array of contract addresses
    function removeFromInternalBlocklist(address[] memory erc20Addr) external {
        onlyPoolOwner();
        //slither-disable-next-line uninitialized-local
        for (uint256 i; i < erc20Addr.length; ++i) {
            internalBlocklist[erc20Addr[i]] = false;
            emit InternalAddressRemovedFromBlocklist(erc20Addr[i]);
        }
    }

    /// @notice Function to remove TCO2 addresses from internal allowlist
    /// @param erc20Addr accepts an array of contract addressesc
    function removeFromInternalAllowlist(address[] memory erc20Addr) external {
        onlyPoolOwner();
        //slither-disable-next-line uninitialized-local
        for (uint256 i; i < erc20Addr.length; ++i) {
            internalAllowlist[erc20Addr[i]] = false;
            emit InternalAddressRemovedFromAllowlist(erc20Addr[i]);
        }
    }

    /// @notice Determines the minimum vintage start time acceptance criteria of ERC20s
    /// @param _minimumVintageStartTime unix time format
    function setMinimumVintageStartTime(uint64 _minimumVintageStartTime)
        external
        virtual
    {
        onlyPoolOwner();
        minimumVintageStartTime = _minimumVintageStartTime;
        emit MinimumVintageStartTimeUpdated(_minimumVintageStartTime);
    }
}
