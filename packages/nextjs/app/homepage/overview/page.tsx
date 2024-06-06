import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
    title: "Debug Contracts",
    description: "Debug your deployed 🏗 Scaffold-ETH 2 contracts in an easy way",
});

const HomePage: NextPage = () => {
    return <div className="bg-slate-800"> overview</div>;
};

export default HomePage;
