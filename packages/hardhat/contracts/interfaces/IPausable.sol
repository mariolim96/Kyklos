
//
// SPDX-License-Identifier: UNLICENSED

// If you encounter a vulnerability or an issue, please contact <security@kyklos.earth> or visit security.kyklos.earth
pragma solidity 0.8.14;

interface IPausable {
    function paused() external view returns (bool);

    function pause() external;

    function unpause() external;
}
