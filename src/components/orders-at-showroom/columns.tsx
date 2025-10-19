import { type ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import type { CallReminder, Escalation, OrderRow, Reminder } from "./types";
import { inNumberRange, inDateRange, hasRemainder } from "./filterFns";

const dateFormatter = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" });

export const ordersAtShowroomColumns: ColumnDef<OrderRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="translate-y-[2px]"
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
        aria-label="Select all orders"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="translate-y-[2px]"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
        aria-label={`Select order ${row.original.orderId}`}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "orderId",
    header: "Order ID",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.orderId}</span>
    ),
  },
  {
    accessorKey: "customerId",
    header: "Customer ID",
  },
  {
    accessorKey: "customerNickName",
    header: "Customer Nick name",
  },
  {
    accessorKey: "orderType",
    header: "Order Type",
    cell: ({ row }) => {
      const type = row.original.orderType;
      const colorMap = {
        Brova: "bg-green-100 text-green-700 border-green-200",
        Final: "bg-red-100 text-red-700 border-red-200",
        Alteration: "bg-amber-100 text-amber-700 border-amber-200",
      };
      const color =
        colorMap[type as keyof typeof colorMap] ||
        "bg-gray-100 text-gray-700 border-gray-200";

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
    header: "Mobile No",
    cell: ({ row }) => {
      const mobile = row.original.mobileNumber;
      return <span className="text-sm">{mobile}</span>;
    },
  },
  {
    accessorKey: "remainingPayment",
    header: "Remaining payment",
    cell: ({ row }) => (
      <span className="font-medium">
        KWD{" "}
        {row.original.remainingPayment.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
    filterFn: inNumberRange,
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => (
      <span className="text-right font-medium">
        {row.original.quantity.toLocaleString("en-IN")}
      </span>
    ),
    filterFn: inNumberRange,
  },
  {
    accessorKey: "promisedDeliveryDate",
    header: "Promised delivery date",
    cell: ({ row }) => (
      <span>{formatDate(row.original.promisedDeliveryDate)}</span>
    ),
    filterFn: inDateRange,
  },
  {
    accessorKey: "receivedAtShowroom",
    header: "Received at showroom",
    cell: ({ row }) =>
      row.original.receivedAtShowroom ? (
        <span>{formatDate(row.original.receivedAtShowroom)}</span>
      ) : (
        <span className="text-muted-foreground">Pending</span>
      ),
  },
  {
    accessorKey: "delayInDays",
    header: "Delay",
    cell: ({ row }) => (
      <span
        className={cn(
          "rounded-full px-2 py-1 text-xs font-medium",
          row.original.delayInDays > 0
            ? "bg-destructive/10 text-destructive"
            : "bg-emerald-100 text-emerald-700"
        )}
      >
        {row.original.delayInDays > 0
          ? `${row.original.delayInDays} day${
              row.original.delayInDays === 1 ? "" : "s"
            }`
          : "On time"}
      </span>
    ),
  },
  {
    id: "r1",
    header: "R1",
    cell: ({ row }) => <ReminderCell label="R1" reminder={row.original.r1} />,
  },
  {
    id: "r2",
    header: "R2",
    cell: ({ row }) => <ReminderCell label="R2" reminder={row.original.r2} />,
  },
  {
    id: "call-reminders",
    header: "Call Remainders",
    cell: ({ row }) => (
      <CallReminderCell reminders={row.original.callReminders} />
    ),
  },
  {
    id: "escalations",
    header: "Escalations",
    cell: ({ row }) => <EscalationCell escalation={row.original.escalation} />,
  },
  {
    id: "remainders",
    filterFn: hasRemainder,
  },
];

function ReminderCell({
  label,
  reminder,
}: {
  label: string;
  reminder?: Reminder;
}) {
  if (!reminder) {
    return <span className="text-muted-foreground text-sm">No {label}</span>;
  }

  return (
    <div className="flex flex-row items-center gap-2">
      <span className="text-sm font-medium">{formatDate(reminder.date)}</span>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Notes
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{label} notes</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">{formatDate(reminder.date)}</p>
            <p>{reminder.note}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CallReminderCell({ reminders }: { reminders: CallReminder[] }) {
  if (reminders.length === 0) {
    return (
      <span className="text-muted-foreground text-sm">No call remainders</span>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {reminders.map((reminder) => (
        <div
          key={reminder.id}
          className="rounded-lg border border-border bg-muted/30 p-2 hover:shadow-md"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {formatDate(reminder.date)}
            </span>
            <span
              className={cn(
                "font-medium",
                reminder.connected
                  ? "text-emerald-600"
                  : "text-muted-foreground"
              )}
            >
              {reminder.connected ? "Connected" : "Not connected"}
            </span>
          </div>
          <p className="mt-1 text-sm leading-relaxed">{reminder.note}</p>
        </div>
      ))}
    </div>
  );
}

function EscalationCell({ escalation }: { escalation?: Escalation }) {
  if (!escalation || escalation.status === "None") {
    return <span className="text-muted-foreground text-sm">No escalation</span>;
  }

  return (
    <div className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-destructive">Escalated</span>
      {escalation.date && (
        <span className="text-muted-foreground">
          {formatDate(escalation.date)}
        </span>
      )}
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return dateFormatter.format(parsed);
}
