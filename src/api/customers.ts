import type { ApiResponse } from '../types/api';
import type { Customer, UpsertResponseData } from '../types/customer';
import { createRecord, getRecords, searchRecords, upsertRecords } from './baseApi';

export interface UpsertApiResponse extends ApiResponse<UpsertResponseData<Customer>> {
  data?: UpsertResponseData<Customer>;
}

const TABLE_NAME = 'CUSTOMER';

export const getCustomers = () => getRecords<Customer>(TABLE_NAME);


export const searchCustomerByPhone = (phone: string): Promise<ApiResponse<Customer>> => {
  return searchRecords<Customer>(TABLE_NAME, { Phone: phone });
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
): Promise<UpsertApiResponse> => {
  const customersForUpsertRecords = customers as Array<{ id?: string; fields: Partial<Customer> }>;
  return upsertRecords<Customer>(TABLE_NAME, customersForUpsertRecords, keyFields) as Promise<UpsertApiResponse>;
};

// getCustomers result
// {
//   "status": "success",
//   "table_name": "CUSTOMER",
//   "count": 10,
//   "records": [
//     {
// "id": "bigint",
// "Phone": "bigint",
// "Name": "varchar",
// "NickName": "varchar",
// "CountryCode": "bigint",
// "AlternateCountryCode": "bigint",
// "AlternateMobile": "bigint",
// "whatsapp": "boolean",
// "Email": "varchar",
// "CustomerType": "varchar",
// "Nationality": "varchar",
// "InstaID": "bigint",
// "Governorate": "varchar",
// "Floor": "varchar",
// "Block": "varchar",
// "AptNo": "varchar",
// "Street": "varchar",
// "Landmark": "varchar",
// "HouseNo": "bigint?",
// "DOB": "date"
//     },
//     }
//   ]
// }