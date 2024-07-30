// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.14;

import './KyklosCarbonOffsetBase.sol';
import {Errors} from '../libraries/Errors.sol';
import {BatchStatus} from '../types/VintageStatusTypes.sol';
import 'hardhat/console.sol';

/// @notice Base contract that can be reused between different KCO2
/// implementations that need to work with batch NFTs
abstract contract KyklosCarbonOffsetsWithBatchBase is
    IERC721Receiver,
    KyklosCarbonOffsetsBase
{
    // ----------------------------------------
    //       Admin functions
    // ----------------------------------------

    /// @notice Defractionalize batch NFT by burning the amount
    /// of KCO2 from the sender and transfer the batch NFT that
    /// was selected to the sender.
    /// The only valid sender currently is the KCO2 factory owner.
    /// @param tokenId The batch NFT to defractionalize from the KCO2
    function defractionalize(uint256 tokenId)
        external
        whenNotPaused
        onlyFactoryOwner
    {
        // address batchNFT = IKyklosContractRegistry(contractRegistry)
        //     .VintageStatusAddress();

        // // Fetch and burn amount of the NFT to be defractionalized
        // (
        //     ,
        //     uint256 batchAmount,
        //     BatchStatus status
        // ) = _getNormalizedDataFromBatch(batchNFT, tokenId);
        // require(
        //     status == BatchStatus.Confirmed,
        //     Errors.KCO2_BATCH_NOT_CONFIRMED
        // );
        // _burn(msg.sender, batchAmount);

        // // Transfer batch NFT to sender
        // IERC721(batchNFT).transferFrom(address(this), msg.sender, tokenId);
    }

    /// @notice Receive hook to fractionalize Batch-NFTs into ERC20's
    /// @dev Function is called with `operator` as `msg.sender` in a reference implementation by OZ
    /// `from` is the previous owner, not necessarily the same as operator.
    /// The hook checks if NFT collection is whitelisted and next if attributes are matching this ERC20 contract
    function onERC721Received(
        address, /* operator */
        address from,
        uint256 tokenId,
        bytes calldata /* data */
    ) external virtual override whenNotPaused returns (bytes4) {
        // msg.sender is the VintageStatus contract
        require(
            checkWhiteListed(msg.sender),
            Errors.KCO2_BATCH_NOT_WHITELISTED
        );

        (
            uint256 gotVintageTokenId,
            uint256 quantity,
            BatchStatus status
        ) = _getNormalizedDataFromBatch(msg.sender, tokenId);
        require(
            gotVintageTokenId == _projectVintageTokenId,
            Errors.KCO2_NON_MATCHING_NFT
        );

        // mint KCO2s for received batches that are in confirmed status
        require(
            status == BatchStatus.Active,
            Errors.KCO2_BATCH_NOT_CONFIRMED
        );
        console.log(quantity);
        require(getRemaining() >= quantity, Errors.KCO2_QTY_HIGHER);

        minterToId[from] = tokenId;
        IKyklosCarbonOffsetsFactory KCO2Factory = IKyklosCarbonOffsetsFactory(
            IKyklosContractRegistry(contractRegistry)
                .kyklosCarbonOffsetsFactoryAddress(standardRegistry())
        );
        address bridgeFeeReceiver = KCO2Factory.bridgeFeeReceiverAddress();

        if (bridgeFeeReceiver == address(0x0)) {
            // if no bridge fee receiver address is set, mint without fees
            _mint(from, quantity);
        } else {
            // calculate bridge fees
            (uint256 feeAmount, uint256 feeBurnAmount) = KCO2Factory
                .getBridgeFeeAndBurnAmount(quantity);
            _mint(from, quantity - feeAmount);
            address bridgeFeeBurnAddress = KCO2Factory.bridgeFeeBurnAddress();
            // we mint the burn fee to the bridge fee burn address so it can be retired later.
            // if there is no address configured we just mint the full amount to the bridge fee receiver.
            if (bridgeFeeBurnAddress != address(0x0) && feeBurnAmount > 0) {
                feeAmount -= feeBurnAmount;
                _mint(bridgeFeeReceiver, feeAmount);
                _mint(bridgeFeeBurnAddress, feeBurnAmount);
                emit FeePaid(from, feeAmount);
                emit FeeBurnt(from, feeBurnAmount);
            } else if (feeAmount > 0) {
                _mint(bridgeFeeReceiver, feeAmount);
                emit FeePaid(from, feeAmount);
            }
        }

        return this.onERC721Received.selector;
    }

    // ----------------------------------------
    //       Internal functions
    // ----------------------------------------

    function _getNormalizedDataFromBatch(address cob, uint256 tokenId)
        internal
        view
        returns (
            uint256,
            uint256,
            BatchStatus
        )
    {
        (
            uint256 vintageTokenId,
            uint256 quantity,
            BatchStatus status
        ) = IVintageStatus(cob).getBatchNFTData(tokenId);
        return (vintageTokenId, _batchAmountToKCO2Amount(quantity), status);
    }

    function _batchAmountToKCO2Amount(uint256 batchAmount)
        internal
        view
        returns (uint256)
    {
        return batchAmount * 10**decimals();
    }

    /// @dev Internal helper to check if VintageStatus is whitelisted (official)
    function checkWhiteListed(address collection)
        internal
        view
        virtual
        returns (bool)
    {
        if (
            collection ==
            IKyklosContractRegistry(contractRegistry)
                .VintageStatusAddress()
        ) {
            return true;
        } else {
            return false;
        }
    }
}
