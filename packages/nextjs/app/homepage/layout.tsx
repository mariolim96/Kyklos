import { KyklosLayout } from "~~/components/AppLayoutWithProviders";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
    title: "Block Explorer",
    description: "Block Explorer created with 🏗 Scaffold-ETH 2",
});

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <KyklosLayout>
            <div className="p-8">{children}</div>
        </KyklosLayout>
    );
};

export default HomeLayout;
