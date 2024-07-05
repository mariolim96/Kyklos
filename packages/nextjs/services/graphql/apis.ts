"use client";

import {
    getPool,
    getPoolType,
    getUserPoolBalance,
    getUserPoolBalanceType,
    getUserTokens,
    getUserTokensResponse,
} from "./query";
import { useQuery } from "@apollo/client";
import { useAccount } from "wagmi";

const useUserTokensAndBalance = () => {
    const account = useAccount();
    const query = useQuery<getUserTokensResponse>(getUserTokens, {
        variables: { address: account.address?.toLowerCase() },
        skip: !account.address,
    });
    return query;
};

const usePoolInfo = () => {
    const pool = "0x0B306BF915C4d645ff596e518fAf3F9669b97016".toLowerCase();
    const query = useQuery<getPoolType>(getPool, {
        variables: { id: pool },
    });
    return query;
};

const useUserPoolBalance = () => {
    const account = useAccount();
    const pool = "0x0B306BF915C4d645ff596e518fAf3F9669b97016";
    const query = useQuery<getUserPoolBalanceType>(getUserPoolBalance, {
        variables: { id: `${account.address}-${pool}`.toLowerCase() },
        skip: !account.address,
    });
    return query;
};
export { useUserTokensAndBalance, usePoolInfo, useUserPoolBalance };
