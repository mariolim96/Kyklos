// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.14;

import {BatchStatus} from '../types/VintageStatusTypes.sol';

interface IVintageStatus {
    function getConfirmationStatus(uint256 tokenId)
        external
        view
        returns (BatchStatus);

    function getBatchNFTData(uint256 tokenId)
        external
        view
        returns (
            uint256,
            uint256,
            BatchStatus
        );


    function split(
        uint256 tokenId,
        uint256 newTokenIdQuantity
    ) external returns (uint256);
}
