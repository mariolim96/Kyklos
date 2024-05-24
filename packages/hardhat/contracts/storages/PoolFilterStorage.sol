// SPDX-FileCopyrightText: 2023 Kyklos Labs
//
// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.14;

abstract contract PoolFilterStorageV1 {
    /// @dev Mappings for attributes that can be included or excluded
    /// if set to `false`, attribute-values are blocklisted/rejected
    /// if set to `true`, attribute-values are allowlisted/accepted
    mapping(string => bool) public regions;
    mapping(string => bool) public standards;
    mapping(string => bool) public methodologies;

    /// @dev mapping to allowlist external non-TCO2 contracts by address
    mapping(address => bool) public externalAllowlist;

    /// @dev mapping to include certain TCO2 contracts by address,
    /// overriding attribute matching checks
    mapping(address => bool) public internalAllowlist;

    /// @dev mapping to exclude certain TCO2 contracts by address,
    /// even if the attribute matching would pass
    mapping(address => bool) public internalBlocklist;

    /// @dev address of the registry contract that knows
    /// the list of TCO2s
    address public contractRegistry;

    uint64 public minimumVintageStartTime;
    /// @dev These booleans control the direction of the criteria as
    /// they are defined in regions, standards, and methodologies.
    ///
    /// Two examples:
    ///
    /// 1. methodologiesIsAcceptedMapping=false
    ///    methodologies['VM0002']=true
    /// This means the pool will reject any project that follows the
    /// 'VM0002' methodology and accept anything else
    ///
    /// 2. methodologiesIsAcceptedMapping=true
    ///    methodologies['VM0002']=true
    /// This means the pool will accept only any project that follows the
    /// 'VM0002' methodology.
    bool public regionsIsAcceptedMapping;
    bool public standardsIsAcceptedMapping;
    bool public methodologiesIsAcceptedMapping;
}

abstract contract PoolFilterStorage is PoolFilterStorageV1 {}
