/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
"use client";
import React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
interface Props {
  defaultData?: unknown[];
  columns?: Array<ColumnDef<unknown, unknown>>;
  loading?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Table({ columns = [], defaultData = [], loading }: Props) {
  const Headers = ["Name", "Symbol", "Balance", "Price", "Value"];
  const Rows = [
    ["GSC", "GSC", "10000", "0.1", "1000"],
    ["CRT", "CRT", "10000", "0.1", "1000"],
    ["ETH", "ETH", "10000", "0.1", "1000"],
    ["DAI", "DAI", "10000", "0.1", "1000"],
  ];
  const [data] = React.useState<unknown[]>(() => [...defaultData]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const rerender = React.useReducer(() => ({}), {})[1];
  const table = useReactTable({
    columns,
    data: data.length ? data : Rows,
    getCoreRowModel: getCoreRowModel<unknown>(),
  });
  return (
    <>
      {columns.length !== 0 ? (
        <div className="overflow-auto">
          <table className="table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td>No Data</td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-auto">
          <table className="table">
            <thead className="">
              <tr>
                {Headers.map((header, i) => (
                  <th key={i}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={`${i}-${j}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default Table;
