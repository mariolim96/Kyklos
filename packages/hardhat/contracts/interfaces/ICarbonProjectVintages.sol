// SPDX-FileCopyrightText: 2021 Kyklos Labs
//
// SPDX-License-Identifier: UNLICENSED

// If you encounter a vulnerability or an issue, please contact <security@kyklos.earth> or visit security.kyklos.earth
pragma solidity 0.8.14;

import '@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol';

import '../types/CarbonProjectVintageTypes.sol';

interface ICarbonProjectVintages is IERC721Upgradeable {
    function addNewVintage(address to, VintageData memory _vintageData)
        external
        returns (uint256);

    function exists(uint256 tokenId) external view returns (bool);

    function getProjectVintageDataByTokenId(uint256 tokenId)
        external
        view
        returns (VintageData memory);
}
