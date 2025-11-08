import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { GarmentRow } from "./types";

const dateFormatter = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" });

function formatDate(value?: string) {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return dateFormatter.format(parsed);
}

export const garmentColumns: ColumnDef<GarmentRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="translate-y-0.5"
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(Boolean(value))
        }
        aria-label="Select all garments"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="translate-y-0.5"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
        aria-label={`Select garment ${row.original.garmentId}`}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "garmentId",
    header: "Garment ID",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.garmentId}</span>
    ),
  },
  {
    accessorKey: "orderId",
    header: "Order ID",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.orderId}</span>
    ),
  },
  {
    accessorKey: "customerNickName",
    header: "Customer",
    cell: ({ row }) => {
      const nickName = row.original.customerNickName;
      const name = row.original.customerName;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{nickName || name}</span>
          {nickName && (
            <span className="text-xs text-muted-foreground">{name}</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "orderType",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.orderType;
      const colorMap = {
        Brova: "bg-primary/10 text-primary border-primary/20",
        Final: "bg-secondary/10 text-secondary border-secondary/20",
      };
      const color = colorMap[type];

      return (
        <span
          className={cn(
            "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium",
            color
          )}
        >
          {type}
        </span>
      );
    },
  },
  {
    accessorKey: "mobileNumber",
    header: "Mobile",
    cell: ({ row }) => {
      const mobile = row.original.mobileNumber;
      return <span className="text-sm">{mobile}</span>;
    },
  },
  {
    accessorKey: "pieceStage",
    header: "Piece Stage",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.pieceStage}
      </span>
    ),
  },
  {
    accessorKey: "fatouraStage",
    header: "Fatoura Stage",
    cell: ({ row }) => {
      const stage = row.original.fatouraStage;
      return (
        <span className="text-sm font-medium text-foreground">
          {stage}
        </span>
      );
    },
  },
  {
    accessorKey: "promisedDeliveryDate",
    header: "Promised Delivery",
    cell: ({ row }) => (
      <span className="text-sm">
        {formatDate(row.original.promisedDeliveryDate)}
      </span>
    ),
  },
  {
    accessorKey: "delayInDays",
    header: "Delay",
    cell: ({ row }) => {
      const delay = row.original.delayInDays;
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
            delay > 0
              ? "bg-destructive/10 text-destructive"
              : "bg-emerald-100 text-emerald-700"
          )}
        >
          {delay > 0 ? `${delay} day${delay === 1 ? "" : "s"}` : "On time"}
        </span>
      );
    },
  },
  // Note: "Received at Showroom" column removed - will be added later when field is available in Garment type
];
