import type { ApiResponse, UpsertApiResponse } from '../types/api';
import type { Customer } from '../types/customer';
import { createRecord, getRecords, searchAllRecords, searchRecords, upsertRecords } from './baseApi';

const TABLE_NAME = 'CUSTOMER';

export const getCustomers = () => getRecords<Customer>(TABLE_NAME);


export const searchCustomerByPhone = (phone: string): Promise<ApiResponse<Customer[]>> => {
  return searchAllRecords<Customer[]>(TABLE_NAME, { Phone: phone });
};

export const searchPrimaryAccountByPhone = (phone: string): Promise<ApiResponse<Customer[]>> => {
  return searchAllRecords<Customer[]>(TABLE_NAME, { Phone: phone, accountType: 'Primary' });
};

export const getCustomerById = (id: string): Promise<ApiResponse<Customer>> => {
  return searchRecords<Customer>(TABLE_NAME, { id: id });
};
export const createCustomer = (customer: Partial<Customer>): Promise<ApiResponse<Customer>> => {
  return createRecord<Customer>(TABLE_NAME, customer);
};

export const upsertCustomer = (
  customers: Array<{ id?: string; fields: Partial<Customer['fields']> }>,
  keyFields: string[] = ['Phone'],
): Promise<UpsertApiResponse<Customer>> => {
  return upsertRecords<Customer>(TABLE_NAME, customers, keyFields) as Promise<UpsertApiResponse<Customer>>;
};