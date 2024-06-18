import type { NextPage } from "next";
import CarbonPoolComponent from "~~/components/kyklos/molecules/carbonPoolComponent";
import CarbonStats from "~~/components/kyklos/molecules/carbonStats";
import InfoCards from "~~/components/kyklos/organism/infoCards";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
    title: "Debug Contracts",
    description: "Debug your deployed 🏗 Scaffold-ETH 2 contracts in an easy way",
});

const HomePage: NextPage = () => {
    return (
        <div className="">
            <CarbonStats />

            <CarbonPoolComponent></CarbonPoolComponent>
            <InfoCards />
        </div>
    );
};

export default HomePage;
