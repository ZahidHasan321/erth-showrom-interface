import type { Order } from "@/types/order";
import type { OrderSchema } from "@/schemas/schema";

export function mapApiOrderToFormOrder(apiOrder: Order): OrderSchema {
  return {
    // Fields from API
    OrderID: apiOrder.fields.OrderID,
    CustomerID: apiOrder.fields.CustomerID,
    OrderDate: apiOrder.fields.OrderDate,
    OrderStatus: apiOrder.fields.OrderStatus,
    OrderTotal: apiOrder.fields.OrderTotal,
    Notes: apiOrder.fields.Notes,

    // Default values for payment fields
    orderType: "pickUp",
    discountType: undefined,
    referralCode: undefined,
    discountValue: 0,
    charges: {
      fabric: 0,
      stitching: 0,
      style: 0,
      delivery: 0,
      shelf: 0,
    },
    advance: 0,
    balance: 0,
  };
}

export function mapFormOrderToApiOrder(formOrder: Partial<OrderSchema>, orderId?: string): { id?: string, fields: Partial<Order['fields']> } {
    const apiOrder: { id?: string, fields: Partial<Order['fields']> } = {
        fields: {
            OrderID: formOrder.OrderID,
            CustomerID: formOrder.CustomerID,
            OrderDate: formOrder.OrderDate,
            OrderStatus: formOrder.OrderStatus,
            OrderTotal: formOrder.OrderTotal,
            Notes: formOrder.Notes,
        }
    };
    if (orderId) {
        apiOrder.id = orderId;
    }
    return apiOrder;
}
