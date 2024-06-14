"use client";

import React from "react";
import Image from "next/image";
import { useQuery } from "@apollo/client";
import { ColumnDef } from "@tanstack/react-table";
import { useAccount } from "wagmi";
import ListVisualizer from "~~/components/kyklos/organism/listVisualizer";
import { Button } from "~~/components/kyklos/ui/button";
import { Text } from "~~/components/kyklos/ui/text";
import { useNavigate } from "~~/hooks/kyklos/useNavigate";
import { getUserRetirements, getUserRetirementsType, userRetirements } from "~~/services/graphql/query";
import { formatTimestamp } from "~~/utils/time";

const RetirementList = () => {
    const { address } = useAccount();

    const { loading, data } = useQuery<getUserRetirementsType>(getUserRetirements, {
        variables: { id: address?.toLowerCase() },
        skip: !address,
        // pollInterval: 1000,
    });
    const navigate = useNavigate();
    console.log("data:", data);
    const columns: ColumnDef<userRetirements>[] = [
        {
            id: "retirementImage",
            header: "",
            accessorKey: "",
            size: 2,
            cell: () => {
                return (
                    <div className="flex items-center justify-center">
                        <Image
                            src={"/retirement.png"}
                            alt="retirement"
                            width="50"
                            height={"50"}
                            className=" align-middle content-center rounded-full"
                        />
                    </div>
                );
            },
        },
        {
            id: "retirementDate",
            size: 20,
            header: "Date",
            accessorKey: "timestamp",
            cell: cell => {
                const val = cell.getValue() as number;

                return (
                    <Text as="h3" element="h3" className="px-2">
                        {formatTimestamp(val)}
                    </Text>
                );
            },
        },
        {
            id: "retirementAmount",
            header: "Token balance",
            accessorKey: "amount",

            size: 20,
            cell: cell => {
                const val = Number(cell.getValue()) / 1e18;
                return (
                    <Text as="h3" element="h3" className="px-2">
                        {val} KCO2
                    </Text>
                );
            },
        },
        {
            id: "projectName",
            size: 20,
            header: "Project Name",
            accessorKey: "token.projectVintage.project.projectId",

            cell: cell => {
                return (
                    <Text as="h3" element="h3" className="px-2">
                        {cell.getValue() as string}
                    </Text>
                );
            },
        },
        {
            id: "retireDetails",
            size: 38,
            header: "",
            cell: cell => {
                return (
                    <div className="flex flex-end justify-end p-4">
                        <Button
                            onClick={e => {
                                e.stopPropagation();
                                console.log(cell);
                                navigate.push(`/homepage/retirements/${cell.row.original.id}`);
                            }}
                        >
                            Retirement details
                        </Button>
                    </div>
                );
            },
        },
    ];
    const rows = data?.user?.retirementsCreated || [];
    return <ListVisualizer columns={columns} data={rows} isLoading={loading}  />;
};

export default RetirementList;
