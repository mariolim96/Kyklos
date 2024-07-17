import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { Text } from "../ui/text";

export type List = {
    id: string;
    title: string;
    subtitle?: string;
    balance?: number;
};

type props = {
    listImage?: string;
    list: List[];
    // for dropdown
    setSelectedValue?: (value: string) => void;
    selectedValue?: string;

    type: keyof typeof messageTypes;
    value: string;
    setValue: (value: string) => void;
    hasMaxButton?: boolean;
    isMonoElement?: boolean;
};

const messageTypes = {
    deposit: {
        first: "Balance KCO2",
        firstInfo: "KCO2 in wallet",
        second: "Deposit KCO2 to the pool",
    },
    redeem: {
        first: "Available in pool",
        firstInfo: "",
        second: "Redeem KCO2 from pool",
    },
    carbonPoolRedeem: {
        first: "Balance in wallet",
        firstInfo: "",
        second: "KCT needed to redeem",
    },
    retire: {
        first: "Available balance",
        second: "KCO2 to retire",
        firstInfo: "KCO2 in wallet",
    },
};

const Swapper = ({
    list,
    type,
    value,
    setValue,
    setSelectedValue,
    selectedValue,
    listImage,
    hasMaxButton,
    isMonoElement,
}: props) => {
    console.log({
        list,
        type,
        value,
        setValue,
        setSelectedValue,
        selectedValue,
        listImage,
        hasMaxButton,
        isMonoElement,
    });
    // const val = list[Number(selectedValue)]?.balance;
    // console.log("val:", val);
    // console.log("selectedValue:", selectedValue);
    return (
        <Card className="flex items-center justify-start p-2 px-4 bg-base z-20">
            <TokenSwapper
                list={list}
                placeholder="select the token"
                selectedValue={selectedValue}
                setSelectedValue={setSelectedValue}
                listImage={listImage}
                isMonoElement={isMonoElement}
            />
            <Separator orientation="vertical" className="h-16 m-2" />
            <div className="flex flex-col w-1/3 justify-start ">
                <Text as="h5" element="h5" className="font-semibold truncate">
                    {list[Number(selectedValue ?? 0)]?.balance} {messageTypes[type].firstInfo}
                </Text>
                <Text as="h5" element="h5" className="text-sm text-gray-500">
                    {messageTypes[type].first}
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
                    />
                    <Text as="h5" element="h5" className="text-sm whitespace-nowrap text-gray-500">
                        {messageTypes[type].second}
                    </Text>
                </div>
                {hasMaxButton && (
                    <Button
                        onClick={() => {
                            setValue(String(list[Number(selectedValue)]?.balance));
                        }}
                    >
                        Max
                    </Button>
                )}
            </div>
        </Card>
    );
};

type Props = {
    listImage?: string;
    list: {
        id: string;
        title: string;
        subtitle?: string;
        balance?: number;
    }[];
    placeholder: string;
    selectedValue?: string;
    setSelectedValue?: (value: string) => void;
    isMonoElement?: boolean;
};

const TokenSwapper = ({
    listImage = "/token.png",
    list,
    placeholder,
    selectedValue,
    setSelectedValue,
    isMonoElement,
}: Props) => {
    if (isMonoElement)
        return (
            <div>
                <div className="flex items-center gap-2 pl-2 border-0 w-64 shadow-none h-12">
                    <Image
                        src={listImage}
                        alt="kco2"
                        width="55"
                        height="55"
                        className=" align-middle content-center rounded-full inline"
                    />
                    <div className="flex flex-col ">
                        <Text as="h5" element="h5" className="font-semibold">
                            {list[0]?.title}
                        </Text>
                        <Text as="h5" element="h5" className="text-sm text-gray-500">
                            {list[0]?.subtitle}
                        </Text>
                    </div>
                </div>
            </div>
        );

    return (
        <Select value={String(selectedValue)} onValueChange={value => setSelectedValue?.(value)}>
            <SelectTrigger className=" border-0 w-64 shadow-none px-3 py-2 h-12">
                <SelectValue placeholder={placeholder}>
                    <div className="flex items-center gap-2 truncate ">
                        <Image
                            src={listImage}
                            alt="kco2"
                            width="55"
                            height="55"
                            className=" align-middle content-center rounded-full inline"
                        />
                        <div className="flex flex-col truncate  ">
                            <Text as="h5" element="h5" className="font-semibold truncate ">
                                {list[Number(selectedValue)]?.title}
                            </Text>
                            <Text as="h5" element="h5" className="text-sm text-gray-500 truncate">
                                {list[Number(selectedValue)]?.subtitle}
                            </Text>
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
                                        {item.title}
                                    </Text>
                                    <Text as="h5" element="h5" className="text-sm text-gray-500">
                                        {item.subtitle}
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

export default Swapper;
