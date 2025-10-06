"use client";

import {type ColumnDef, flexRender, getCoreRowModel, type RowData, useReactTable,} from "@tanstack/react-table";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
  }

  }

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  measurementIDs: string[];
  removeRow: (rowIndex: number) => void;
  updateData: (rowIndex: number, columnId: string, value: unknown) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  measurementIDs,
  removeRow,
  updateData,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      measurementIDs,
      removeRow,
      updateData,
    },
  });

  return (
    <div className="rounded-md border">
      <Table className="">
        <colgroup>
          {table.getHeaderGroups()[0]?.headers.map((header) => {
            const bgClass = "border";

            return (
              <col key={header.id} className={bgClass} span={header.colSpan} />
            );
          })}
        </colgroup>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={`px-4 py-2 text-center bg-muted ${
                      header.depth === 0 && header.index > 0 ? "ml-4" : ""
                    }`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={`rounded-md py-2 ${
                      cell.column.parent === undefined &&
                      cell.column.getIndex() > 0
                        ? "ml-4"
                        : ""
                    }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + 12}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
