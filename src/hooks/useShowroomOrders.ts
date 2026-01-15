import { useQuery } from "@tanstack/react-query";
import { getOrdersList } from "@/api/ordersApi";
import type { OrderDetails } from "@/api/ordersApi";
import type { OrderRow, GarmentRowData } from "@/components/orders-at-showroom/types";
import { PieceStageLabels, FatouraStageLabels } from "@/types/stages";

/**
 * Calculate delay in days between promised delivery date and today
 */
function calculateDelay(promisedDeliveryDate: string): number {
  const promised = new Date(promisedDeliveryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  promised.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - promised.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
}

/**
 * Calculate total order amount from charges
 */
function calculateTotal(order: OrderDetails['order']): number {
  const fields = order.fields;
  return (
    (fields.FabricCharge || 0) +
    (fields.StitchingCharge || 0) +
    (fields.StyleCharge || 0) +
    (fields.DeliveryCharge || 0) +
    (fields.ShelfCharge || 0)
  );
}

/**
 * Transform OrderDetails array into OrderRow array for the showroom table.
 */
function transformToOrderRows(ordersData: OrderDetails[]): OrderRow[] {
  const orderRows: OrderRow[] = [];

  for (const orderDetail of ordersData) {
    const { order, customer, garments } = orderDetail;

    // Transform garments for this order
    const garmentRowsData: GarmentRowData[] = garments.map((garment) => ({
      garmentId: String(garment.fields.GarmentId || garment.id),
      garmentRecordId: garment.id,
      pieceStage: garment.fields.PieceStages
        ? PieceStageLabels[garment.fields.PieceStages] || "Unknown"
        : "Unknown",
      isBrova: garment.fields.Brova || false,
      deliveryDate: garment.fields.DeliveryDate || "",
      delayInDays: calculateDelay(garment.fields.DeliveryDate || new Date().toISOString()),
      fabricSource: garment.fields.FabricSource || undefined,
      style: garment.fields.Style || undefined,
      garment,
    }));

    // Get customer info
    const customerName = customer?.fields.Name || "Unknown";
    const customerNickName = customer?.fields.NickName;
    const mobileNumber = customer
      ? `${customer.fields.CountryCode} ${customer.fields.Phone}`
      : "N/A";

    // Calculate total
    const totalAmount = order.fields.OrderTotal ?? (calculateTotal(order) - (order.fields.DiscountValue || 0));

    const orderRow: OrderRow = {
      // Order info
      orderId: String(order.fields.OrderID || order.id),
      orderRecordId: order.id,
      fatoura: order.fields.Fatoura,
      fatouraStage: order.fields.FatouraStages
        ? FatouraStageLabels[order.fields.FatouraStages] || "Unknown"
        : "Unknown",
      orderStatus: order.fields.OrderStatus,
      orderDate: order.fields.OrderDate,
      deliveryDate: order.fields.DeliveryDate,

      // Customer info
      customerId: customer?.id || "N/A",
      customerName,
      customerNickName,
      mobileNumber,

      // Order type and delivery
      orderType: order.fields.OrderType,
      homeDelivery: order.fields.HomeDelivery,

      // Financial info
      totalAmount,
      advance: order.fields.Advance,
      balance: totalAmount - (order.fields.Paid || 0),

      // Garments
      garmentsCount: garments.length,
      garments: garmentRowsData,

      // Full records
      order,
      customer,
    };

    orderRows.push(orderRow);
  }

  return orderRows;
}

/**
 * Hook to fetch orders at showroom with specific fatoura stages.
 * Returns order-centric data where each row represents an order with expandable garments.
 */
export function useShowroomOrders() {
  return useQuery({
    queryKey: ["showroom-orders"],
    queryFn: async () => {
      // Fetch orders with specific FatouraStages - starting with 2 stages
      const targetStages = [
        "BrovaAtShop",
        "FinalAtShop",
      ];

      const allOrders: OrderDetails[] = [];

      // Fetch orders for each stage separately
      for (const stage of targetStages) {
        const response = await getOrdersList({
          FatouraStages: stage,
        });

        if (response.status === "success" && response.data) {
          allOrders.push(...response.data);
        }
      }

      // Transform to order rows
      return transformToOrderRows(allOrders);
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
