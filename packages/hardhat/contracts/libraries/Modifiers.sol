
// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.14;

contract Modifiers {
    modifier onlyBy(address _contractRegistry, address _owner) {
        require(
            _contractRegistry == msg.sender || _owner == msg.sender,
            'Caller is not the registry, nor owner'
        );
        _;
    }
}
