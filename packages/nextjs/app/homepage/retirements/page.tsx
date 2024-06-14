import RetirementList from "./component/retirementList";
import type { NextPage } from "next";
import RetirementSummary from "~~/components/kyklos/organism/retirementSummary";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
    title: "Debug Contracts",
    description: "Debug your deployed 🏗 Scaffold-ETH 2 contracts in an easy way",
});

const HomePage: NextPage = () => {
    return (
        <div className="">
            <RetirementSummary />
            <RetirementList />
        </div>
    );
};

export default HomePage;
