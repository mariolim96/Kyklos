"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { useQuery } from "@apollo/client";
import { useAccount } from "wagmi";
import {
    allRetirementCategoryAndAmount,
    getAllUserRetirementCategoryAndAmount,
    getAllUserRetirementCategoryAndAmountType,
} from "~~/services/graphql/query";

const initialCategories = [
    { name: "test category", percentage: 0, color: "bg-green-500" },
    { name: "Energy Efficiency", percentage: 0, color: "bg-orange-500" },
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
    if (!data) return categories;
    let amount = 0;
    const categoryMap = new Map<string, number>();
    data.forEach(retirement => {
        amount += retirement.amount;
        const category = retirement.token.projectVintage.project.category;
        if (categoryMap.has(category)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            categoryMap.set(category, categoryMap.get(category)! + retirement.amount);
        } else {
            categoryMap.set(category, retirement.amount);
        }
    });
    return categories.map(category => {
        const percentage = (categoryMap.get(category.name) ?? 0) / amount;
        return { ...category, percentage: percentage * 100 };
    });
};

const RetirementSummary = () => {
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
    const updatedCategories = generateCategoryPercentage(initialCategories, data?.user?.retirementsCreated);
    return (
        <Suspense
            fallback={
                <div className="p-6 m-4 bg-white shadow-lg rounded-md">
                    <Skeleton />
                </div>
            }
        >
            <div className="p-6 m-4 bg-white shadow-lg rounded-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">My Retirements</h2>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <div className="text-gray-500">Total Retirements</div>
                    <div className="text-2xl font-bold">1 TCO2</div>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <div className="text-gray-500">Retirement Breakdown</div>
                    <div className="text-gray-500">Hide details</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6 mb-6">
                    <div className="bg-green-500 h-6 rounded-full" style={{ width: "100%" }}></div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-gray-700">
                    {updatedCategories.map((category, index) => (
                        <div key={index} className="flex items-center">
                            <span className={`w-3 h-3 mr-2 rounded-full ${category.color}`}></span>
                            <span>
                                {category.name} ({category.percentage.toFixed(2)}%)
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </Suspense>
    );
};

export default RetirementSummary;
