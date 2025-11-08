import { useQuery } from "@tanstack/react-query";
import { getOrdersList } from "@/api/ordersApi";
import type { OrderDetails } from "@/api/ordersApi";
import type { GarmentRow } from "@/components/orders-at-showroom/types";
import { FatouraStage, PieceStageLabels, FatouraStageLabels } from "@/types/stages";

/**
 * Calculate delay in days between promised delivery date and today
 */
function calculateDelay(promisedDeliveryDate: string): number {
  const promised = new Date(promisedDeliveryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day
  promised.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - promised.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
}

/**
 * Transform OrderDetails array into GarmentRow array for the showroom table.
 * Each garment becomes its own row with associated order and customer info.
 */
function transformToGarmentRows(ordersData: OrderDetails[]): GarmentRow[] {
  const garmentRows: GarmentRow[] = [];

  for (const orderDetail of ordersData) {
    const { order, customer, garments } = orderDetail;

    // Skip if no garments
    if (!garments || garments.length === 0) continue;

    for (const garment of garments) {
      // Determine order type based on Brova field
      const orderType = garment.fields.Brova ? "Brova" : "Final";

      // Get customer info
      const customerName = customer?.fields.Name || "Unknown";
      const customerNickName = customer?.fields.NickName;
      const mobileNumber = customer
        ? `${customer.fields.CountryCode} ${customer.fields.Phone}`
        : "N/A";

      // Calculate delay
      const delayInDays = calculateDelay(garment.fields.DeliveryDate);

      const garmentRow: GarmentRow = {
        // Garment info
        garmentId: String(garment.fields.GarmentId || garment.id),
        garmentRecordId: garment.id,
        pieceStage: PieceStageLabels[garment.fields.PieceStage] || "Unknown",

        // Order info
        orderId: String(order.fields.OrderID || order.id),
        orderRecordId: order.id,
        fatouraStage: FatouraStageLabels[order.fields.FatouraStages] || "Unknown",

        // Customer info
        customerId: customer?.id || "N/A",
        customerName: customerName || "Unknown",
        customerNickName: customerNickName || undefined,
        mobileNumber: mobileNumber || "N/A",

        // Garment type
        orderType,

        // Delivery info
        promisedDeliveryDate: garment.fields.DeliveryDate || new Date().toISOString(),
        receivedAtShowroom: undefined, // TODO: Add this field to Garment type when available
        delayInDays,

        // Full records
        garment,
        order,
        customer,
      };

      garmentRows.push(garmentRow);
    }
  }

  return garmentRows;
}

/**
 * Hook to fetch orders at showroom with specific fatoura stages.
 * Fetches orders with stages: BROVA_AT_SHOP_WAITING_APPROVAL, FINAL_BROVA_AT_SHOP, ALTERATION, CANCELLED
 * Returns garment-centric data where each row represents a garment.
 */
export function useShowroomOrders() {
  return useQuery({
    queryKey: ["showroom-orders"],
    queryFn: async () => {
      // Fetch orders with specific FatouraStages
      // We need to fetch separately for each stage since Airtable filters use exact match
      const targetStages = [
        FatouraStage.BROVA_AT_SHOP_WAITING_APPROVAL,
        FatouraStage.FINAL_BROVA_AT_SHOP,
        FatouraStage.ALTERATION,
        FatouraStage.CANCELLED,
      ];

      const allOrders: OrderDetails[] = [];

      // Fetch orders for each stage separately
      for (const stage of targetStages) {
        const response = await getOrdersList({
          FatouraStages: stage  // Use the exact Airtable field name (plural)
        });

        if (response.status === "success" && response.data) {
          allOrders.push(...response.data);
        }
      }

      // Transform to garment rows
      return transformToGarmentRows(allOrders);
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
