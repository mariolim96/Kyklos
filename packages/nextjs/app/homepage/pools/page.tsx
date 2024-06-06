import { useQuery } from "@apollo/client";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Label } from "~~/components/kyklos/ui/label";

const HomePage: NextPage = () => {
    const account = useAccount();
    // user address
    // const query = useQuery;
    // const address = userAddress();
    return (
        <>
            <Label className="m-4 font-bold text-lg">{JSON.stringify(account)}</Label>
        </>
    );
};

export default HomePage;
