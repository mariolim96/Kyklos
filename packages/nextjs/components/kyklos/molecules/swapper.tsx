"use client";

import React from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Text } from "../ui/text";
import TokenSwapper from "./tokenSwapper";
import { useAtom } from "jotai";
import { price, selectedToken } from "~~/app/homepage/pools/components/atoms";

type props = {
    list: {
        id: string;
        name: string;
        balance: number;
    }[];
    type?: "deposit" | "redeem" | "retire";
    secondInput?: string;
};

function CarbonTonneCard({ list, secondInput }: props) {
    const [tokenPrice, setPrice] = useAtom(price);
    const [selectedValue] = useAtom(selectedToken);
    return (
        <Card className="flex items-center justify-start p-2 px-4 bg-base">
            <TokenSwapper list={list} placeholder="select the token" />
            <Separator orientation="vertical" className="h-16 m-2" />
            <div className="flex flex-col w-1/3 justify-start ">
                <Text as="h5" element="h5" className="font-semibold">
                    {list[selectedValue].balance} KCO
                </Text>
                <Text as="h5" element="h5" className="text-sm text-gray-500">
                    {}
                </Text>
            </div>
            <Separator orientation="vertical" className="h-16 m-2" />
            <div className="flex w-1/3 justify-between">
                <div className="flex flex-col  w-1/3">
                    <Input
                        type="textfield"
                        className="w-20 h-8"
                        onChange={e => setPrice(e.target.value)}
                        placeholder="0.0"
                        value={tokenPrice}
                    ></Input>
                    <Text as="h5" element="h5" className="text-sm whitespace-nowrap text-gray-500">
                        {secondInput ?? "BCT to Redeem"}
                    </Text>
                </div>
                <Button
                    onClick={() => {
                        setPrice(String(list[selectedValue].balance));
                    }}
                >
                    Max
                </Button>
            </div>
        </Card>
    );
}
export default CarbonTonneCard;
