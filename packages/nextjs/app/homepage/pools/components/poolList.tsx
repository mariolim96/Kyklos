import React, { ReactElement } from "react";
import { ColumnDef } from "@tanstack/react-table";
import ListVisualizer from "~~/components/kyklos/organism/listVisualizer";
import { Badge } from "~~/components/kyklos/ui/badge";
import { Button } from "~~/components/kyklos/ui/button";
import { Text } from "~~/components/kyklos/ui/text";
import { usePoolInfo, useUserPoolBalance } from "~~/services/graphql/apis";
import { modalSelectors } from "~~/services/store/modals";

function PoolList(): ReactElement {
    const openModal = modalSelectors.use.openModal();
    const { data, loading: loadingPool } = usePoolInfo();
    const { data: data1, loading: loadBalance } = useUserPoolBalance();

    type PoolTokens = {
        balance: number | bigint;
        carbonLocked: number | bigint;
        price: number;
        poolCriteria: string[];
    };
    const loading = loadingPool || loadBalance;
    const columns: ColumnDef<PoolTokens>[] = [
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
            header: "Carbon Locked",
            accessorKey: "carbonLocked",
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
            header: "Price",
            accessorKey: "price",
            size: 20,
            cell: cell => {
                const val = Number(cell.getValue());
                return (
                    <Text as="h3" element="h3" className="px-2">
                        {val} €
                    </Text>
                );
            },
        },
        {
            header: "Pool Criteria",
            accessorKey: "poolCriteria",
            size: 20,
            cell: cell => {
                return (
                    <Text as="h3" element="h3" className=" flex flex-wrap gap-2">
                        {(cell.getValue() as string[]).map((criteria, index) => (
                            <Badge key={index} variant={"info"} className="mr-2 rounded-badge">
                                {criteria}
                            </Badge>
                        ))}
                    </Text>
                );
            },
        },
        {
            id: "retire",
            size: 60,
            header: "",
            cell: cell => {
                return (
                    <div className="flex flex-end justify-end gap-4 p-4">
                        <Button
                            onClick={e => {
                                e.stopPropagation();
                                console.log(cell);
                                openModal("deposit", { token: cell.row.original });
                            }}
                        >
                            Deposit
                        </Button>
                        <Button
                            onClick={e => {
                                e.stopPropagation();
                                console.log(cell);
                                openModal("redeem", { token: cell.row.original });
                            }}
                        >
                            Redeem
                        </Button>
                    </div>
                );
            },
        },
    ];
    const fakeData: PoolTokens[] = [
        {
            balance: data1?.userPoolBalance?.balance ?? 0,
            carbonLocked: data?.pool?.totalCarbonLocked ?? 0,
            price: 192.65,
            poolCriteria: ["criteria1", "criteria2"],
        },
    ];
    const rows = fakeData;
    return <ListVisualizer columns={columns} data={rows} isLoading={loading} />;
}

export default PoolList;
