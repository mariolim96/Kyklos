"use client";

import React, { Suspense } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Skeleton } from "../ui/skeleton";
import { Text } from "../ui/text";
import { useQuery } from "@apollo/client";
import { MdKeyboardArrowDown } from "react-icons/md";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { useAccount } from "wagmi";
import {
    allRetirementCategoryAndAmount,
    getAllUserRetirementCategoryAndAmount,
    getAllUserRetirementCategoryAndAmountType,
} from "~~/services/graphql/query";
import { cn } from "~~/utils/utils";

const initialCategories = [
    { name: "Solar", percentage: 0, color: "bg-green-500" },
    { name: "Energy", percentage: 0, color: "bg-orange-500" },
    { name: "Chemical & Industrial", percentage: 0, color: "bg-purple-500" },
    { name: "Other", percentage: 0, color: "bg-blue-500" },
    { name: "Agriculture", percentage: 0, color: "bg-lime-500" },
    { name: "Waste Disposal", percentage: 0, color: "bg-red-500" },
    { name: "Alternative Materials", percentage: 0, color: "bg-cyan-500" },
    { name: "Renewable Energy", percentage: 0, color: "bg-yellow-500" },
    { name: "Transporting", percentage: 0, color: "bg-pink-500" },
    { name: "Biomass Removal", percentage: 0, color: "bg-indigo-500" },
];

const generateCategoryPercentage = (
    categories: {
        name: string;
        percentage: number;
        color: string;
    }[],
    data?: allRetirementCategoryAndAmount[],
) => {
    if (!data) return { categories, total: 0 };
    let amount = 0;
    let amoutInKco2 = 0;
    const categoryMap = new Map<string, number>();
    data.forEach(retirement => {
        amount += retirement.amount;
        amoutInKco2 += retirement.amount / 1e18;
        const category = retirement.token.projectVintage.project.category;
        if (categoryMap.has(category)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            categoryMap.set(category, categoryMap.get(category)! + retirement.amount);
        } else {
            categoryMap.set(category, retirement.amount);
        }
    });
    return {
        categories: categories.map(category => {
            const percentage = (categoryMap.get(category.name) ?? 0) / amount;
            return { ...category, percentage: percentage * 100 };
        }),
        total: amoutInKco2,
    };
};

const RetirementSummary = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const { address } = useAccount();
    const { data, loading } = useQuery<getAllUserRetirementCategoryAndAmountType>(
        getAllUserRetirementCategoryAndAmount,
        {
            variables: { id: address?.toLowerCase() },
            skip: !address,
        },
    );
    if (loading)
        return (
            <div className="p-6 m-4 bg-white shadow-lg rounded-md">
                <Skeleton />
            </div>
        );
    const { categories: updatedCategories, total } = generateCategoryPercentage(
        initialCategories,
        data?.user?.retirementsCreated,
    );
    return (
        <Suspense
            fallback={
                <div className="p-6 m-4 bg-white shadow-lg rounded-md">
                    <Skeleton />
                </div>
            }
        >
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <div className="flex-col flex rounded-lg p-6 bg-white mb-8 md:flex-row shadow-sm border border-gray-200">
                    <div className="pb-6 border-b border-gray-200 md:pr-6 md:pb-0 md:border-r md:border-b-0 min-w-[170px]">
                        <span className="font-medium text-base-content-3 whitespace-nowrap">
                            Total Retirements
                            <RxQuestionMarkCircled className="inline-block ml-2" />
                        </span>
                        <div className="flex justify-self-center transition-colors duration-300 text-gray-400 hover:text-gray-500"></div>
                        <Text as="h2" element="h2" className="block border-0">
                            {total} KCO2
                        </Text>
                    </div>
                    <div className="flex-auto  sm:pl-0  sm:pt-6 sm:ml-0 md:ml-6  xl:ml-6 md:pt-0 xl:pt-0">
                        <div className="flex justify-between mb-1 gap-1">
                            <span className="font-medium text-base-content-3">
                                Retirement Breakdown <RxQuestionMarkCircled className="inline-block mx-[1px]" />
                            </span>
                            <CollapsibleTrigger asChild>
                                <div className="text-base-content-3 font-semibold cursor-pointer whitespace-nowrap">
                                    {isOpen ? "Hide details" : "Show details"}
                                    <MdKeyboardArrowDown
                                        className={cn(
                                            "h-6 w-6 inline-block transition-transform",
                                            isOpen ? "rotate-180" : "",
                                        )}
                                    />
                                </div>
                            </CollapsibleTrigger>
                        </div>
                        <div className="flex rounded overflow-hidden w-full bg-gray-200 mb-2">
                            {/* <div className="bg-green-500 h-6 rounded-md" style={{ width: "100%" }}></div> */}
                            {updatedCategories.map((category, index) => (
                                <div
                                    key={index}
                                    className={cn(" h-6 transition-[width] duration-200", category.color)}
                                    style={{ width: `${category.percentage}%` }}
                                />
                            ))}
                        </div>
                        <CollapsibleContent>
                            <div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 xl:grid-cols-3 gap-4 text-gray-700">
                                {updatedCategories.map((category, index) => (
                                    <div key={index} className="flex items-center">
                                        <span
                                            className={`w-[10px] h-[10px] mr-2 rounded-full ${category.color}`}
                                        ></span>
                                        <span
                                            className={cn(
                                                "text-sm",
                                                category.percentage === 0
                                                    ? "font-semibold text-base-content-3 opacity-70"
                                                    : "font-semibold text-base-content-2 ",
                                            )}
                                        >
                                            {category.name} ({category.percentage.toFixed(2)}%)
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CollapsibleContent>
                    </div>
                </div>
            </Collapsible>
        </Suspense>
    );
};

export default RetirementSummary;
