import type { FilterFn } from "@tanstack/react-table";
import type { OrderRow, RemainderFilterOption } from "./types";

export const inNumberRange: FilterFn<OrderRow> = (
  row,
  columnId,
  filterValue
) => {
  const value = row.getValue(columnId) as number;
  const [min, max] = filterValue as [number | undefined, number | undefined];

  if (min !== undefined && max !== undefined) {
    return value >= min && value <= max;
  }
  if (min !== undefined) {
    return value >= min;
  }
  if (max !== undefined) {
    return value <= max;
  }
  return true;
};

export const inDateRange: FilterFn<OrderRow> = (row, columnId, filterValue) => {
  const value = row.getValue(columnId) as string;
  const [startDate, endDate] = filterValue as [
    string | undefined,
    string | undefined,
  ];

  if (!value) return false;

  const rowDate = new Date(value).getTime();

  if (startDate && endDate) {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return rowDate >= start && rowDate <= end;
  }
  if (startDate) {
    const start = new Date(startDate).getTime();
    return rowDate >= start;
  }
  if (endDate) {
    const end = new Date(endDate).getTime();
    return rowDate <= end;
  }
  return true;
};

export const hasRemainder: FilterFn<OrderRow> = (
  row,
  _columnId,
  filterValue
) => {
  const filters = filterValue as RemainderFilterOption[];

  if (!filters || filters.length === 0) return true;

  return filters.some((filter) => {
    if (filter === "No") {
      return (
        !row.original.r1 &&
        !row.original.r2 &&
        !row.original.r3 &&
        row.original.callReminders.length === 0
      );
    }
    if (filter === "R1") return !!row.original.r1;
    if (filter === "R2") return !!row.original.r2;
    if (filter === "R3") return !!row.original.r3;
    if (filter === "Call") return row.original.callReminders.length > 0;
    return false;
  });
};

export const multiFieldSearch: FilterFn<OrderRow> = (
  row,
  _columnId,
  filterValue
) => {
  const searchValue = (filterValue as string)?.toLowerCase().trim();

  if (!searchValue) return true;

  const orderId = row.original.orderId?.toLowerCase() || "";
  const customerId = row.original.customerId?.toLowerCase() || "";
  const mobileNumber = row.original.mobileNumber?.toLowerCase() || "";

  return (
    orderId.includes(searchValue) ||
    customerId.includes(searchValue) ||
    mobileNumber.includes(searchValue)
  );
};
