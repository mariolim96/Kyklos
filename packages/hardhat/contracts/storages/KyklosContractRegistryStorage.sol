// SPDX-FileCopyrightText: 2021 Kyklos Labs
//
// SPDX-License-Identifier: UNLICENSED

// If you encounter a vulnerability or an issue, please contact <security@kyklos.earth> or visit security.kyklos.earth
pragma solidity 0.8.14;

abstract contract KyklosContractRegistryStorageV1 {
    address internal _VintageStatusAddress;
    address internal _carbonProjectsAddress;
    address internal _carbonProjectVintagesAddress;
    //slither-disable-next-line uninitialized-state,constable-states
    address internal _retirementCertificatesAddress;
    string[] internal standardRegistries;
    mapping(address => bool) public projectVintageERC20Registry;
    mapping(string => address) public kyklosCarbonOffsetFactories;
}


abstract contract KyklosContractRegistryStorage is
    KyklosContractRegistryStorageV1
{}
