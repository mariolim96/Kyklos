// InfoCards.js
import React from "react";
import { BsBoxArrowInDown } from "react-icons/bs";
import { HiArrowSmRight, HiOutlineArrowRight } from "react-icons/hi";
import { MdOutlineInsights } from "react-icons/md";
import { TbHexagons } from "react-icons/tb";

const InfoCards = () => {
    const cards = [
        {
            title: "Carbon Pools",
            description:
                "Access biochar carbon removals available to purchase and retire 24/7 with instant order execution.",
            icon: <TbHexagons className="w-full h-full text-secondary" />,
            href: "/pools",
        },
        {
            title: "Explorer",
            description: "Discover engineered carbon removal projects verified under the Puro Standard.",
            icon: <MdOutlineInsights className="w-full h-full text-secondary" />,
            href: "/explorer",
        },
        {
            title: "Carbon Bridge",
            description: "Tokenize carbon removals from supported source registries on a 1-1 verifiable basis.",
            icon: <HiArrowSmRight className="w-full h-full text-secondary" />,
            href: "/bridge",
        },
        {
            title: "Retirements",
            description: "Create impact claims by retiring KCO2s and removing them permanently from circulation.",
            icon: <BsBoxArrowInDown className="w-full h-full text-secondary" />,
            href: "/retirements",
        },
    ];

    return (
        <div className="flex gap-4 sm:flex-col md:lg:xl:2xl:flex-row justify-between">
            {cards.map((card, index) => (
                <a
                    key={index}
                    className="h-60 p-9 bg-base hover:bg-base-2-focus rounded-xl shadow-xs hover:shadow-md relative overflow-hidden outline outline-1 outline-line hover:outline-transparent transition-all duration-300 group"
                    href={card.href}
                >
                    <div className="flex items-center text-base-content text-base font-semibold">
                        {card.title}
                        <HiOutlineArrowRight className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-[18px] h-[18px]" />
                    </div>
                    <div className="mt-2 max-w-64 text-base-content-3 text-sm">{card.description}</div>
                    <div className="w-32 h-32 absolute -right-8 -bottom-8 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                        {card.icon}
                    </div>
                </a>
            ))}
        </div>
    );
};

export default InfoCards;
