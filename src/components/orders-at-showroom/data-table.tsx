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
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, SortAscIcon, SortDescIcon, X } from "lucide-react";

import type { OrderRow, RemainderFilterOption } from "./types";
import {
  inNumberRange,
  inDateRange,
  hasRemainder,
  multiFieldSearch,
} from "./filterFns";

type OrdersDataTableProps = {
  columns: ColumnDef<OrderRow, unknown>[];
  data: OrderRow[];
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
};

export function OrdersDataTable({
  columns,
  data,
  rowSelection,
  onRowSelectionChange,
}: OrdersDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      lastRemainderDate: false, // Hide by default as it's only for sorting
    });

  const [orderIdSearch, setOrderIdSearch] = React.useState("");
  const [customerIdSearch, setCustomerIdSearch] = React.useState("");
  const [mobileNumberSearch, setMobileNumberSearch] = React.useState("");

  const [deliveryDateFrom, setDeliveryDateFrom] = React.useState<
    Date | undefined
  >();
  const [deliveryDateTo, setDeliveryDateTo] = React.useState<
    Date | undefined
  >();
  const [paymentMin, setPaymentMin] = React.useState<string>("");
  const [paymentMax, setPaymentMax] = React.useState<string>("");
  const [quantityMin, setQuantityMin] = React.useState<string>("");
  const [quantityMax, setQuantityMax] = React.useState<string>("");
  const [remainderFilters, setRemainderFilters] = React.useState<
    RemainderFilterOption[]
  >([]);

  // Refs for focusing inputs after clearing
  const orderIdInputRef = React.useRef<HTMLInputElement>(null);
  const customerIdInputRef = React.useRef<HTMLInputElement>(null);
  const mobileInputRef = React.useRef<HTMLInputElement>(null);

  // Apply delivery date filter
  React.useEffect(() => {
    const column = table.getColumn("promisedDeliveryDate");
    if (deliveryDateFrom || deliveryDateTo) {
      column?.setFilterValue([
        deliveryDateFrom?.toISOString(),
        deliveryDateTo?.toISOString(),
      ]);
    } else {
      column?.setFilterValue(undefined);
    }
  }, [deliveryDateFrom, deliveryDateTo]);

  // Apply payment range filter
  React.useEffect(() => {
    const column = table.getColumn("remainingPayment");
    const min = paymentMin ? parseFloat(paymentMin) : undefined;
    const max = paymentMax ? parseFloat(paymentMax) : undefined;
    if (min !== undefined || max !== undefined) {
      column?.setFilterValue([min, max]);
    } else {
      column?.setFilterValue(undefined);
    }
  }, [paymentMin, paymentMax]);

  // Apply quantity range filter
  React.useEffect(() => {
    const column = table.getColumn("quantity");
    const min = quantityMin ? parseInt(quantityMin) : undefined;
    const max = quantityMax ? parseInt(quantityMax) : undefined;
    if (min !== undefined || max !== undefined) {
      column?.setFilterValue([min, max]);
    } else {
      column?.setFilterValue(undefined);
    }
  }, [quantityMin, quantityMax]);

  // Apply remainder filter
  React.useEffect(() => {
    const column = table.getColumn("remainders");
    if (remainderFilters.length > 0) {
      column?.setFilterValue(remainderFilters);
    } else {
      column?.setFilterValue(undefined);
    }
  }, [remainderFilters]);

  const handleRemainderToggle = (value: RemainderFilterOption) => {
    setRemainderFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSearch = () => {
    // Apply search filters to respective columns
    if (orderIdSearch) {
      table.getColumn("orderId")?.setFilterValue(orderIdSearch);
    } else {
      table.getColumn("orderId")?.setFilterValue(undefined);
    }

    if (customerIdSearch) {
      table.getColumn("customerId")?.setFilterValue(customerIdSearch);
    } else {
      table.getColumn("customerId")?.setFilterValue(undefined);
    }

    if (mobileNumberSearch) {
      table.getColumn("mobileNumber")?.setFilterValue(mobileNumberSearch);
    } else {
      table.getColumn("mobileNumber")?.setFilterValue(undefined);
    }
  };

  const clearAllFilters = () => {
    // Clear other filters
    setDeliveryDateFrom(undefined);
    setDeliveryDateTo(undefined);
    setPaymentMin("");
    setPaymentMax("");
    setQuantityMin("");
    setQuantityMax("");
    setRemainderFilters([]);
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    enableRowSelection: true,
    onRowSelectionChange,
    getRowId: (row) => row.id,
    columnResizeMode: "onChange",
    filterFns: {
      inNumberRange,
      inDateRange,
      hasRemainder,
      multiFieldSearch,
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const rows = table.getRowModel().rows;

  const hasActiveFilters =
    deliveryDateFrom ||
    deliveryDateTo ||
    paymentMin ||
    paymentMax ||
    quantityMin ||
    quantityMax ||
    remainderFilters.length > 0;

  return (
    <div className="space-y-4 max-w-[1440px]">
      {/* Search section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end max-w-4xl rounded-lg border bg-muted/50 p-4">
        <div className="w-full sm:flex-1 space-y-1.5">
          <Label htmlFor="order-id-search" className="text-sm font-medium">
            Order ID
          </Label>
          <div className="relative">
            <Input
              id="order-id-search"
              ref={orderIdInputRef}
              placeholder="Enter order ID..."
              value={orderIdSearch}
              className="pr-10"
              onChange={(e) => {
                const v = e.target.value;
                setOrderIdSearch(v);
                if (v === "") {
                  table.getColumn("orderId")?.setFilterValue(undefined);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            {orderIdSearch && (
              <button
                type="button"
                title="Clear search"
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setOrderIdSearch("");
                  table.getColumn("orderId")?.setFilterValue(undefined);
                  orderIdInputRef.current?.focus();
                }}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <div className="w-full sm:flex-1 space-y-1.5">
          <Label htmlFor="customer-id-search" className="text-sm font-medium">
            Customer ID
          </Label>
          <div className="relative">
            <Input
              id="customer-id-search"
              ref={customerIdInputRef}
              placeholder="Enter customer ID..."
              value={customerIdSearch}
              className="pr-10"
              onChange={(e) => {
                const v = e.target.value;
                setCustomerIdSearch(v);
                if (v === "") {
                  table.getColumn("customerId")?.setFilterValue(undefined);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            {customerIdSearch && (
              <button
                type="button"
                title="Clear search"
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setCustomerIdSearch("");
                  table.getColumn("customerId")?.setFilterValue(undefined);
                  customerIdInputRef.current?.focus();
                }}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <div className="w-full sm:flex-1 space-y-1.5">
          <Label htmlFor="mobile-search" className="text-sm font-medium">
            Mobile Number
          </Label>
          <div className="relative">
            <Input
              id="mobile-search"
              ref={mobileInputRef}
              placeholder="Enter mobile number..."
              value={mobileNumberSearch}
              className="pr-10"
              onChange={(e) => {
                const v = e.target.value;
                setMobileNumberSearch(v);
                if (v === "") {
                  table.getColumn("mobileNumber")?.setFilterValue(undefined);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            {mobileNumberSearch && (
              <button
                type="button"
                title="Clear search"
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setMobileNumberSearch("");
                  table.getColumn("mobileNumber")?.setFilterValue(undefined);
                  mobileInputRef.current?.focus();
                }}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <Button onClick={handleSearch} className="w-full sm:w-auto gap-2">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>

      {/* Filters section */}
      <div className="space-y-4 max-w-4xl rounded-lg border bg-muted/30 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Filters</h3>
          {
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className={`h-auto px-2 py-1 text-xs ${!hasActiveFilters && "invisible"}`}
            >
              <X className="h-4 w-4" />
              Clear all
            </Button>
          }
        </div>

        <div className="flex flex-col md:flex-row gap-6 ">
          {/* Delivery Date Range */}
          <div className="space-y-2 w-80">
            <Label className="text-sm font-medium">
              Promised Delivery Date
            </Label>
            <div className="flex items-center gap-2">
              <div className="flex-1 space-y-1">
                <DatePicker
                  value={deliveryDateFrom}
                  placeholder="From"
                  onChange={(date) => setDeliveryDateFrom(date ?? undefined)}
                />
              </div>
              <div className="flex-1 space-y-1">
                <DatePicker
                  value={deliveryDateTo}
                  placeholder="To"
                  onChange={(date) => setDeliveryDateTo(date ?? undefined)}
                />
              </div>
            </div>
          </div>

          {/* Remaining Payment Range */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Remaining Payment</Label>
            <div className="flex flex-row w-50">
              <Input
                type="number"
                placeholder="Min"
                value={paymentMin}
                onChange={(e) => setPaymentMin(e.target.value)}
                className="text-sm px-2 rounded-tr-none rounded-br-none"
              />
              <Input
                type="number"
                placeholder="Max"
                value={paymentMax}
                onChange={(e) => setPaymentMax(e.target.value)}
                className="text-sm px-2 rounded-tl-none rounded-bl-none"
              />
            </div>
          </div>

          {/* Quantity Range */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quantity</Label>
            <div className="flex flex-row gap-0 w-50">
              <Input
                type="number"
                placeholder="Min"
                value={quantityMin}
                onChange={(e) => setQuantityMin(e.target.value)}
                className="text-sm px-2 rounded-tr-none rounded-br-none"
              />
              <Input
                type="number"
                placeholder="Max"
                value={quantityMax}
                onChange={(e) => setQuantityMax(e.target.value)}
                className="text-sm px-2 rounded-tl-none rounded-bl-none"
              />
            </div>
          </div>
        </div>

        {/* Remainders */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Remainders</Label>
          <div className="flex flex-wrap gap-4">
            {(["No", "R1", "R2", "R3", "Call"] as const).map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`remainder-${option}`}
                  checked={remainderFilters.includes(option)}
                  onCheckedChange={() => handleRemainderToggle(option)}
                />
                <Label
                  htmlFor={`remainder-${option}`}
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option === "No"
                    ? "No Remainders"
                    : option === "Call"
                      ? "Call Remainders"
                      : option}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-start gap-2">
        {/* Sort dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative inline-block">
              <Button
                variant="outline"
                className={`${table.getState().sorting.length > 0 ? "bg-accent" : null}`}
              >
                <SortAscIcon className="w-8 h-8" />
                Sort
              </Button>
              {table.getState().sorting.length > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white shadow" />
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            {[
              {
                id: "promisedDeliveryDate",
                label: "Promised Delivery Date",
              },
              { id: "delayInDays", label: "Delays" },
              {
                id: "lastRemainderDate",
                label: "Last Remainder Date",
              },
              { id: "orderType", label: "Order Type" },
              { id: "remainingPayment", label: "Remaining Payment" },
            ].map((sortOption) => {
              const currentSort = table
                .getState()
                .sorting.find((s) => s.id === sortOption.id);
              const isSorted = !!currentSort;
              const isAsc = currentSort?.desc === false;

              return (
                <DropdownMenuCheckboxItem
                  key={sortOption.id}
                  checked={isSorted}
                  onCheckedChange={(checked) => {
                    const currentSorting = table.getState().sorting;
                    if (checked) {
                      table.setSorting([
                        ...currentSorting,
                        { id: sortOption.id, desc: false },
                      ]);
                    } else {
                      table.setSorting(
                        currentSorting.filter((s) => s.id !== sortOption.id)
                      );
                    }
                  }}
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  <div className="flex items-center justify-between w-full h-8">
                    <span className="flex-1">{sortOption.label}</span>
                    {isSorted && (
                      <Button
                        variant={"ghost"}
                        className="ml-2 hover:bg-accent rounded"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Toggle between ascending and descending for this column
                          const currentSorting = table.getState().sorting;
                          table.setSorting(
                            currentSorting.map((s) =>
                              s.id === sortOption.id
                                ? { ...s, desc: !s.desc }
                                : s
                            )
                          );
                        }}
                      >
                        {isAsc ? (
                          <Button variant={"ghost"} size={"icon"}>
                            <SortAscIcon className="h-8 w-8" />
                          </Button>
                        ) : (
                          <Button variant={"ghost"} size={"icon"}>
                            <SortDescIcon className="h-8 w-8" />
                          </Button>
                        )}
                      </Button>
                    )}
                  </div>
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Columns dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Columns</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(Boolean(value))
                    }
                    onSelect={(e) => {
                      e.preventDefault();
                    }}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-x-auto rounded-md border">
        <Table style={{ minWidth: "max-content" }}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: `${header.getSize()}px` }}
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
            {rows.length ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ width: `${cell.column.getSize()}px` }}
                    >
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
                  className="h-24 text-center text-muted-foreground"
                >
                  No orders match the selected filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
