// CarbonPoolComponent.js
import React from "react";
import { cn } from "~~/utils/utils";

const CarbonPoolComponent = () => {
    const projects = [
        {
            name: "carbon project 001",
            code: "KYK-679745",
            value: "16.93 TCO2",
            percentage: "50.05%",
            color: "bg-blue-400",
        },
        {
            name: "carbon project 002",
            code: "KYK-125840",
            value: "5 TCO2",
            percentage: "14.78%",
            color: "bg-green-400",
        },
        {
            name: "carbon project 003",
            code: "KYK-177222",
            value: "11.9 TCO2",
            percentage: "35.17%",
            color: "bg-green-200",
        },
    ];

    return (
        <div className="bg-base p-6 rounded-lg shadow-md mb-8">
            <div className="flex items-center mb-4">
                <div className="bg-gray-200 p-4 rounded-full mr-4">
                    {/* <img src="/token.png" alt="Logo" className="h-8 w-8" /> */}
                </div>
                <div>
                    <div className="text-gray-500">Carbon Pool</div>
                    <div className="text-3xl font-semibold">$162.17</div>
                </div>
            </div>
            <div className="mb-4">
                <div className="text-lg font-semibold mb-2">Pool Composition</div>
                <div className="flex h-6">
                    {projects.map((project, index) => (
                        <div
                            key={index}
                            className={`h-full ${project.color}`}
                            style={{ width: project.percentage }}
                        ></div>
                    ))}
                </div>
            </div>
            <div className="flex basis-[49%] flex-wrap gap-4">
                {projects.map((project, index) => (
                    <>
                        <div
                            key={index}
                            className={cn(
                                "flex items-center px-2 pb-2  w-[49%]",
                                projects.length - 2 > index ? "border-b border-gray-200" : "pb-0",
                            )}
                        >
                            <div className={`h-2 w-2 rounded-full ${project.color} mr-2`}></div>
                            <div className="flex-1">
                                <div className="text-gray-700">{project.name}</div>
                                <div className="text-gray-400">{project.code}</div>
                            </div>
                            <div className="text-gray-700 mr-4">{project.value}</div>
                            <div className="text-gray-400">{project.percentage}</div>
                        </div>
                    </>
                ))}
            </div>
        </div>
    );
};

export default CarbonPoolComponent;
