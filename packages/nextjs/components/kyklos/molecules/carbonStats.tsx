// CarbonStats.js
import React from "react";

const CarbonStats = () => {
    const stats = [
        { label: "Total carbon bridged", value: "21,890,661" },
        { label: "Total carbon locked", value: "19,905,783" },
        { label: "Total liquidity", value: "1,810,027" },
        { label: "Total carbon retired", value: "210,338" },
    ];

    return (
        <div className="bg-base mb-8 px-6 border-[1px] border-gray-300 rounded-lg shadow-md flex justify-around items-center">
            {stats.map((stat, index) => (
                <React.Fragment key={index}>
                    <div className="text-center">
                        <div className="text-base-content-3">{stat.label}</div>
                        <div className="text-2xl font-semibold text-base-content-4">{stat.value}</div>
                    </div>
                    {index < stats.length - 1 && <div className="w-px h-20 bg-gray-300 "></div>}
                </React.Fragment>
            ))}
        </div>
    );
};

export default CarbonStats;
