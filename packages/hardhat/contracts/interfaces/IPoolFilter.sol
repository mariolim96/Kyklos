// SPDX-FileCopyrightText: 2021 Kyklos Labs
//
// SPDX-License-Identifier: UNLICENSED

// If you encounter a vulnerability or an issue, please contact <security@kyklos.earth> or visit security.kyklos.earth
pragma solidity 0.8.14;

interface IPoolFilter {
    function checkEligible(address erc20Addr) external view returns (bool);

    function minimumVintageStartTime() external view returns (uint64);

    function regions(string calldata region) external view returns (bool);

    function standards(string calldata standard) external view returns (bool);

    function methodologies(string calldata methodology)
        external
        view
        returns (bool);
}
