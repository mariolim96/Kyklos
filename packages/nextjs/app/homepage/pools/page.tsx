"use client";

import PoolList from "./components/poolList";
import TokenList from "./components/tokenList";
import type { NextPage } from "next";
import { Label } from "~~/components/kyklos/ui/label";
import { Text } from "~~/components/kyklos/ui/text";

const HomePage: NextPage = () => {
    return (
        <>
            <Text as="h1" element="h1" className="text-3xl font-bold">
                Assets
            </Text>
            <Label className="px-[1px] inline-block font-bold text-lg pt-8">Kyklos Carbon Tokens</Label>
            <TokenList />
            <Label className="px-[1px] inline-block font-bold text-lg pt-8">Carbon Pool</Label>
            <PoolList />
        </>
    );
};

export default HomePage;
