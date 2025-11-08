"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type RowSelectionState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, X, ChevronLeft, ChevronRight, Filter } from "lucide-react";

import type { GarmentRow } from "./types";

type GarmentDataTableProps = {
  columns: ColumnDef<GarmentRow, unknown>[];
  data: GarmentRow[];
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
};

export function GarmentDataTable({
  columns,
  data,
  rowSelection,
  onRowSelectionChange,
}: GarmentDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // Search states
  const [orderIdSearch, setOrderIdSearch] = React.useState("");
  const [mobileSearch, setMobileSearch] = React.useState("");
  const [customerIdSearch, setCustomerIdSearch] = React.useState("");
  const [orderTypeFilter, setOrderTypeFilter] = React.useState<string>("all");
  const [deliveryDateFrom, setDeliveryDateFrom] = React.useState<Date | undefined>();
  const [deliveryDateTo, setDeliveryDateTo] = React.useState<Date | undefined>();

  // Filter data client-side
  const filteredData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.filter((row) => {
      try {
        // Order ID filter
        if (orderIdSearch) {
          const orderId = row.orderId || "";
          if (!orderId.toLowerCase().includes(orderIdSearch.toLowerCase())) {
            return false;
          }
        }

        // Mobile number filter
        if (mobileSearch) {
          const mobile = row.mobileNumber || "";
          if (!mobile.toLowerCase().includes(mobileSearch.toLowerCase())) {
            return false;
          }
        }

        // Customer ID filter (search by name or nickname)
        if (customerIdSearch) {
          const searchLower = customerIdSearch.toLowerCase();
          const nameMatch = (row.customerName || "").toLowerCase().includes(searchLower);
          const nickNameMatch = (row.customerNickName || "").toLowerCase().includes(searchLower);
          if (!nameMatch && !nickNameMatch) {
            return false;
          }
        }

        // Order type filter
        if (orderTypeFilter !== "all" && row.orderType !== orderTypeFilter) {
          return false;
        }

        // Delivery date range filter
        if (deliveryDateFrom || deliveryDateTo) {
          const deliveryDate = new Date(row.promisedDeliveryDate);
          deliveryDate.setHours(0, 0, 0, 0);

          if (deliveryDateFrom) {
            const fromDate = new Date(deliveryDateFrom);
            fromDate.setHours(0, 0, 0, 0);
            if (deliveryDate < fromDate) {
              return false;
            }
          }

          if (deliveryDateTo) {
            const toDate = new Date(deliveryDateTo);
            toDate.setHours(23, 59, 59, 999);
            if (deliveryDate > toDate) {
              return false;
            }
          }
        }

        return true;
      } catch (error) {
        console.error("Error filtering row:", error, row);
        return true; // Include row on error to avoid hiding data
      }
    });
  }, [data, orderIdSearch, mobileSearch, customerIdSearch, orderTypeFilter, deliveryDateFrom, deliveryDateTo]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Clear all filters
  const clearAllFilters = () => {
    setOrderIdSearch("");
    setMobileSearch("");
    setCustomerIdSearch("");
    setOrderTypeFilter("all");
    setDeliveryDateFrom(undefined);
    setDeliveryDateTo(undefined);
  };

  const hasActiveFilters = orderIdSearch || mobileSearch || customerIdSearch || orderTypeFilter !== "all" || deliveryDateFrom || deliveryDateTo;

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="space-y-4 bg-card rounded-xl border border-border p-6 shadow-sm">
        {/* Header with clear button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Filters</span>
          </div>

          {/* Always render button, just toggle opacity */}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-8 text-xs hover:bg-destructive/10 hover:text-destructive transition-opacity"
            style={{ opacity: hasActiveFilters ? 1 : 0, pointerEvents: hasActiveFilters ? 'auto' : 'none' }}
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        </div>

        {/* First row - Search and Type filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Order ID Search */}
          <div className="space-y-2">
            <Label htmlFor="order-id-search" className="text-xs font-medium text-muted-foreground">
              Order ID
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="order-id-search"
                placeholder="Search order ID..."
                value={orderIdSearch}
                onChange={(e) => setOrderIdSearch(e.target.value)}
                className="pl-9 pr-9 bg-background border-border/60 focus:border-primary"
              />
              {/* Always render button, just toggle opacity */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-muted transition-opacity"
                onClick={() => setOrderIdSearch("")}
                style={{ opacity: orderIdSearch ? 1 : 0, pointerEvents: orderIdSearch ? 'auto' : 'none' }}
              >
                <X className="h-3.5 w-3.5" />
                <span className="sr-only">Clear</span>
              </Button>
            </div>
          </div>

          {/* Mobile Number Search */}
          <div className="space-y-2">
            <Label htmlFor="mobile-search" className="text-xs font-medium text-muted-foreground">
              Mobile Number
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="mobile-search"
                placeholder="Search mobile..."
                value={mobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
                className="pl-9 pr-9 bg-background border-border/60 focus:border-primary"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-muted transition-opacity"
                onClick={() => setMobileSearch("")}
                style={{ opacity: mobileSearch ? 1 : 0, pointerEvents: mobileSearch ? 'auto' : 'none' }}
              >
                <X className="h-3.5 w-3.5" />
                <span className="sr-only">Clear</span>
              </Button>
            </div>
          </div>

          {/* Customer Name Search */}
          <div className="space-y-2">
            <Label htmlFor="customer-search" className="text-xs font-medium text-muted-foreground">
              Customer Name
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="customer-search"
                placeholder="Search customer..."
                value={customerIdSearch}
                onChange={(e) => setCustomerIdSearch(e.target.value)}
                className="pl-9 pr-9 bg-background border-border/60 focus:border-primary"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-muted transition-opacity"
                onClick={() => setCustomerIdSearch("")}
                style={{ opacity: customerIdSearch ? 1 : 0, pointerEvents: customerIdSearch ? 'auto' : 'none' }}
              >
                <X className="h-3.5 w-3.5" />
                <span className="sr-only">Clear</span>
              </Button>
            </div>
          </div>

          {/* Order Type Filter */}
          <div className="space-y-2">
            <Label htmlFor="order-type-filter" className="text-xs font-medium text-muted-foreground">
              Order Type
            </Label>
            <Select value={orderTypeFilter} onValueChange={setOrderTypeFilter}>
              <SelectTrigger id="order-type-filter" className="bg-background border-border/60 focus:border-primary">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Brova">Brova</SelectItem>
                <SelectItem value="Final">Final</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Second row - Date range filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Delivery Date From */}
          <div className="space-y-2">
            <Label htmlFor="delivery-from" className="text-xs font-medium text-muted-foreground">
              Delivery From
            </Label>
            <DatePicker
              value={deliveryDateFrom ?? null}
              onChange={(date) => setDeliveryDateFrom(date ?? undefined)}
              placeholder="Start date"
              className="bg-background border-border/60 focus:border-primary w-full"
            />
          </div>

          {/* Delivery Date To */}
          <div className="space-y-2">
            <Label htmlFor="delivery-to" className="text-xs font-medium text-muted-foreground">
              Delivery To
            </Label>
            <DatePicker
              value={deliveryDateTo ?? null}
              onChange={(date) => setDeliveryDateTo(date ?? undefined)}
              placeholder="End date"
              className="bg-background border-border/60 focus:border-primary w-full"
            />
          </div>
        </div>

        {/* Results count - moved inside card */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredData.length}</span> of{" "}
            <span className="font-medium text-foreground">{data.length}</span> garment{data.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-primary/5 border-b-2 border-primary/20">
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    className={`font-semibold text-foreground ${
                      index !== headerGroup.headers.length - 1
                        ? 'border-r border-border/50'
                        : ''
                    }`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/30"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="text-muted-foreground">
                    No garments found at showroom.
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
