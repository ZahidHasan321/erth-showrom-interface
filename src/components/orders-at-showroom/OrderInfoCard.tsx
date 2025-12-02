import { Package, CreditCard, TrendingUp, Wallet, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type OrderInfoCardProps = {
  orderID?: string | number;
  fatoura?: number;
  orderStatus?: string;
  customerName?: string;
  orderType: "Work Order" | "Sales Order";
  homeDelivery?: boolean;
  paymentType?: string;
  numOfFabrics?: number;
  totalAmount?: number;
  advance?: number;
  balance?: number;
};

export function OrderInfoCard({
  orderID,
  fatoura,
  orderStatus,
  customerName,
  orderType,
  homeDelivery,
  paymentType,
  numOfFabrics,
  totalAmount,
  advance,
  balance,
}: OrderInfoCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Completed":
        return "text-primary font-semibold";
      case "Cancelled":
        return "text-destructive font-semibold";
      case "Pending":
        return "text-secondary font-semibold";
      default:
        return "text-muted-foreground font-medium";
    }
  };

  const formatPaymentType = (type?: string) => {
    if (!type) return "Not set";
    const formatted = type.replace(/-/g, " ");
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  return (
    <div className="w-fit absolute right-2.5 flex justify-end mt-2">
      <div className="bg-linear-to-br from-card to-accent/20 p-5 shadow-lg rounded-xl z-10 border-2 border-border/60 max-w-sm mr-4 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-border/50 pb-2">
          <h2 className="text-lg font-bold tracking-tight text-primary">
            {orderType} <span className="text-secondary">#{orderID || "New"}</span>
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-7 w-7 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {isExpanded && (
          <div className="space-y-2">
          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground min-w-20">Status:</span>
            <span className={getStatusColor(orderStatus)}>
              {orderStatus ?? "Pending"}
            </span>
          </div>

          {/* Customer */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground min-w-20">Customer:</span>
            <span className="font-semibold text-foreground">
              {customerName || "No customer yet"}
            </span>
          </div>

          {/* Fatoura Number */}
          {fatoura && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground min-w-20">Invoice #:</span>
              <span className="font-bold text-primary">
                {fatoura}
              </span>
            </div>
          )}

          {/* Delivery Type */}
          {homeDelivery !== undefined && (
            <div className="flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground min-w-[76px]">Delivery:</span>
              <span className="text-sm font-medium text-foreground">
                {homeDelivery ? "Home Delivery" : "Pick Up"}
              </span>
            </div>
          )}

          {/* Payment Type */}
          {paymentType && (
            <div className="flex items-center gap-2">
              <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground min-w-[76px]">Payment:</span>
              <span className="text-sm font-medium text-foreground">{formatPaymentType(paymentType)}</span>
            </div>
          )}

          {/* Number of Fabrics (Work Orders only) */}
          {orderType === "Work Order" && numOfFabrics !== undefined && numOfFabrics > 0 && (
            <div className="flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground min-w-[76px]">Fabrics:</span>
              <span className="text-sm font-medium text-foreground">{numOfFabrics || 0}</span>
            </div>
          )}

          {/* Financial Info */}
          {(totalAmount !== undefined && totalAmount > 0) || (advance !== undefined && advance > 0) || (balance !== undefined && balance > 0) ? (
            <div className="mt-3 pt-3 border-t border-border/50 space-y-1.5">
              {totalAmount !== undefined && totalAmount > 0 && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-primary" />
                  <span className="text-sm text-muted-foreground min-w-[76px]">Total:</span>
                  <span className="text-sm font-bold text-primary">{totalAmount.toFixed(2)} KWD</span>
                </div>
              )}
              {advance !== undefined && advance > 0 && (
                <div className="flex items-center gap-2">
                  <Wallet className="w-3.5 h-3.5 text-secondary" />
                  <span className="text-sm text-muted-foreground min-w-[76px]">Advance:</span>
                  <span className="text-sm font-semibold text-secondary">{advance.toFixed(2)} KWD</span>
                </div>
              )}
              {balance !== undefined && balance > 0 && (
                <div className="flex items-center gap-2">
                  <Wallet className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground min-w-[76px]">Balance:</span>
                  <span className="text-sm font-medium text-foreground">{balance.toFixed(2)} KWD</span>
                </div>
              )}
            </div>
          ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
