// SPDX-FileCopyrightText: 2021 Toucan Labs
//
// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.14;

import {BatchStatus} from '../types/VintageStatusTypes.sol';

/// @dev Separate storage contract to improve upgrade safety
abstract contract VintageStatusStorageV1 {
  	uint256 public batchTokenCounter;
	string public baseURI;
	address public contractRegistry;

	struct NFTData {
		uint256 projectVintageTokenId;
		uint256 quantity;
		BatchStatus status;
        string uri;
	}

	mapping(uint256 => NFTData) public nftList;
	mapping(string => bool) public supportedRegistries;
}



abstract contract VintageStatusStorage is
    VintageStatusStorageV1
{}
