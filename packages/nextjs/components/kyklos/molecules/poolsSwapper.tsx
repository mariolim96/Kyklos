"use client";

import React from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Text } from "../ui/text";
import TokenSwapper from "./tokenSwapper";

type props = {
    list: {
        id: string;
        name: string;
        balance: number;
    }[];
    inputString: string;
    value: string;
    setValue: (value: string) => void;
    selectedValue: number;
};
function PoolSwapper({ list, inputString, selectedValue, setValue, value }: props) {
    return (
        <Card className="flex items-center justify-start p-2 px-4 bg-base z-20">
            <TokenSwapper list={list} placeholder="select the token" />
            <Separator orientation="vertical" className="h-16 m-2" />
            <div className="flex flex-col w-1/3 justify-start ">
                <Text as="h5" element="h5" className="font-semibold">
                    {list[selectedValue].balance} KCT
                </Text>
                <Text as="h5" element="h5" className="text-sm text-gray-500">
                    Carbon in pool
                </Text>
            </div>
            <Separator orientation="vertical" className="h-16 m-2" />
            <div className="flex w-1/3 justify-between">
                <div className="flex flex-col  w-1/3">
                    <Input
                        type="textfield"
                        className="w-20 h-8"
                        onChange={e => setValue(e.target.value)}
                        placeholder="0.0"
                        value={value}
                    ></Input>
                    <Text as="h5" element="h5" className="text-sm whitespace-nowrap text-gray-500">
                        {inputString ?? "BCT to Redeem"}
                    </Text>
                </div>
            </div>
        </Card>
    );
}

export default PoolSwapper;
