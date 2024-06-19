import React from "react";
import Image from "next/image";
import { useQuery } from "@apollo/client";
import { ColumnDef } from "@tanstack/react-table";
import { useAccount } from "wagmi";
import ListVisualizer from "~~/components/kyklos/organism/listVisualizer";
import { Button } from "~~/components/kyklos/ui/button";
import { Text } from "~~/components/kyklos/ui/text";
import { UserTokenOwned, getUserTokens } from "~~/services/graphql/query";
import { modalSelectors } from "~~/services/store/modals";

const TokenList = () => {
    const { address } = useAccount();
    const openModal = modalSelectors.use.openModal();
    const modals = modalSelectors.use.modals();
    console.log("modals:", modals);
    const { loading, data } = useQuery(getUserTokens, {
        variables: { address: address?.toLowerCase() },
        skip: !address,
        // pollInterval: 1000,
    });
    console.log("{ loading, data }:", { loading, data });
    const columns: ColumnDef<UserTokenOwned>[] = [
        {
            id: "retirementImage",
            header: "",
            accessorKey: "",
            size: 2,
            cell: () => {
                return (
                    <div className="flex items-center justify-center">
                        <Image
                            src={"/token.png"}
                            alt="kco2"
                            width="55"
                            height="55"
                            className=" align-middle content-center rounded-full"
                        />
                    </div>
                );
            },
        },
        {
            header: "Token balance",
            accessorKey: "balance",
            size: 20,
            cell: cell => {
                const val = Number(cell.getValue());
                const valInTonne = val / 1e18;
                return (
                    <Text as="h3" element="h3" className="px-2">
                        {valInTonne} KCO2
                    </Text>
                );
            },
        },
        {
            size: 20,
            header: "Project Name",
            accessorKey: "token.projectVintage.project.projectId",
            cell: cell => (
                <Text as="h3" element="h3" className="px-2">
                    {cell.getValue() as string}
                </Text>
            ),
        },
        {
            id: "retire",
            size: 60,
            header: "",
            cell: cell => {
                return (
                    <div className="flex flex-end justify-end p-4">
                        <Button
                            onClick={e => {
                                e.stopPropagation();
                                console.log(cell);
                                openModal("modals", { token: cell.row.original });
                            }}
                        >
                            Retire
                        </Button>
                    </div>
                );
            },
        },
    ];
    const rows: UserTokenOwned[] = data?.user?.tokensOwned || [];
    return <ListVisualizer columns={columns} data={rows} isLoading={loading} />;
};

export default TokenList;
