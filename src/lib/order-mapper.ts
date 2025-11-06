import type { Order } from "@/types/order";
import type { OrderSchema } from "@/schemas/work-order-schema";

export function mapApiOrderToFormOrder(apiOrder: Order): OrderSchema {
  return {
    // Fields from API
    orderID: apiOrder.fields.OrderID,
    fatoura: apiOrder.fields.Fatoura,
    customerID: apiOrder.fields.CustomerID,
    orderDate: apiOrder.fields.OrderDate,
    orderStatus: apiOrder.fields.OrderStatus,
    // orderTotal: apiOrder.fields.OrderTotal,
    notes: apiOrder.fields.Notes,
    homeDelivery: apiOrder.fields.HomeDelivery?? false,
    campaigns: apiOrder.fields.Campaigns,
    orderType: (apiOrder.fields.OrderType as any) || "work",
    paymentType: (apiOrder.fields.PaymentType as any) || undefined,
    paymentRefNo: apiOrder.fields.PaymentRefNo || undefined,
    orderTaker: apiOrder.fields.OrderTaker?.[0] || undefined,
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
    paid: apiOrder.fields.Paid ?? 0,
    balance: apiOrder.fields.Balance ?? 0,
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
      // OrderTotal: formOrder.orderTotal,
      HomeDelivery: formOrder.homeDelivery,
      Notes: formOrder.notes,
      Campaigns: formOrder.campaigns,
      OrderType: formOrder.orderType,
      PaymentType: formOrder.paymentType,
      PaymentRefNo: formOrder.paymentRefNo,
      OrderTaker: formOrder.orderTaker ? [formOrder.orderTaker] : undefined,
      DiscountType: formOrder.discountType,
      ReferralCode: formOrder.referralCode || "",
      DiscountValue: formOrder.discountValue,
      FabricCharge: formOrder.charges?.fabric,
      StitchingCharge: formOrder.charges?.stitching,
      StyleCharge: formOrder.charges?.style,
      DeliveryCharge: formOrder.charges?.delivery,
      ShelfCharge: formOrder.charges?.shelf,
      Advance: formOrder.advance,
      Paid: formOrder.paid,
      Balance: formOrder.balance,
      NumOfFabrics: formOrder.numOfFabrics,
    },
  };
  if (orderId) {
    apiOrder.id = orderId;
  }
  return apiOrder;
}
