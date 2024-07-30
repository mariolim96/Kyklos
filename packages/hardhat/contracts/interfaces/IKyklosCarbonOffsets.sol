// SPDX-FileCopyrightText: 2022 Kyklos Labs
//
// SPDX-License-Identifier: UNLICENSED

// If you encounter a vulnerability or an issue, please contact <security@kyklos.earth> or visit security.kyklos.earth
pragma solidity 0.8.14;

import {VintageData} from '../types/CarbonProjectVintageTypes.sol';
import {ProjectData} from '../types/CarbonProjectTypes.sol';
// import {CreateRetirementRequestParams} from '../bases/KyklosCarbonOffsetsWithBatchBaseTypes.sol';

interface IKyklosCarbonOffsets {
    function retireFrom(address account, uint256 amount)
        external
        returns (uint256 retirementEventId);

    function burnFrom(address account, uint256 amount) external;

    function getAttributes()
        external
        view
        returns (ProjectData memory, VintageData memory);

    /// @notice Get the vintage data of the KCO2
    function getVintageData()
        external
        view
        returns (VintageData memory vintageData);

    function standardRegistry() external view returns (string memory);

    function retireAndMintCertificate(
        string calldata retiringEntityString,
        address beneficiary,
        string calldata beneficiaryString,
        string calldata retirementMessage,
        uint256 amount
    ) external;

    // function retireAndMintCertificateForEntity(
    //     address retiringEntity,
    //     CreateRetirementRequestParams calldata params
    // ) external;

    function projectVintageTokenId() external view returns (uint256);
}
