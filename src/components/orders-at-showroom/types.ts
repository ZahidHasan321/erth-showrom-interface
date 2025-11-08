import type { Garment } from "@/types/garment";
import type { Order } from "@/types/order";
import type { Customer } from "@/types/customer";

/**
 * Garment row for orders at showroom table.
 * Each row represents a single garment with its associated order and customer info.
 */
export type GarmentRow = {
  // Garment info
  garmentId: string;
  garmentRecordId: string;
  pieceStage: string;

  // Order info
  orderId: string;
  orderRecordId: string;
  fatouraStage: string;

  // Customer info
  customerId: string;
  customerName: string;
  customerNickName?: string;
  mobileNumber: string;

  // Garment type (Brova or Final)
  orderType: "Brova" | "Final";

  // Delivery info
  promisedDeliveryDate: string;
  receivedAtShowroom?: string;
  delayInDays: number;

  // Full records for reference
  garment: Garment;
  order: Order;
  customer: Customer | null;
};
