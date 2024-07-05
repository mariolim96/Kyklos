"use client";

import React from "react";
import Image from "next/image";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Text } from "../ui/text";
import { useAtom } from "jotai";
import { selectedToken } from "~~/app/homepage/pools/components/atoms";

type Props = {
    list: {
        id: string;
        name: string;
        balance: number;
    }[];
    placeholder?: string;
};
const TokenSwapper = ({ list, placeholder }: Props) => {
    console.log("list:", list);
    const [selectedValue, setSelectedValue] = useAtom(selectedToken);

    return (
        <Select value={String(selectedValue)} onValueChange={value => setSelectedValue(Number(value))}>
            <SelectTrigger className=" border-0 w-64 shadow-none pl-1 h-12">
                <SelectValue placeholder={placeholder}>
                    <div className="flex items-center gap-2 ">
                        <Image
                            src={"/token.png"}
                            alt="kco2"
                            width="55"
                            height="55"
                            className=" align-middle content-center rounded-full inline"
                        />
                        <div className="flex flex-col justify-start items-start">
                            {list[Number(selectedValue)].name
                                .split("-")
                                .slice(0, 2)
                                .map((item, index) => (
                                    <Text as="h5" element="h5" className="font-semibold truncate" key={index}>
                                        {item}
                                    </Text>
                                ))}
                        </div>
                    </div>
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {list.map((item, index) => (
                        <SelectItem key={index} value={index.toString()}>
                            <div className="flex gap-2">
                                <Image
                                    src={"/token.png"}
                                    alt="kco2"
                                    width="55"
                                    height="55"
                                    className=" align-middle content-center rounded-full inline"
                                />
                                <div className="flex flex-col">
                                    <Text as="h5" element="h5" className="font-semibold">
                                        {item.name}
                                    </Text>
                                    <Text as="h5" element="h5" className="text-sm text-gray-500">
                                        {item.balance} KCO
                                    </Text>
                                </div>
                            </div>
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};
export default TokenSwapper;
