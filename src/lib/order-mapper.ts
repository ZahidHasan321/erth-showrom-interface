import type { Order } from "@/types/order";
import type { OrderSchema } from "@/schemas/work-order-schema";

export function mapApiOrderToFormOrder(apiOrder: Order): OrderSchema {
  return {
    // Fields from API
    orderID: apiOrder.fields.OrderID,
    customerID: apiOrder.fields.CustomerID,
    orderDate: apiOrder.fields.OrderDate,
    orderStatus: apiOrder.fields.OrderStatus,
    orderTotal: apiOrder.fields.OrderTotal,
    notes: apiOrder.fields.Notes,
    campaigns: apiOrder.fields.Campaigns,
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
      OrderID: formOrder.orderID,
      CustomerID: formOrder.customerID,
      OrderDate: formOrder.orderDate,
      OrderStatus: formOrder.orderStatus,
      OrderTotal: formOrder.orderTotal,
      Notes: formOrder.notes,
      Campaigns: formOrder.campaigns,
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
