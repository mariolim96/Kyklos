// SPDX-License-Identifier: UNLICENSED


pragma solidity 0.8.14;

/// @dev Separate storage contract to improve upgrade safety
abstract contract KyklosCarbonOffsetsStorage {
    uint256 internal _projectVintageTokenId;
    address public contractRegistry;

    mapping(address => uint256) public minterToId;
}
