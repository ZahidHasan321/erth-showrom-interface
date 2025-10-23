import type { Order } from "@/types/order";
import type { OrderSchema } from "@/schemas/work-order-schema";

export function mapApiOrderToFormOrder(apiOrder: Order): OrderSchema {
  return {
    // Fields from API
    OrderID: apiOrder.fields.OrderID,
    CustomerID: apiOrder.fields.CustomerID,
    OrderDate: apiOrder.fields.OrderDate,
    OrderStatus: apiOrder.fields.OrderStatus,
    OrderTotal: apiOrder.fields.OrderTotal,
    Notes: apiOrder.fields.Notes,
    Campaigns: apiOrder.fields.Campaigns,
    orderType: (apiOrder.fields.OrderType as any) || "pickUp",
    paymentType: (apiOrder.fields.PaymentType as any) || undefined,
    discountType: (apiOrder.fields.DiscountType as any) || undefined,
    referralCode: apiOrder.fields.ReferralCode || undefined,
    discountValue: apiOrder.fields.DiscountValue ?? undefined,
    charges: {
      fabric: apiOrder.fields.FabricCharge ?? 0,
      stitching: apiOrder.fields.StitchingCharge ?? 0,
      style: apiOrder.fields.StyleCharge ?? 0,
      delivery: apiOrder.fields.DeliveryCharge ?? 0,
      shelf: apiOrder.fields.ShelfCharge ?? 0,
    },
    advance: apiOrder.fields.Advance ?? undefined,
    balance: apiOrder.fields.Balance ?? undefined,
    numOfFabrics: apiOrder.fields.NumOfFabrics ?? 0,
  };
}

export function mapFormOrderToApiOrder(
  formOrder: Partial<OrderSchema>,
  orderId?: string
): { id?: string; fields: Partial<Order["fields"]> } {
  const apiOrder: { id?: string; fields: Partial<Order["fields"]> } = {
    fields: {
      OrderID: formOrder.OrderID,
      CustomerID: formOrder.CustomerID,
      OrderDate: formOrder.OrderDate,
      OrderStatus:
        formOrder.OrderStatus === "Processing"
          ? "Pending"
          : formOrder.OrderStatus,
      OrderTotal: formOrder.OrderTotal,
      Notes: formOrder.Notes,
      Campaigns: formOrder.Campaigns,
      OrderType: formOrder.orderType,
      PaymentType: formOrder.paymentType,
      DiscountType: formOrder.discountType,
      ReferralCode: formOrder.referralCode || "",
      DiscountValue: formOrder.discountValue,
      FabricCharge: formOrder.charges?.fabric,
      StitchingCharge: formOrder.charges?.stitching,
      StyleCharge: formOrder.charges?.style,
      DeliveryCharge: formOrder.charges?.delivery,
      ShelfCharge: formOrder.charges?.shelf,
      Advance: formOrder.advance,
      Balance: formOrder.balance,
      NumOfFabrics: formOrder.numOfFabrics,
    },
  };
  if (orderId) {
    apiOrder.id = orderId;
  }
  return apiOrder;
}
