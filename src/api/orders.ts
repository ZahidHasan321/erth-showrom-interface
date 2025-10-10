import type { ApiResponse, UpsertApiResponse } from '../types/api';
import type { Order } from '../types/order';
import { createRecord, getRecords, searchAllRecords, searchRecords, upsertRecords } from './baseApi';

const TABLE_NAME = 'ORDERS';

export const getOrders = () => getRecords<Order>(TABLE_NAME);

export const searchOrders = (query: Record<string, string>): Promise<ApiResponse<Order[]>> => {
  return searchAllRecords<Order[]>(TABLE_NAME, query);
};

export const getOrderById = (id: string): Promise<ApiResponse<Order>> => {
  return searchRecords<Order>(TABLE_NAME, { id: id });
};
export const createOrder = (order: Partial<Order>): Promise<ApiResponse<Order>> => {
  return createRecord<Order>(TABLE_NAME, order);
};

export const upsertOrder = (
  orders: Array<{ id?: string; fields: Partial<Order['fields']> }>,
  keyFields: string[] = ['OrderID'],
): Promise<UpsertApiResponse<Order>> => {
  return upsertRecords<Order>(TABLE_NAME, orders, keyFields) as Promise<UpsertApiResponse<Order>>;
};