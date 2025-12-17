import type { ApiResponse } from "../types/api";
import type { Order } from "../types/order";
import {
  createRecord,
  getRecords,
  getRecordById,
  searchAllRecords,
  updateRecord,
} from "./baseApi";

const TABLE_NAME = "ORDERS";

export const getOrders = () => getRecords<Order>(TABLE_NAME);

export const searchOrders = (
  query: Record<string, string>,
): Promise<ApiResponse<Order[]>> => {
  return searchAllRecords<Order[]>(TABLE_NAME, query);
};

export const getOrderById = (id: string): Promise<ApiResponse<Order>> => {
  return getRecordById<Order>(TABLE_NAME, id);
};
export const createOrder = (
  order: Partial<Order>,
): Promise<ApiResponse<Order>> => {
  return createRecord<Order>(TABLE_NAME, order);
};

export const updateOrder = (
  order: Partial<Order["fields"]>,
  orderId: string,
): Promise<ApiResponse<Order>> => {
  return updateRecord<Order>(TABLE_NAME, orderId, order) as Promise<
    ApiResponse<Order>
  >;
};

export const deleteOrder = async (
  orderId: string,
): Promise<ApiResponse<void>> => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const response = await fetch(
    `${BASE_URL}/airtable/${TABLE_NAME}/records/${orderId}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to delete order ${orderId}`);
  }

  const data = await response.json();
  return data;
};

/**
 * Fetch pending work orders for a specific customer
 * @param customerId - The numeric customer ID
 * @param limit - Maximum number of orders to return (default 5)
 * @returns Promise with list of pending work orders sorted by OrderDate (newest first)
 */
export const getPendingOrdersByCustomer = async (
  customerId: number,
  limit: number = 5,
  orderStatus: string = "Pending",
): Promise<ApiResponse<Order[]>> => {
  const response = await searchAllRecords<Order[]>(TABLE_NAME, {
    CustomerID: customerId,
    OrderStatus: orderStatus,
    OrderType: "WORK",
  });

  // Filter for pending work orders only (safety check), sort by OrderDate, and limit results
  if (response.data && Array.isArray(response.data)) {
    // Client-side filter to ensure only Pending work orders
    const pendingOrders = response.data.filter(
      (order) =>
        order.fields.OrderStatus === orderStatus &&
        order.fields.OrderType === "WORK",
    );

    // Sort by OrderDate (newest first)
    const sortedData = pendingOrders.sort((a, b) => {
      const dateA = a.fields.OrderDate
        ? new Date(a.fields.OrderDate).getTime()
        : 0;
      const dateB = b.fields.OrderDate
        ? new Date(b.fields.OrderDate).getTime()
        : 0;
      return dateB - dateA; // Descending order (newest first)
    });

    const limitedData = sortedData.slice(0, limit);
    return {
      ...response,
      data: limitedData,
      count: limitedData.length,
    };
  }

  return response;
};

/**
 * Get complete order details including all related data
 * Uses the specialized backend endpoint that joins customer and garment data
 * @param orderIdValue - The OrderID field value (not the record ID)
 * @returns Promise with complete order details
 */
export const getCompleteOrderDetails = async (
  orderIdValue: string,
): Promise<ApiResponse<any>> => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const response = await fetch(
    `${BASE_URL}/airtable/order_details/${orderIdValue}`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch complete order details for ${orderIdValue}`,
    );
  }

  const data = await response.json();
  return data;
};
