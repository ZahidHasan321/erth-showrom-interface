import type { ApiResponse } from '../types/api';
import type { Order } from '../types/order';
import type { Customer } from '../types/customer';
import type { Garment } from '../types/garment';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Detailed order response structure from the specialized order endpoints.
 * Includes order data with linked customer and garments.
 */
export interface OrderDetails {
  order: Order;
  customer: Customer | null;
  garments: Garment[];
}

/**
 * Filter parameters for orders list endpoint.
 * Can include any order field like Status, OrderID, etc.
 * Field names must match exactly with Airtable field names.
 */
export interface OrderFilters {
  OrderStatus?: "Pending" | "Completed" | "Cancelled";
  OrderID?: string;
  OrderType?: "WORK" | "SALES";
  PaymentType?: "k-net" | "cash" | "link-payment" | "installments" | "others";
  HomeDelivery?: boolean;
  FatouraStages?: string;  // Airtable field name (plural)
  [key: string]: string | boolean | number | undefined;
}

/**
 * Fetches detailed order information by OrderID field value (e.g., 'A-1001').
 * Returns order details with linked customer and garments records.
 *
 * @param orderIdValue The value of the OrderID field (not the Airtable record ID)
 * @returns Promise resolving to order details with customer and garments
 *
 * @example
 * ```typescript
 * const result = await getOrderDetails('A-1001');
 * if (result.status === 'success' && result.data) {
 *   console.log(result.data.order);      // Order record
 *   console.log(result.data.customer);   // Customer record (or null)
 *   console.log(result.data.garments);   // Array of Garment records
 * }
 * ```
 */
export const getOrderDetails = async (
  orderIdValue: string
): Promise<ApiResponse<OrderDetails>> => {
  const response = await fetch(
    `${BASE_URL}/airtable/order_details/${encodeURIComponent(orderIdValue)}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch order details for OrderID: ${orderIdValue}`);
  }

  const data = await response.json();
  return data as ApiResponse<OrderDetails>;
};

/**
 * Fetches a filtered list of orders with their details (customer and garments).
 * Each order in the response includes linked customer and garments data.
 *
 * @param filters Filter parameters to match orders. Empty object returns all orders.
 * @returns Promise resolving to array of order details
 *
 * @example
 * ```typescript
 * // Get all pending orders
 * const result = await getOrdersList({ OrderStatus: 'Pending' });
 *
 * // Get work orders with home delivery
 * const result = await getOrdersList({
 *   OrderType: 'WORK',
 *   HomeDelivery: true
 * });
 *
 * // Get all orders
 * const result = await getOrdersList({});
 * ```
 */
export const getOrdersList = async (
  filters: OrderFilters = {}
): Promise<ApiResponse<OrderDetails[]>> => {
  const response = await fetch(`${BASE_URL}/airtable/orders_list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(filters),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch orders list with filters: ${JSON.stringify(filters)}`);
  }

  const data = await response.json();
  return data as ApiResponse<OrderDetails[]>;
};

/**
 * Fetches all pending orders with their details.
 * Convenience wrapper around getOrdersList.
 *
 * @returns Promise resolving to array of pending order details
 */
export const getPendingOrders = (): Promise<ApiResponse<OrderDetails[]>> => {
  return getOrdersList({ OrderStatus: 'Pending' });
};

/**
 * Fetches all completed orders with their details.
 * Convenience wrapper around getOrdersList.
 *
 * @returns Promise resolving to array of completed order details
 */
export const getCompletedOrders = (): Promise<ApiResponse<OrderDetails[]>> => {
  return getOrdersList({ OrderStatus: 'Completed' });
};

/**
 * Fetches all work orders with their details.
 * Convenience wrapper around getOrdersList.
 *
 * @returns Promise resolving to array of work order details
 */
export const getWorkOrders = (): Promise<ApiResponse<OrderDetails[]>> => {
  return getOrdersList({ OrderType: 'WORK' });
};

/**
 * Fetches all sales orders with their details.
 * Convenience wrapper around getOrdersList.
 *
 * @returns Promise resolving to array of sales order details
 */
export const getSalesOrders = (): Promise<ApiResponse<OrderDetails[]>> => {
  return getOrdersList({ OrderType: 'SALES' });
};
