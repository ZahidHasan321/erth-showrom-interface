import type { Customer } from '../types/customer';
import type { ApiResponse } from '../types/api';
import { getRecords, getRecordById, searchRecords, createRecord } from './baseApi';

const TABLE_NAME = 'CUSTOMER';

export const getCustomers = () => getRecords<Customer>(TABLE_NAME);

export const getCustomerById = (id: string) => getRecordById<Customer>(TABLE_NAME, id);

export const searchCustomerByPhone = (phone: string): Promise<ApiResponse<Customer>> => {
  return searchRecords<Customer>(TABLE_NAME, { Phone: phone });
};

export const createCustomer = (customer: Partial<Customer>): Promise<ApiResponse<Customer>> => {
  return createRecord<Customer>(TABLE_NAME, customer);
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