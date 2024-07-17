"use client";

import {
    getPool,
    getPoolPooledTokens,
    getPoolPooledTokensType,
    getPoolType,
    getUserPoolBalance,
    getUserPoolBalanceType,
    getUserTokens,
    getUserTokensResponse,
} from "./query";
import { useQuery } from "@apollo/client";
import { useAccount } from "wagmi";

const pool = "0x0B306BF915C4d645ff596e518fAf3F9669b97016".toLowerCase();

const useUserTokensAndBalance = () => {
    const account = useAccount();
    const query = useQuery<getUserTokensResponse>(getUserTokens, {
        variables: { address: account.address?.toLowerCase() },
        skip: !account.address,
    });
    return query;
};

const usePoolInfo = () => {
    const query = useQuery<getPoolType>(getPool, {
        variables: { id: pool },
    });
    return query;
};

const useUserPoolBalance = () => {
    const account = useAccount();
    const query = useQuery<getUserPoolBalanceType>(getUserPoolBalance, {
        variables: { id: `${account.address}-${pool}`.toLowerCase() },
        skip: !account.address,
    });
    return query;
};

const usePoolPooledTokens = () => {
    // const pool = "0x0B306BF915C4d645ff596e518fAf3F9669b97016".toLowerCase();
    const account = useAccount();
    const query = useQuery<getPoolPooledTokensType>(getPoolPooledTokens, {
        variables: {
            userId: account.address?.toLowerCase(),
            poolId: pool,
        },
    });
    return query;
};
export { useUserTokensAndBalance, usePoolInfo, useUserPoolBalance, usePoolPooledTokens };
