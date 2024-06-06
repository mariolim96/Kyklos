import { ScaffoldEthAppLayout } from "~~/components/AppLayoutWithProviders";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
    title: "Block Explorer",
    description: "Block Explorer created with 🏗 Scaffold-ETH 2",
});

const DebugLayout = ({ children }: { children: React.ReactNode }) => {
    return <ScaffoldEthAppLayout>{children}</ScaffoldEthAppLayout>;
};

export default DebugLayout;
