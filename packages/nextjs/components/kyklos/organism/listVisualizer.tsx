"use client";

import React from "react";
import { DropdownMenuCheckboxes } from "../molecules/checkboxMenu";
import { Input } from "../ui/input";
import Loader from "../ui/loader";
import { Separator } from "../ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import {
    Column,
    ColumnDef,
    ColumnFiltersState,
    FilterFn,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { CiBoxList } from "react-icons/ci";
import { PiSquaresFourLight } from "react-icons/pi";
import { useNavigate } from "~~/hooks/kyklos/useNavigate";
import { cn } from "~~/utils/utils";

// Define generic props
interface ListVisualizerProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    isLoading?: boolean;
    hasFilters?: boolean;
}

function ListVisualizer<T>({ data, columns, isLoading, hasFilters }: ListVisualizerProps<T>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const navigate = useNavigate();

    const table = useReactTable<T>({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        // debugTable: true,
        debugHeaders: true,
        debugColumns: false,
    });

    const tableRenderer = table.getHeaderGroups().map(headerGroup => (
        <>
            {hasFilters && (
                <>
                    <div className="flex items-center gap-4 flex-wrap bg-muted h-16 p-2 border-t-2 rounded-t-md">
                        <div className="flex-grow">
                            <div className="flex items-center gap-x-2 gap-y-4 flex-wrap">
                                {headerGroup.headers.map(header => (
                                    <>{header.column.getCanFilter() ? <Filter column={header.column} /> : null}</>
                                ))}
                            </div>
                        </div>
                        <div className="flex">
                            <CiBoxList className="w-[20px]  h-[20px] font-bold " />
                            <PiSquaresFourLight className="w-[20px]  h-[20px] " />
                        </div>
                    </div>
                    <Separator />
                </>
            )}
            <Table>
                <TableHeader className="h-12">
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row, i) => (
                            <TableRow
                                key={row.id}
                                className={cn(
                                    "h-24 cursor-pointer p-0",
                                    table.getRowModel().rows.length === i
                                        ? "[&_td:last-child]:rounded-b-md [&_td:first-child]:rounded-b-md"
                                        : "",
                                )}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map(cell => (
                                    <TableCell
                                        className="p-0 text-lg font-medium text-base-content"
                                        onClick={() => {
                                            console.log(row);
                                            navigate.push(`projects/project/${(row.original as any)?.id}`);
                                        }}
                                        key={cell.id}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        //  add border to the last row and cursor pointer
                        <TableRow className="[&_td:last-child]:rounded-b-md [&_td:first-child]:rounded-b-md  ">
                            <TableCell colSpan={columns.length} className="h-40 w-full text-center  ">
                                {!isLoading ? <Loader className="" /> : "No results"}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    ));
    return <div className="relative  overflow-auto shadow-lg shadow-content-2 mt-8 rounded-md">{tableRenderer}</div>;
}
function Filter({ column }: { column: Column<any, unknown> }) {
    const { filterVariant } = column.columnDef.meta ?? {};

    const columnFilterValue = column.getFilterValue() as string | undefined;
    const sortedUniqueValues = React.useMemo(
        () => (filterVariant === "text" ? [] : Array.from(column.getFacetedUniqueValues().keys()).sort()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [column.getFacetedUniqueValues(), filterVariant],
    );
    const input = (
        <>
            <datalist id={column.id + "list"}>
                {sortedUniqueValues.map((value: any) => (
                    <option value={value} key={value} />
                ))}
            </datalist>
            <Input
                type="text"
                value={(columnFilterValue ?? "") as string}
                onChange={value => column.setFilterValue(value)}
                placeholder={`Search...`}
                className="w-36 border shadow rounded"
            />
        </>
    );

    const onItemChange = (label: string, checked: boolean) => {
        debugger;
        const splittedValues = (columnFilterValue ?? "")?.split(",") ?? [];
        if (checked) {
            column.setFilterValue([...splittedValues, label].join(","));
            return;
        }
        const filteredValues = splittedValues.filter(value => value !== label);
        column.setFilterValue(filteredValues.join(","));
    };

    const multi = (
        <>
            <DropdownMenuCheckboxes
                name={"name"}
                onItemChange={onItemChange}
                items={
                    sortedUniqueValues.map((value: any) => ({
                        label: value,
                        checked: columnFilterValue == null ? false : columnFilterValue.includes(value),
                    })) ?? []
                }
            ></DropdownMenuCheckboxes>
        </>
    );
    return filterVariant === "text" ? input : multi;
}

export const checkFilter: FilterFn<any> = (row, columnId, value) => {
    const values = value.split(",");
    const cellValue = row.getValue(columnId) as string;
    return values.some((value: string) => cellValue.includes(value));
};

export default ListVisualizer;
