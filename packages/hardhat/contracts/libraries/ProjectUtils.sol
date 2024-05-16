// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.14;

import '../interfaces/IKyklosContractRegistry.sol';
import '../interfaces/ICarbonProjects.sol';

contract ProjectUtils {
    function checkProjectTokenExists(address contractRegistry, uint256 tokenId)
        internal
        virtual
    {
        address c = IKyklosContractRegistry(contractRegistry)
            .carbonProjectsAddress();
        bool isValidProjectTokenId = ICarbonProjects(c).isValidProjectTokenId(
            tokenId
        );
        require(isValidProjectTokenId == true, 'Error: Project does not exist');
    }
}
