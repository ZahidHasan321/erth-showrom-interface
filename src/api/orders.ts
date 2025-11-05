import type { ApiResponse } from '../types/api';
import type { Order } from '../types/order';
import { createRecord, getRecords, getRecordById, searchAllRecords, updateRecord } from './baseApi';

const TABLE_NAME = 'ORDERS';

export const getOrders = () => getRecords<Order>(TABLE_NAME);

export const searchOrders = (query: Record<string, string>): Promise<ApiResponse<Order[]>> => {
  return searchAllRecords<Order[]>(TABLE_NAME, query);
};

export const getOrderById = (id: string): Promise<ApiResponse<Order>> => {
  return getRecordById<Order>(TABLE_NAME, id);
};
export const createOrder = (order: Partial<Order>): Promise<ApiResponse<Order>> => {
  return createRecord<Order>(TABLE_NAME, order);
};

export const updateOrder = (order: Partial<Order['fields']>, orderId: string): Promise<ApiResponse<Order>> => {
  return updateRecord<Order>(TABLE_NAME, orderId, order) as Promise<ApiResponse<Order>>
}