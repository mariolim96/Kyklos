"use client";

import TokenList from "./components/tokenList";
import type { NextPage } from "next";
import { Label } from "~~/components/kyklos/ui/label";

const HomePage: NextPage = () => {
    return (
        <>
            <Label className="px-[1px] font-bold text-lg">Pool</Label>
            <TokenList />
        </>
    );
};

export default HomePage;
