/* eslint-disable @typescript-eslint/no-unused-vars */
import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  //allows us to define custom properties for our columns
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "multi";
  }
}
