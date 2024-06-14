"use client";

import React from "react";
import { Badge } from "../ui/badge";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";

export type Project = {
    id: string;
    title: string;
    category: string;
    status: string;
    description: string;
    country: string;
    standard: string;
    imageUrl: string;
};

export const data: Project[] = [
    {
        id: "1",
        title: "Sylva Fertilis, Argentan, FR",
        category: "Biomass Removal",
        status: "Active",
        description:
            "Sylva Fertilis, a part of the SLB Group, a forestry consortium in France, specializes in the manufacturing of high-quali...",
        country: "France",
        standard: "PURO",
        imageUrl: "/retirement.png",
    },
    {
        id: "1",
        title: "Sylva Fertilis, Argentan, FR",
        category: "Biomass Removal",
        status: "Active",
        description:
            "Sylva Fertilis, a part of the SLB Group, a forestry consortium in France, specializes in the manufacturing of high-quali...",
        country: "France",
        standard: "PURO",
        imageUrl: "/retirement.png",
    },
    {
        id: "1",
        title: "Sylva Fertilis, Argentan, FR",
        category: "Biomass Removal",
        status: "Active",
        description:
            "Sylva Fertilis, a part of the SLB Group, a forestry consortium in France, specializes in the manufacturing of high-quali...",
        country: "France",
        standard: "PURO",
        imageUrl: "/retirement.png",
    },
];

export const columns: ColumnDef<Project>[] = [
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "country",
        header: "Country",
    },
    {
        accessorKey: "standard",
        header: "Standard",
    },
    {
        accessorKey: "imageUrl",
        header: "Image",
    },
];

const ProjectTable: React.FC = () => {
    const table = useReactTable<Project>({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {table.getRowModel().rows.map(row => (
                <div key={row.id} className="bg-white rounded-lg shadow-lg  relative overflow-hidden">
                    <div
                        className="h-40 bg-cover bg-center rounded-t-lg"
                        style={{ backgroundImage: `url(${row.getValue("imageUrl")})` }}
                    ></div>
                    <div className="p-4">
                        <h3 className="text-lg font-semibold">{row.getValue("title")}</h3>
                        <p className="text-gray-500">
                            {row.getValue("standard")} · {row.getValue("country")}
                        </p>
                        <p className="text-gray-700 mt-2">{row.getValue("description")}</p>
                        <div className="mt-4 flex gap-1">
                            <Badge>{row.getValue("category")}</Badge>
                            <Badge>{row.getValue("status")}</Badge>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProjectTable;
