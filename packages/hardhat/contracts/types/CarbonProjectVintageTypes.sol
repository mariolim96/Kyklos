// SPDX-FileCopyrightText: 2021 Kyklos Labs
//
// SPDX-License-Identifier: UNLICENSED

// If you encounter a vulnerability or an issue, please contact <security@kyklos.earth> or visit security.kyklos.earth

pragma solidity 0.8.14;

struct VintageData {
    /// @dev A human-readable string which differentiates this from other vintages in
    /// the same project, and helps build the corresponding KCO2 name and symbol.
    string name;
    uint64 startTime; // UNIX timestamp
    uint64 endTime; // UNIX timestamp
    uint256 projectTokenId;
    uint64 totalVintageQuantity;
    bool isCorsiaCompliant;
    bool isCCPcompliant;
    string coBenefits;
    string correspAdjustment;
    string additionalCertification;
    string uri;
    string registry;
}

// a struct to managing token created for each project vintage
struct ProjectVintageToken {
    uint256 tokenId;
    uint256 projectVintageTokenId;
    uint256 amount;
    bool isLegacy;
}