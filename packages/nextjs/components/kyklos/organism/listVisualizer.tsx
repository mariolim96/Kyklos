"use client";

import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { DropdownMenuCheckboxes } from "../molecules/checkboxMenu";
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

// Define generic props
interface ListVisualizerProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
}

function ListVisualizer<T>({ data, columns, isLoading }: ListVisualizerProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

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
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  //   const t = (
  //         <Table>
  //           <TableHeader className="h-12">
  //             {table.getHeaderGroups().map(headerGroup => (
  //               <TableRow key={headerGroup.id}>
  //                 {headerGroup.headers.map(header => (
  //                   <TableHead key={header.id}>
  //                     {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
  //                   </TableHead>
  //                 ))}
  //               </TableRow>
  //             ))}
  //           </TableHeader>
  //           <TableBody>
  //             {table.getRowModel().rows.length ? (
  //               table.getRowModel().rows.map(row => (
  //                 <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="h-24">
  //                   {row.getVisibleCells().map(cell => (
  //                     <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
  //                   ))}
  //                 </TableRow>
  //               ))
  //             ) : (
  //               <TableRow>
  //                 <TableCell colSpan={columns.length} className="h-24 text-center">
  //                   {isLoading ? "loading" : "No results"}
  //                 </TableCell>
  //               </TableRow>
  //             )}
  //           </TableBody>
  //         </Table>
  //       </div>
  //       <div className="flex items-center justify-end space-x-2 py-4">
  //         <div className="flex-1 text-sm text-muted-foreground">
  //           {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
  //           selected.
  //         </div>
  //         <div className="space-x-2">
  //           <Button
  //             variant="outline"
  //             size="sm"
  //             onClick={() => table.previousPage()}
  //             disabled={!table.getCanPreviousPage()}
  //           >
  //             Previous
  //           </Button>
  //           <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
  //             Next
  //           </Button>
  //         </div>
  //       </div>
  //     // </div>
  //   );
  const tableRenderer = table.getHeaderGroups().map(headerGroup => (
    <>
      <div className="flex items-center gap-4 flex-wrap bg-muted">
        <div className="flex-grow">
          <div className="flex items-center gap-x-2 gap-y-4 flex-wrap">
            {headerGroup.headers.map(header => (
              <>{header.column.getCanFilter() ? <Filter column={header.column} /> : null}</>
            ))}
          </div>
        </div>
      </div>

      <Table>
        <TableHeader className="h-12">
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="h-24">
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {isLoading ? "loading" : "No results"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  ));
  return <div className="relative w-full overflow-auto shadow-lg shadow-muted m-4">{tableRenderer}</div>;
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
