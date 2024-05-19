// SPDX-FileCopyrightText: 2021 Toucan Labs
//
// SPDX-License-Identifier: UNLICENSED

// If you encounter a vulnerability or an issue, please contact <security@toucan.earth> or visit security.toucan.earth

pragma solidity 0.8.14;

enum BatchStatus {
	Tokenized, // 0
	Active, // 1 means the batch could be split or detokenized
	Detokenized // 2 means the batch has been detokenized
}
