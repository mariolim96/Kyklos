/* eslint-disable @typescript-eslint/no-unused-vars */
import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  export interface ColumnDefBase<TData extends RowData, TValue = unknown> extends ColumnDefExtensions<TData, TValue> {
    getUniqueValues?: AccessorFn<TData, unknown[]>;
    footer?: ColumnDefTemplate<HeaderContext<TData, TValue>>;
    cell?: ColumnDefTemplate<CellContext<TData, TValue>>;
    meta?: ColumnMeta<TData, TValue>;
    filterType?: "text" | "select" | "date" | "number";
  }
}
