import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Text } from "../ui/text";

function CarbonTonneCard() {
    return (
        <Card className="flex items-center justify-start p-2 px-4 bg-base-focus">
            <div className="flex w-1/3">
                <Image
                    src={"/token.png"}
                    alt="kco2"
                    width="55"
                    height="55"
                    className=" align-middle content-center rounded-full inline"
                />
                <div className="flex flex-col">
                    <Text as="h5" element="h5" className="font-semibold">
                        Base Carbon Tonne
                    </Text>
                    <Text as="h5" element="h5" className="text-sm text-gray-500">
                        BCT ($0.58)
                    </Text>
                </div>
            </div>
            <Separator orientation="vertical" className="h-16 m-2" />
            <div className="flex flex-col w-1/3 ">
                <Text as="h5" element="h5" className="font-semibold">
                    2
                </Text>
                <Text as="h5" element="h5" className="text-sm text-gray-500">
                    Balance in wallet
                </Text>
            </div>
            <Separator orientation="vertical" className="h-16 m-2" />
            <div className="flex w-1/3 justify-between">
                <div className="flex flex-col  w-1/3">
                    <Input type="textfield" className="w-20 h-8"></Input>
                    <Text as="h5" element="h5" className="text-sm whitespace-nowrap text-gray-500">
                        BCT to Redeem
                    </Text>
                </div>
                <Button>Max </Button>
            </div>
        </Card>
    );
}

export default CarbonTonneCard;
