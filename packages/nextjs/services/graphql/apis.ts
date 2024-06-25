"use client";

import { getUserTokens, getUserTokensResponse } from "./query";
import { useQuery } from "@apollo/client";
import { useAccount } from "wagmi";

const useUserTokensAndBalance = () => {
    const account = useAccount();
    const { data, loading, error } = useQuery<getUserTokensResponse>(getUserTokens, {
        variables: { address: account.address?.toLowerCase() },
        skip: !account.address,
    });
    return { data, loading, error };
};

export { useUserTokensAndBalance };
