"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { BsBoxArrowInDown } from "react-icons/bs";
import { CgShapeHexagon } from "react-icons/cg";
import { CiUser } from "react-icons/ci";
import { FaFileContract } from "react-icons/fa6";
import { LuTreePine } from "react-icons/lu";
import { MdOutlineCo2 } from "react-icons/md";
import { PiCoinVertical } from "react-icons/pi";
import { TbAtom2 } from "react-icons/tb";
import { AvatarImage } from "~~/components/kyklos/molecules/Avatar";
import InfoTab from "~~/components/kyklos/molecules/infoTab";
import { Button } from "~~/components/kyklos/ui/button";
import { Label } from "~~/components/kyklos/ui/label";
import { Separator } from "~~/components/kyklos/ui/separator";
import { Text } from "~~/components/kyklos/ui/text";
import { useNavigate } from "~~/hooks/kyklos/useNavigate";
import { GetRetirementType, getRetirement } from "~~/services/graphql/query";
import { kcoToTonne } from "~~/utils/converter";
import { formatTimestamp } from "~~/utils/time";

export default function Page({ params }: { params: { id: string } }) {
    const { loading, data } = useQuery<GetRetirementType>(getRetirement, {
        variables: { id: params.id },
    });
    const iconsStyle = {
        width: "42px",
        height: "45px",
    };

    const navigate = useNavigate();
    if (loading) {
        return (
            <div className="w-full flex items-center justify-center">
                <Text as="h1" element="h1" className="text-white text-5xl lg:text-5xl">
                    Loading...
                </Text>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="w-full flex items-center justify-center">
                <Text as="h1" element="h1" className="text-white text-5xl lg:text-5xl">
                    No data available
                </Text>
            </div>
        );
    }

    const amount = kcoToTonne(data.retirement.amount);
    const time = formatTimestamp(data.retirement.certificate.createdAt);
    return (
        <div className="w-full p-[10px]">
            <div className="flex items-center flex-col">
                <div className="relative w-full min-h-[656px] md:min-h-[600px] rounded-t-md shadow-lg overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: "url('/PanamaReforestation.jpg')" }}
                    ></div>
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="relative z-10 p-4 flex flex-col min-h-[656px] md:min-h-[600px] h-full justify-between">
                        <Text as="h1" element="h1" className="text-white text-5xl lg:text-5xl">
                            Carbon retirement
                            <br /> certificate
                        </Text>
                        <div>
                            <Text as="h1" element="h3" className="text-white text-5xl lg:text-6xl ">
                                {amount} tonnes
                            </Text>
                            <Text as="h2" element="h3" className="text-white ">
                                of carbon credits have been retired on {time}
                            </Text>
                        </div>
                        <div className="flex justify-between text-white">
                            <InfoTab
                                image={<LuTreePine style={iconsStyle} />}
                                title={
                                    <Text as="h6" element="h4" className="text-white">
                                        Category
                                    </Text>
                                }
                                subTitle={
                                    <Text as="h4" element="h4" className="text-white">
                                        {data.retirement.token.projectVintage.project.category}
                                    </Text>
                                }
                            />
                            <InfoTab
                                image={<TbAtom2 style={iconsStyle} />}
                                title={
                                    <Text as="h6" element="h4" className="text-white">
                                        Standard
                                    </Text>
                                }
                                subTitle={
                                    <Text as="h4" element="h4" className="text-white">
                                        {data.retirement.token.projectVintage.project.standard}
                                    </Text>
                                }
                            />
                            <InfoTab
                                image={<CiUser style={iconsStyle} />}
                                title={
                                    <Text as="h6" element="h4" className="text-white">
                                        Retired by
                                    </Text>
                                }
                                subTitle={
                                    <Text as="h4" element="h4" className="text-white">
                                        {data.retirement.certificate.retiringEntityString}
                                    </Text>
                                }
                            />
                            <InfoTab
                                image={<CiUser style={iconsStyle} />}
                                title={
                                    <Text as="h6" element="h4" className="text-white">
                                        beneficiary
                                    </Text>
                                }
                                subTitle={
                                    <Text as="h4" element="h4" className="text-white">
                                        {data.retirement.certificate.beneficiaryString}
                                    </Text>
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="w-full p-6 bg-base rounded-b-md ">
                    <div className="flex justify-between items-center mb-6">
                        <InfoTab
                            image={<PiCoinVertical style={iconsStyle} />}
                            title={
                                <Text as="h5" element="h4" className="text-base-content-3">
                                    Credit source
                                </Text>
                            }
                            subTitle={
                                <Text as="h3" element="h4" className="">
                                    {data.retirement.token.projectVintage.project.projectId}
                                </Text>
                            }
                        />
                        <Button
                            variant="outline"
                            onClick={() => {
                                navigate.replace(
                                    `homepage/projects/${data.retirement.token.projectVintage.project.id}`,
                                );
                            }}
                        >
                            See project details
                        </Button>
                    </div>
                    <div className="min-h-[250px] w-full bg-green-100 rounded-md my-8 flex flex-col items-center justify-center">
                        <Text as="h1" element="blockquote" className="text-base-content font-medium">
                            &quot;{data.retirement.certificate.retirementMessage}&quot;
                        </Text>
                    </div>
                    <Label className="pt-8 text-xl font-semibold mb-6 block">Retirement Details</Label>
                    <div className="flex justify-between mb-4">
                        <InfoTab
                            image={<LuTreePine style={iconsStyle} className="text-base-content-2 w-32" />}
                            title={
                                <Text as="h6" element="h5" className="text-base-content-3 w-32">
                                    Credit Category
                                </Text>
                            }
                            subTitle={
                                <Text as="h4" element="h4" className="text-base-content-2 w-32">
                                    {data.retirement.token.projectVintage.project.category}
                                </Text>
                            }
                        />
                        <InfoTab
                            image={<MdOutlineCo2 style={iconsStyle} className="text-base-content-2 w-32" />}
                            title={
                                <Text as="h6" element="h5" className="text-base-content-3 w-32">
                                    Retired amount
                                </Text>
                            }
                            subTitle={
                                <Text as="h4" element="h4" className="text-base-content-2 w-32">
                                    {amount} KCO2
                                </Text>
                            }
                        />
                        <InfoTab
                            image={<BsBoxArrowInDown style={iconsStyle} className="text-base-content-2 w-32" />}
                            title={
                                <Text as="h6" element="h5" className="text-base-content-3 w-32">
                                    Retired on
                                </Text>
                            }
                            subTitle={
                                <Text as="h4" element="h4" className="text-base-content-2 w-32">
                                    {time.split(",")[0]}
                                </Text>
                            }
                        />
                    </div>
                    <Separator className="my-10" />
                    <h1 className=" text-xl font-semibold mb-6">On-chain Details</h1>
                    <div className="flex justify-between mb-6">
                        <InfoTab
                            image={<AvatarImage src="hello" />}
                            title={
                                <Text as="h6" element="h5" className="text-base-content-3 w-32">
                                    Retiring entity
                                </Text>
                            }
                            subTitle={
                                <Text as="h4" element="h4" className="text-base-content-2 w-32">
                                    {data.retirement.certificate.retiringEntityString}
                                </Text>
                            }
                        />
                        <InfoTab
                            image={<MdOutlineCo2 style={iconsStyle} className="text-base-content-2 w-32" />}
                            title={
                                <Text as="h6" element="h5" className="text-base-content-3 w-32">
                                    Retirement transaction
                                </Text>
                            }
                            subTitle={
                                <Text as="h4" element="h4" className="text-base-content-2 w-32">
                                    transaction hash
                                </Text>
                            }
                        />
                        <InfoTab
                            image={<CgShapeHexagon style={iconsStyle} className="text-base-content-2 w-32" />}
                            title={
                                <Text as="h6" element="h5" className="text-base-content-3">
                                    project specific token
                                </Text>
                            }
                            subTitle={
                                <Text as="h4" element="h4" className="text-base-content-2 truncate w-32">
                                    {data.retirement.token.name.split(":")[1]}
                                </Text>
                            }
                        />
                    </div>
                    <div className="flex justify-between mb-6">
                        <InfoTab
                            image={<AvatarImage src="hello" />}
                            title={
                                <Text as="h6" element="h5" className="text-base-content-3 w-32">
                                    Beneficiary
                                </Text>
                            }
                            subTitle={
                                <Text as="h4" element="h4" className="text-base-content-2 w-32">
                                    {data.retirement.certificate.beneficiaryString}
                                </Text>
                            }
                        />
                        <InfoTab
                            image={<CgShapeHexagon style={iconsStyle} className="text-base-content-2 w-32" />}
                            title={
                                <Text as="h6" element="h5" className="text-base-content-3 w-32">
                                    Beneficiary address
                                </Text>
                            }
                            subTitle={
                                <Text
                                    as="h4"
                                    element="h4"
                                    className="text-base-content-2 text-ellipsis overflow-hidden w-32"
                                >
                                    {data.retirement.certificate.beneficiary.id}
                                </Text>
                            }
                        />
                        <InfoTab
                            image={<FaFileContract style={iconsStyle} className="text-base-content-2 w-32" />}
                            title={
                                <Text as="h6" element="h5" className="text-base-content-3 w-32">
                                    Token smart contract
                                </Text>
                            }
                            subTitle={
                                <Text
                                    as="h4"
                                    element="h4"
                                    className="text-base-content-2 text-ellipsis overflow-hidden w-32"
                                >
                                    {data.retirement.token.id}
                                </Text>
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
